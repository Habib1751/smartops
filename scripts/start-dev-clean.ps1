#!/usr/bin/env pwsh
# Script to clean up locks and start dev server on port 3000

Write-Host "🧹 Cleaning up processes and lock files..." -ForegroundColor Cyan

# Stop all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✓ Stopped all Node processes" -ForegroundColor Green

# Kill process on port 3000 if exists
$port3000Process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
                   Select-Object -ExpandProperty OwningProcess -Unique

if ($port3000Process) {
    Stop-Process -Id $port3000Process -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Killed process on port 3000 (PID: $port3000Process)" -ForegroundColor Green
} else {
    Write-Host "✓ Port 3000 is free" -ForegroundColor Green
}

# Remove lock files
Remove-Item -Path ".next\dev\lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next\dev" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Removed lock files" -ForegroundColor Green

# Wait a moment
Start-Sleep -Seconds 2

Write-Host "`n🚀 Starting dev server on port 3000..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start dev server
npm run dev
