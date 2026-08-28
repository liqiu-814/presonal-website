$ErrorActionPreference = "Stop"
# 提示词略作变化，触发新的生成任务
$prompt = "simple cartoon lineart illustration of a young asian man, short black hair with straight bangs, gray zip-up hoodie, cheerful smile, waving hello with one raised hand, other hand in pocket, full body standing pose, bold clean black outlines, flat white fill, pure white background, coloring book doodle style, no shading, minimalist"
$enc = [System.Uri]::EscapeDataString($prompt)
$url = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=$enc&image_size=square_hd"
$placeholderSize = 176626
$placeholderHash = "19A0B822EDB11957055E4588C2159058"
$out = "Material\generated_avatar_raw.png"
for ($i = 1; $i -le 10; $i++) {
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 60
    $len = (Get-Item $out).Length
    $hash = (Get-FileHash $out -Algorithm MD5).Hash
    Write-Output "尝试 $i : $len bytes"
    if ($hash -ne $placeholderHash) { Write-Output "SUCCESS - 图片已生成"; break }
  } catch { Write-Output "尝试 $i 失败: $($_.Exception.Message)" }
  Start-Sleep -Seconds 20
}
