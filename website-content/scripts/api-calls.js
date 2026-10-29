// Calls the same-origin PHP proxy so browser code never reads backend endpoint URLs.
window.shakeSquareApi = window.shakeSquareApi || {
    // Requests a Square Payment Link from the configured payment-link Lambda function.
    async requestSquarePaymentLink(lineItems) {
        const response = await fetch("../scripts/api-calls.php?action=payment-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ line_items: lineItems })
        });

        if (!response.ok) {
            throw new Error(`Square Payment Link request failed: ${response.status} ${response.statusText}`);
        }

        return response.text();
    },

    // Requests the Square catalog from the configured catalog Lambda function.
    async requestSquareCatalogItems() {
        const response = await fetch("../scripts/api-calls.php?action=catalog");

        if (!response.ok) {
            throw new Error(`Square Catalog request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const items = typeof data.items === "string" ? JSON.parse(data.items) : data.items;
        if (!Array.isArray(items)) {
            throw new Error("Square Catalog response does not contain an items array.");
        }

        return items;
    }
};
