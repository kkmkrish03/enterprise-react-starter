$libraries = @(
    "libs/platform/core",
    "libs/platform/ui",
    "libs/features/auth",
    "libs/features/dashboard",
    "libs/features/tenant-management",
    "libs/features/users",
    "libs/features/settings"
)

foreach ($lib in $libraries) {
    Write-Host "Generating $lib"
    npx nx g @nx/react:lib $lib --unitTestRunner=vitest --bundler=vite --style=css --interactive=false
}
