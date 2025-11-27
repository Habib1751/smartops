<#
  Clean dev lock helper for Windows PowerShell
  Usage:
    Open PowerShell (recommended: Run as Administrator)
    ./scripts/clean-dev-lock.ps1 [--restart]

  This script will:
  - Stop any running `node` processes (if present)
  - Remove the Next.js dev lock file at `.next/dev/lock`
  - Optionally remove the entire `.next` folder (if passed --clean)
  - Optionally restart the dev server if `--restart` is passed
#>

param(
  [switch]$Restart,
  [switch]$Clean
)

Write-Host "Stopping any running node processes..."
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
  try {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Stopped node process Id=$($_.Id)"
  } catch {
    Write-Host "Could not stop node process Id=$($_.Id): $_"
  }
}

Start-Sleep -Seconds 1

$lockPath = Join-Path -Path (Get-Location) -ChildPath ".next\dev\lock"
if (Test-Path $lockPath) {
  try {
    Remove-Item -Path $lockPath -Force -ErrorAction Stop
    Write-Host "Removed lock file: $lockPath"
  } catch {
    Write-Host "Failed to remove lock file (permission?): $lockPath - $_"
  }
} else {
  Write-Host ".next\dev\lock not present"
}

if ($Clean) {
  $nextPath = Join-Path -Path (Get-Location) -ChildPath ".next"
  if (Test-Path $nextPath) {
    try {
      Write-Host "Removing .next folder (this may take a few seconds)..."
      Remove-Item -Path $nextPath -Recurse -Force -ErrorAction Stop
      Write-Host ".next folder removed"
    } catch {
      Write-Host "Failed to remove .next folder: $_"
    }
  }
}

if ($Restart) {
  Write-Host "Starting dev server: npm run dev"
  # Start the dev server in a new PowerShell window to keep this script returning
  $ps = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile -NoExit -Command cd `"$(Get-Location)`"; npm run dev" -PassThru
  Write-Host "Started dev server (PID: $($ps.Id))"
}

Write-Host "Done. If the problem persists, please run Resource Monitor (resmon) and search for 'lock' handles, or reboot to clear OS file handles."
