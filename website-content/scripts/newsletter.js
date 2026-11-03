document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#newsletterForm");
    if (!form) {
        return;
    }

    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        status.textContent = "Sending your signup request…";
        status.dataset.state = "pending";

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "We could not submit your signup.");
            }

            form.reset();
            status.textContent = result.message;
            status.dataset.state = "success";
        } catch (error) {
            status.textContent = error instanceof Error
                ? error.message
                : "We could not submit your signup. Please try again.";
            status.dataset.state = "error";
        } finally {
            submitButton.disabled = false;
        }
    });
});
