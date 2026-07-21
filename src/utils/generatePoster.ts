import QRCode from 'qrcode'

export interface PosterOptions {
  title: string
  summary?: string
  author?: string
  date?: string
  url: string
  cover?: string
  siteName?: string
}

const POSTER_WIDTH = 750
const POSTER_HEIGHT = 1100
const PADDING = 48

/** 按最大宽度折行，返回各行文本（最多 maxLines 行，超出加省略号） */
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] => {
  const lines: string[] = []
  let line = ''
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth) {
      lines.push(line)
      line = ch
      if (lines.length >= maxLines) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…'
        return lines
      }
    } else {
      line += ch
    }
  }
  if (line) lines.push(line)
  return lines
}

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })

/**
 * 生成文章分享海报（封面 + 标题摘要 + 二维码）并触发下载。
 * 移植自 ThriveX 的 generateArticlePoster，仅客户端可用。
 */
export const generateArticlePoster = async (opts: PosterOptions): Promise<void> => {
  const canvas = document.createElement('canvas')
  canvas.width = POSTER_WIDTH
  canvas.height = POSTER_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建 canvas 上下文')

  // 背景
  const bg = ctx.createLinearGradient(0, 0, 0, POSTER_HEIGHT)
  bg.addColorStop(0, '#faf9f7')
  bg.addColorStop(1, '#f0e9e2')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  // 封面（跨域失败时跳过，避免污染画布）
  let contentTop = PADDING
  if (opts.cover) {
    const img = await loadImage(opts.cover)
    if (img) {
      const coverH = 420
      const ratio = Math.max(POSTER_WIDTH / img.width, coverH / img.height)
      const dw = img.width * ratio
      const dh = img.height * ratio
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(0, 0, POSTER_WIDTH, coverH, [0, 0, 24, 24])
      ctx.clip()
      ctx.drawImage(img, (POSTER_WIDTH - dw) / 2, (coverH - dh) / 2, dw, dh)
      ctx.restore()
      contentTop = coverH + PADDING
    }
  }

  const textWidth = POSTER_WIDTH - PADDING * 2

  // 标题
  ctx.fillStyle = '#2c2c2c'
  ctx.font = 'bold 40px "PingFang SC", "Microsoft YaHei", sans-serif'
  const titleLines = wrapText(ctx, opts.title, textWidth, 3)
  let y = contentTop + 40
  for (const line of titleLines) {
    ctx.fillText(line, PADDING, y)
    y += 56
  }

  // 摘要
  if (opts.summary) {
    ctx.fillStyle = '#8a8378'
    ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif'
    y += 8
    for (const line of wrapText(ctx, opts.summary, textWidth, 4)) {
      ctx.fillText(line, PADDING, y)
      y += 40
    }
  }

  // 分隔线
  const footerTop = POSTER_HEIGHT - 220
  ctx.strokeStyle = '#e3dcd2'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PADDING, footerTop)
  ctx.lineTo(POSTER_WIDTH - PADDING, footerTop)
  ctx.stroke()

  // 作者与日期
  ctx.fillStyle = '#5c5c5c'
  ctx.font = '28px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(opts.author || '', PADDING, footerTop + 64)
  ctx.fillStyle = '#a89f92'
  ctx.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(opts.date || '', PADDING, footerTop + 108)
  ctx.fillText(opts.siteName || '', PADDING, footerTop + 152)

  // 二维码
  const qrSize = 150
  const qrDataUrl = await QRCode.toDataURL(opts.url, { width: qrSize, margin: 1 })
  const qrImg = await loadImage(qrDataUrl)
  if (qrImg) {
    ctx.drawImage(qrImg, POSTER_WIDTH - PADDING - qrSize, footerTop + 32, qrSize, qrSize)
  }

  // 下载
  const link = document.createElement('a')
  link.download = `${opts.title.slice(0, 30)}-海报.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
