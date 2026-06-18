Add-Type -AssemblyName System.Drawing

function New-AppIcon {
    param([int]$size, [string]$outPath)

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Background: rounded square, blue gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 37, 99, 235),
        [System.Drawing.Color]::FromArgb(255, 29, 78, 216),
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
    )
    $radius = [int]($size * 0.18)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $size - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($brush, $path)

    # Face circle (white), centered, slightly upper area for maskable safe zone
    $cx = $size * 0.5
    $cy = $size * 0.52
    $faceR = $size * 0.30
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($whiteBrush, $cx - $faceR, $cy - $faceR, $faceR * 2, $faceR * 2)

    # Eyes
    $eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 29, 78, 216))
    $eyeR = $size * 0.022
    $eyeOffsetX = $faceR * 0.42
    $eyeOffsetY = $faceR * 0.05
    $g.FillEllipse($eyeBrush, $cx - $eyeOffsetX - $eyeR, $cy - $eyeOffsetY - $eyeR, $eyeR * 2, $eyeR * 2)
    $g.FillEllipse($eyeBrush, $cx + $eyeOffsetX - $eyeR, $cy - $eyeOffsetY - $eyeR, $eyeR * 2, $eyeR * 2)

    # Smile (arc)
    $pen = New-Object System.Drawing.Pen($eyeBrush.Color, [Math]::Max(2, $size * 0.018))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $smileW = $faceR * 0.9
    $smileH = $faceR * 0.7
    $g.DrawArc($pen, $cx - $smileW/2, $cy - $smileH*0.15, $smileW, $smileH, 20, 140)

    # Hair curl on top
    $curlPen = New-Object System.Drawing.Pen($eyeBrush.Color, [Math]::Max(2, $size * 0.022))
    $curlPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $curlPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $curlSize = $faceR * 0.45
    $g.DrawArc($curlPen, $cx - $curlSize/2, $cy - $faceR - $curlSize*0.55, $curlSize, $curlSize, 160, 220)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

$publicDir = Join-Path $PSScriptRoot "..\public"
New-AppIcon -size 512 -outPath (Join-Path $publicDir "icon-512.png")
New-AppIcon -size 192 -outPath (Join-Path $publicDir "icon-192.png")
New-AppIcon -size 180 -outPath (Join-Path $publicDir "apple-touch-icon.png")
New-AppIcon -size 32 -outPath (Join-Path $publicDir "favicon-32.png")
New-AppIcon -size 512 -outPath (Join-Path $publicDir "maskable-icon-512.png")

Write-Output "Icons generated."
