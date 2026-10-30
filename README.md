# SHAKE-Website

This repository will manage the versions of the SHAKE website for easy deployment.

## Local Square API configuration

The PHP API proxy calls Square directly; it does not require Lambda. Copy the variable
names from `.env_template` into the repository-root `.env` file, then set the sandbox
access token and location ID:

```env
square_environment=sandbox
square_access_token-sandbox=YOUR_SANDBOX_ACCESS_TOKEN
square_location_id-sandbox=YOUR_SANDBOX_LOCATION_ID
```

The production token and location variables are also available, but leave
`square_environment=sandbox` while testing. Change it to `prod` only when you
intend to use live Square data and create real checkout links. The token must have
permission to read the catalog and create payment links. Never put access tokens in
browser JavaScript or commit `.env`.

The Square location ID is available in the Square Dashboard under **Account & Settings
> Business information > Locations**. The PHP proxy uses the location matching the
selected environment.

Run the site through PHP, using `website-content` as the document root so the
repository-root `.env` remains outside the public web directory. From the repository
root, run:

```powershell
php -S localhost:8000 -t website-content
```

If PHP is not on `PATH` and you installed the downloaded copy in your Downloads folder,
run:

```powershell
& "$HOME\Downloads\php-8.5\php.exe" -S localhost:8000 -t website-content
```

Open `http://localhost:8000/HTML/Home-SHAKE.html`. Live Server alone cannot execute
the PHP proxy or read `.env`.