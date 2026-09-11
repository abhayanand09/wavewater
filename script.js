function openOrderForm(productName) {
    const modal = document.getElementById("orderModal");

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    if (productName) {
        document.getElementById("product").value = productName;
    }
}

function closeOrderForm() {
    const modal = document.getElementById("orderModal");

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

function openBulkQuoteForm() {
    const modal = document.getElementById("bulkQuoteModal");

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}

function closeBulkQuoteForm() {
    const modal = document.getElementById("bulkQuoteModal");

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzwRzCRZ1ZB41NAxvNIjKnttudX2tjfXyqXdv81WpmKYw674ZNRVdhSuo7OuE-IGakHyg/exec";

function saveToGoogleSheet(data) {
    if (!GOOGLE_SHEETS_ENDPOINT) {
        return Promise.resolve();
    }

    return fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(data)
    });
}

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
});

document.querySelectorAll(".small-order").forEach(function (button) {
    button.addEventListener("click", function () {
        const productName = button
            .closest(".product-card")
            .querySelector("h3")
            .textContent
            .trim();

        openOrderForm(productName);
    });
});

document.getElementById("orderForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const submitButton = this.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        await saveToGoogleSheet({
            type: "Order",
            name: name,
            phone: phone,
            product: document.getElementById("product").value,
            quantity: document.getElementById("quantity").value,
            address: document.getElementById("address").value.trim()
        });

        alert("Thank you, " + name + "! Your order request has been received.");
        this.reset();
        closeOrderForm();
    } catch (error) {
        alert("We could not send your order. Please try again.");
    } finally {
        submitButton.disabled = false;
    }
});

document.getElementById("bulkQuoteForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("bulkName").value.trim();
    const phone = document.getElementById("bulkPhone").value.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const submitButton = this.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        await saveToGoogleSheet({
            type: "Bulk quote",
            name: name,
            phone: phone,
            businessType: document.getElementById("businessType").value.trim(),
            requirement: document.getElementById("bulkRequirement").value.trim()
        });

        alert("Thank you, " + name + "! Your bulk quote request has been received.");
        this.reset();
        closeBulkQuoteForm();
    } catch (error) {
        alert("We could not send your quote request. Please try again.");
    } finally {
        submitButton.disabled = false;
    }
});

document.getElementById("orderModal").addEventListener("click", function (event) {
    if (event.target === this) {
        closeOrderForm();
    }
});

document.getElementById("bulkQuoteModal").addEventListener("click", function (event) {
    if (event.target === this) {
        closeBulkQuoteForm();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeOrderForm();
        closeBulkQuoteForm();
    }
});
