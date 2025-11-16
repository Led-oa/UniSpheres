# Script d'arrêt UniSpheres
Write-Host "`n=== Arrêt de UniSpheres ===" -ForegroundColor Cyan

# Arrêter Nginx
Write-Host "[1/2] Arrêt de Nginx..." -ForegroundColor Yellow
Set-Location C:\nginx\server
.\nginx.exe -s quit
Start-Sleep -Seconds 1

# Arrêter le backend
Write-Host "[2/2] Arrêt du backend..." -ForegroundColor Yellow
pm2 stop unispheres-backend

Write-Host "`n=== Services arrêtés ===" -ForegroundColor Green