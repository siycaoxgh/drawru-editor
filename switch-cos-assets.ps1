param(
    [ValidateSet('enable', 'restore')]
    [string]$Mode,
    [string]$CosBaseUrl
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = Join-Path $root '.drawru-cos-backup'
$targets = @(
    'assets/article/header-images.js',
    'assets/article/recommend.js',
    'assets/article/footer/recommend.js',
    'assets/footer/socials.js',
    'assets/images/registry.json',
    'js/template-browser.js'
)

if (-not $Mode) {
    Write-Host 'DrawRu sample image URL switch'
    Write-Host '1. Use COS URLs'
    Write-Host '2. Restore safe placeholder URLs'
    $choice = Read-Host 'Choose 1 or 2'
    $Mode = if ($choice -eq '1') { 'enable' } elseif ($choice -eq '2') { 'restore' } else { throw 'Invalid choice' }
}

if ($Mode -eq 'enable') {
    if (-not $CosBaseUrl) {
        $CosBaseUrl = Read-Host 'Enter COS base URL, for example https://your-bucket.cos.ap-shanghai.myqcloud.com'
    }
    $CosBaseUrl = $CosBaseUrl.TrimEnd('/')
    if ($CosBaseUrl -notmatch '^https?://[^\s/]+(?:/[^\s]*)?$') { throw 'Invalid COS base URL' }
    New-Item -ItemType Directory -Force -Path $backup | Out-Null
    foreach ($relative in $targets) {
        $source = Join-Path $root $relative
        if (-not (Test-Path -LiteralPath $source)) { continue }
        $saved = Join-Path $backup $relative
        if (-not (Test-Path -LiteralPath $saved)) {
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $saved) | Out-Null
            Copy-Item -LiteralPath $source -Destination $saved
        }
        $content = [IO.File]::ReadAllText($source)
        $content = $content.Replace('https://example.com', $CosBaseUrl)
        [IO.File]::WriteAllText($source, $content, [Text.UTF8Encoding]::new($false))
    }
    Write-Host 'COS URLs enabled. Do not commit these local changes to the public repository.'
} else {
    if (-not (Test-Path -LiteralPath $backup)) { throw 'Backup not found. Run enable once before restore.' }
    foreach ($relative in $targets) {
        $saved = Join-Path $backup $relative
        $source = Join-Path $root $relative
        if (Test-Path -LiteralPath $saved) { Copy-Item -LiteralPath $saved -Destination $source -Force }
    }
    Write-Host 'Restored safe placeholder URLs.'
}
