# Simple PowerShell HTTP Server
$port = 8000
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server started at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop."

# Open browser automatically
Start-Process "http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $path = $request.Url.LocalPath
            if ($path -eq "/") { $path = "/index.html" }
            
            $filePath = Join-Path $root $path.TrimStart('/')
            
            if (Test-Path $filePath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    Default { $response.ContentType = "application/octet-stream" }
                }
                
                # Careful: $response.ContentLength64 is a 64-bit int
                # But sometimes it's problematic if not done exactly right.
                # However, this pattern usually works.
                # Adding error handling just in case.
                
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
                $response.StatusCode = 200
            } else {
                $response.StatusCode = 404
            }
        } catch {
            Write-Host "Error processing request for $path : $_" -ForegroundColor Red
            $response.StatusCode = 500
        }
        
        try {
            # Close might throw if already closed or disposed
            $response.OutputStream.Close()
        } catch {}
        
        Write-Host "$($request.HttpMethod) $path - $($response.StatusCode)"
    }
} finally {
    $listener.Stop()
}
