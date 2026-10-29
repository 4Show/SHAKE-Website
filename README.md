# SHAKE-Website

This repository will manage the versions of the SHAKE website for easy deployment.

## Local API configuration

The repository-root `.env_template` lists the variable names expected by the PHP proxy.
Add these URL variables to the existing repository-root `.env` file and fill in your
backend HTTPS URLs:

```env
SQUARE_CATALOG_FUNCTION_URL=
SQUARE_PAYMENT_LINK_FUNCTION_URL=
```

Keep actual endpoint values and credentials in `.env`; do not put them in browser
JavaScript or commit `.env`.

The website's PHP API proxy reads these values server-side. Run the site with PHP
enabled and use `website-content` as the document root so the repository-root `.env`
file is outside the public web directory. For local development, run this command from
the repository root:

```powershell
php -S localhost:8000 -t website-content
```

Open the site through `http://localhost:8000/HTML/Home-SHAKE.html`. Live Server alone
cannot execute the PHP proxy or read `.env`.

### Square catalog Lambda

`SQUARE_CATALOG_FUNCTION_URL` must be the HTTPS Function URL for a server-side Lambda
that calls Square and returns the catalog JSON. Configure the Square access token as a
Lambda environment variable named `SQUARE_ACCESS_TOKEN`; never embed it in source code
or browser JavaScript. For example:

```js
import { SquareClient } from "square";

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN
});

export async function handler() {
  try {
    const catalog = await squareClient.catalog.list({});
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(catalog)
    };
  } catch (error) {
    console.error("Square catalog request failed", error);
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Square catalog request failed" })
    };
  }
}
```

Deploy this function with the `square` package and its Lambda Function URL, then set
that URL as `SQUARE_CATALOG_FUNCTION_URL` in the local `.env`. The payment-link URL
should point to a separate backend function that accepts the proxy's `line_items`
JSON body and responds with the checkout URL as plain text. The browser calls the local
PHP proxy; it does not call either Lambda URL directly.