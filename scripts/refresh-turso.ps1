# Remove old ones first to be clean
vercel env rm TURSO_AUTH_TOKEN production -y
vercel env rm TURSO_DATABASE_URL production -y

# Add new ones
Write-Host "Adding fresh TURSO_AUTH_TOKEN..."
$token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg1OTMxNjAsImlkIjoiY2U0NTQ3NDktNWFhOC00OTE3LThmMzktYjM2NzIxNDgwNGUzIiwicmlkIjoiYjE5ZjQ3ZTMtYzgyMC00MTZhLTg1NTQtN2JlYzAwNDAxNTk0In0.vUOzkRjWEt1ilSxFzu1cILsXRIMlhW4mlCpvFNsnWKSGY8udz2Itld-zEOXOSodshZIJ3GWUV9RdtoW_RkV9DQ"
$token | vercel env add TURSO_AUTH_TOKEN production

Write-Host "Adding TURSO_DATABASE_URL (converted to https)..."
# Conversion to https is often required for Vercel/HTTP-based clients
$url = "https://fpsos-aiiger.aws-ap-south-1.turso.io"
$url | vercel env add TURSO_DATABASE_URL production
