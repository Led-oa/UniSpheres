# Script de démarrage UniSpheres
Write-Host "`n=== Démarrage de UniSpheres ===" -ForegroundColor Cyan

# Démarrer le backend
Write-Host "`n[1/2] Démarrage du backend..." -ForegroundColor Yellow
Set-Location D:\WORK\UniSpheres\backend
pm2 start ecosystem.config.js
Start-Sleep -Seconds 2

# Démarrer Nginx
Write-Host "[2/2] Démarrage de Nginx..." -ForegroundColor Yellow
Set-Location C:\nginx\server
start nginx
Start-Sleep -Seconds 1

# Vérifier les statuts
Write-Host "`n=== Statut des services ===" -ForegroundColor Cyan
pm2 status
Get-Process nginx -ErrorAction SilentlyContinue | Format-Table -AutoSize

Write-Host "`n=== Application démarrée ! ===" -ForegroundColor Green
Write-Host "Frontend  : http://localhost" -ForegroundColor White
Write-Host "Backend   : http://localhost/api" -ForegroundColor White
Write-Host "Logs PM2  : pm2 logs" -ForegroundColor Gray

Write-Host "`nAppuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")