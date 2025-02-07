param(
    [Parameter(Mandatory = $true)]
    [string]$FeatureName
)

# Base directory per la feature
$BaseDir = Join-Path -Path (Get-Location) -ChildPath "src/features/$FeatureName"

# Struttura delle cartelle basata su DDD + Clean Architecture
$Folders = @(
    "domain/entities",
    "domain/value-objects",
    "domain/repositories",
    "domain/services",
    "application/dtos",
    "application/use-cases",
    "infrastructure/entities",
    "infrastructure/repositories",
    "infrastructure/mappers",
    "interfaces/controllers"
)

# Crea la struttura delle cartelle
foreach ($Folder in $Folders) {
    $FolderPath = Join-Path -Path $BaseDir -ChildPath $Folder

    if (-Not (Test-Path -Path $FolderPath)) {
        New-Item -ItemType Directory -Path $FolderPath -Force | Out-Null
        Write-Host "Created folder: $FolderPath"
    }
}

# Crea il file del modulo della feature
$ModuleFile = Join-Path -Path $BaseDir -ChildPath "$FeatureName.module.ts"
if (-Not (Test-Path -Path $ModuleFile)) {
    New-Item -ItemType File -Path $ModuleFile -Force -Value "// $FeatureName Module" | Out-Null
    Write-Host "Created module file: $ModuleFile"
}

Write-Host "✅ Feature '$FeatureName' structure generated successfully!"
