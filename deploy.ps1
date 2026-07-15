param(
    [switch]$restart
)

$root = Split-Path -Parent $PSCommandPath
$ip   = "8.148.21.137"
$user = "root"
$pass = "A413996731888a"
$dest = "/var/www/book-realm"

$pw = $pass | ConvertTo-SecureString -AsPlainText -Force
$cred = New-Object PSCredential($user, $pw)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Book Realm Deploy" -ForegroundColor Cyan
Write-Host "  Server: ${ip}" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($restart) {
    $s = New-SSHSession -ComputerName $ip -Credential $cred -AcceptKey -Force
    Invoke-SSHCommand -SessionId $s.SessionId -Command "systemctl restart book-realm" | Out-Null
    $r = Invoke-SSHCommand -SessionId $s.SessionId -Command "systemctl status book-realm --no-pager | Select-String Active"
    Write-Host $r.Output
    Remove-SSHSession -SessionId $s.SessionId
    Write-Host "Done!" -ForegroundColor Green
    exit 0
}

Write-Host "[1/3] Connecting..." -ForegroundColor Yellow
$sftp = New-SFTPSession -ComputerName $ip -Credential $cred -AcceptKey -Force
$ssh  = New-SSHSession -ComputerName $ip -Credential $cred -AcceptKey -Force
Invoke-SSHCommand -SessionId $ssh.SessionId -Command "mkdir -p $dest/css $dest/js $dest/server/routes $dest/server/data $dest/assets/covers" | Out-Null

Write-Host "[2/3] Uploading..." -ForegroundColor Yellow

Write-Host "  frontend..."
Set-SFTPItem -SessionId $sftp.SessionId -Path "$root\index.html" -Destination "$dest/" -Force
foreach ($f in Get-ChildItem "$root\css\*") {
    Set-SFTPItem -SessionId $sftp.SessionId -Path $f.FullName -Destination "$dest/css/" -Force
}
foreach ($f in Get-ChildItem "$root\js\*") {
    Set-SFTPItem -SessionId $sftp.SessionId -Path $f.FullName -Destination "$dest/js/" -Force
}

Write-Host "  assets..."
foreach ($f in Get-ChildItem "$root\assets\*" -Recurse -File) {
    $relative = $f.FullName.Replace("$root\", "").Replace("\", "/")
    $targetDir = Split-Path "$dest/$relative" -Parent
    Invoke-SSHCommand -SessionId $ssh.SessionId -Command "mkdir -p ""$targetDir""" | Out-Null
    Set-SFTPItem -SessionId $sftp.SessionId -Path $f.FullName -Destination "$dest/$relative" -Force
}

Write-Host "  backend..."
Set-SFTPItem -SessionId $sftp.SessionId -Path "$root\server\package.json" -Destination "$dest/server/" -Force
Set-SFTPItem -SessionId $sftp.SessionId -Path "$root\server\server.js" -Destination "$dest/server/" -Force
foreach ($f in Get-ChildItem "$root\server\routes\*") {
    Set-SFTPItem -SessionId $sftp.SessionId -Path $f.FullName -Destination "$dest/server/routes/" -Force
}
foreach ($f in Get-ChildItem "$root\server\data\*") {
    Set-SFTPItem -SessionId $sftp.SessionId -Path $f.FullName -Destination "$dest/server/data/" -Force
}
if (Test-Path "$root\server\.env") {
    Set-SFTPItem -SessionId $sftp.SessionId -Path "$root\server\.env" -Destination "$dest/server/" -Force
}

Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null

Write-Host "[3/3] Restarting service..." -ForegroundColor Yellow
$r = Invoke-SSHCommand -SessionId $ssh.SessionId -Command "cd $dest/server && npm install --production 2>&1 | grep -E 'added|audited' || true; systemctl restart book-realm; sleep 1; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/book-realm/; echo ''"
Write-Host $r.Output

Remove-SSHSession -SessionId $ssh.SessionId | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deploy OK!" -ForegroundColor Green
Write-Host "  http://${ip}/book-realm" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
