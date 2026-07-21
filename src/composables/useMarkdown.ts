import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeCallouts from 'rehype-callouts'
import rehypeStringify from 'rehype-stringify'
import hljs from 'highlight.js'
import { marked } from 'marked'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

export interface RenderedMarkdown {
  html: string
  headings: MarkdownHeading[]
}

/** 超过该行数的代码块默认折叠 */
const COLLAPSE_LINE_THRESHOLD = 24

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const textOf = (node: any): string => {
  if (!node) return ''
  if (node.type === 'text') return node.value || ''
  if (Array.isArray(node.children)) return node.children.map(textOf).join('')
  return ''
}

const walk = (node: any, cb: (n: any, parent: any, index: number) => void) => {
  if (!Array.isArray(node.children)) return
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    cb(child, node, i)
    // 子节点可能被替换为 raw 节点，raw 节点没有 children，天然终止递归
    walk(child, cb)
  }
}

/** 提取代码块语言（className 形如 language-ts） */
const langOfCode = (codeNode: any): string => {
  const cls: string[] = codeNode?.properties?.className || []
  const langCls = cls.find((c) => typeof c === 'string' && c.startsWith('language-'))
  return langCls ? langCls.slice('language-'.length) : ''
}

const highlightCode = (code: string, lang: string): string => {
  try {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return escapeHtml(code)
  } catch {
    return escapeHtml(code)
  }
}

/** 把 pre>code 转换为 Mac 风格代码块（行号 + 复制 + 长代码折叠），输出 raw HTML 节点 */
const rehypeMacCodeBlocks = () => (tree: any) => {
  walk(tree, (node, parent, index) => {
    if (node.type !== 'element' || node.tagName !== 'pre') return
    const codeNode = node.children?.find((c: any) => c.type === 'element' && c.tagName === 'code')
    if (!codeNode) return

    const lang = langOfCode(codeNode)
    const rawCode = textOf(codeNode).replace(/\n$/, '')
    const lines = rawCode.split('\n')
    const collapsible = lines.length > COLLAPSE_LINE_THRESHOLD
    const langLabel = escapeHtml(lang || 'text')

    const gutter = lines.map((_, i) => `<span class="code-ln">${i + 1}</span>`).join('')
    const highlighted = highlightCode(rawCode, lang)

    const figureHtml =
      `<figure class="code-block${
        collapsible ? ' is-collapsible is-collapsed' : ''
      }" data-lang="${langLabel}">` +
      `<figcaption class="code-header">` +
      `<span class="code-dots"><i></i><i></i><i></i></span>` +
      `<span class="code-lang">${langLabel}</span>` +
      `<button type="button" class="code-copy">复制</button>` +
      `</figcaption>` +
      `<div class="code-body"><div class="code-gutter" aria-hidden="true">${gutter}</div>` +
      `<pre><code class="hljs language-${langLabel}">${highlighted}</code></pre></div>` +
      (collapsible
        ? `<button type="button" class="code-expand">展开代码（共 ${lines.length} 行）</button>`
        : '') +
      `</figure>`

    parent.children[index] = { type: 'raw', value: figureHtml }
  })
}

/** 给 h1-h4 注入稳定 id 并收集目录 */
const rehypeHeadingIds = (headings: MarkdownHeading[]) => () => (tree: any) => {
  let counter = 0
  walk(tree, (node) => {
    if (node.type !== 'element') return
    const match = /^h([1-4])$/.exec(node.tagName || '')
    if (!match) return
    counter++
    const id = `heading-${counter}`
    node.properties = { ...(node.properties || {}), id }
    headings.push({ id, text: textOf(node).trim(), level: parseInt(match[1]) })
  })
}

/**
 * 渲染 Markdown 为 HTML（unified 管道：GFM + 数学公式 + callout + 代码高亮）。
 * 同步执行，SSR 与客户端均可用；失败时回退到 marked 基础渲染。
 */
export const renderMarkdown = (markdown: string): RenderedMarkdown => {
  if (!markdown) return { html: '', headings: [] }

  const headings: MarkdownHeading[] = []
  try {
    const file = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex)
      .use(rehypeCallouts)
      .use(rehypeHeadingIds(headings))
      .use(rehypeMacCodeBlocks)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(markdown)
    return { html: String(file), headings }
  } catch (err) {
    console.error('[useMarkdown] unified 渲染失败，回退 marked:', err)
    return { html: marked.parse(markdown, { async: false }) as string, headings: [] }
  }
}

/**
 * 给渲染容器绑定代码块交互（复制 / 展开折叠），事件委托，返回解绑函数。
 * 仅客户端调用（onMounted）。
 */
export const bindMarkdownInteractions = (
  container: HTMLElement,
  options?: { onImageClick?: (url: string, alt: string) => void }
): (() => void) => {
  const onClick = async (e: Event) => {
    const target = e.target as HTMLElement

    const copyBtn = target.closest('.code-copy')
    if (copyBtn) {
      const figure = copyBtn.closest('.code-block')
      const code = figure?.querySelector('pre code')?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        copyBtn.textContent = '已复制!'
      } catch {
        copyBtn.textContent = '复制失败'
      }
      setTimeout(() => (copyBtn.textContent = '复制'), 1500)
      return
    }

    // 正文图片点击放大（代码块内的图片不参与）
    if (options?.onImageClick && target.tagName === 'IMG' && !target.closest('.code-block')) {
      const img = target as HTMLImageElement
      options.onImageClick(img.currentSrc || img.src, img.alt || '')
      return
    }

    const expandBtn = target.closest('.code-expand')
    if (expandBtn) {
      const figure = expandBtn.closest('.code-block')
      if (!figure) return
      const collapsed = figure.classList.toggle('is-collapsed')
      const total = figure.querySelectorAll('.code-ln').length
      expandBtn.textContent = collapsed ? `展开代码（共 ${total} 行）` : '收起代码'
    }
  }

  container.addEventListener('click', onClick)
  return () => container.removeEventListener('click', onClick)
}
