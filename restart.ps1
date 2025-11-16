# Script de redémarrage UniSpheres
Write-Host "`n=== Redémarrage de UniSpheres ===" -ForegroundColor Cyan

# Redémarrer le backend
Write-Host "[1/2] Redémarrage du backend..." -ForegroundColor Yellow
pm2 restart unispheres-backend

# Recharger Nginx
Write-Host "[2/2] Rechargement de Nginx..." -ForegroundColor Yellow
Set-Location C:\nginx\server
.\nginx.exe -s reload

Write-Host "`n=== Redémarrage terminé ===" -ForegroundColor Green