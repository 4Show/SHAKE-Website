// Calls the same-origin PHP proxy so browser code never reads backend endpoint URLs.
window.shakeSquareApi = window.shakeSquareApi || {
    // Requests Square to create a Payment Link for the selected cart items.
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

    // Requests catalog items directly from Square through the server-side PHP proxy.
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

        return {
            items,
            images: data.images || {},
            itemOptions: data.item_options || {}
        };
    }
};
