# Train, test, and start SUPCHAIN (backend + frontend)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "=== 1/4 Training model ===" -ForegroundColor Cyan
Set-Location "$Root\backend"
if (-not (Test-Path .venv)) { python -m venv .venv }
.\.venv\Scripts\pip install -r requirements.txt -q
$env:PYTHONPATH = "."
.\.venv\Scripts\python -m app.ml.train

Write-Host "`n=== 2/4 Running tests ===" -ForegroundColor Cyan
.\.venv\Scripts\python -m pytest tests/ -q
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n=== 3/4 Starting backend (port 8000) ===" -ForegroundColor Cyan
$conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}
Start-Process -FilePath "$Root\backend\.venv\Scripts\uvicorn.exe" `
    -ArgumentList "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000" `
    -WorkingDirectory "$Root\backend" `
    -WindowStyle Normal

Write-Host "`n=== 4/4 Starting frontend (port 5173) ===" -ForegroundColor Cyan
Set-Location "$Root\frontend"
if (-not (Test-Path node_modules)) { npm install }
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm run dev"

Write-Host "`nReady: open http://localhost:5173" -ForegroundColor Green
