# 图片迁移脚本 - 将 assets 中的图片复制到 public 目录
# 用于预加载优化

Write-Host "开始迁移图片到 public 目录..." -ForegroundColor Green

# 复制 about 图片
Write-Host "`n复制 about 图片..." -ForegroundColor Cyan
Copy-Item -Path "src\assets\img\about\*" -Destination "src\public\images\about\" -Force
Write-Host "✓ about 图片已复制" -ForegroundColor Green

# 复制 banner 图片
Write-Host "`n复制 banner 图片..." -ForegroundColor Cyan
Copy-Item -Path "src\assets\img\banner\*" -Destination "src\public\images\banner\" -Force
Write-Host "✓ banner 图片已复制" -ForegroundColor Green

Write-Host "`n迁移完成！" -ForegroundColor Green
Write-Host "新路径：" -ForegroundColor Yellow
Write-Host "  - src/public/images/about/" -ForegroundColor White
Write-Host "  - src/public/images/banner/" -ForegroundColor White
Write-Host "`n访问路径：" -ForegroundColor Yellow
Write-Host "  - /images/about/1.jpg" -ForegroundColor White
Write-Host "  - /images/banner/1.jpg" -ForegroundColor White
Write-Host "`n请更新代码中的图片引用路径！" -ForegroundColor Red
