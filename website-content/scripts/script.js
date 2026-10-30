

//----------------------------------CART FUNCTIONALITY----------------------------------//

// Returns a safe image URL for use in img.src. Allows relative URLs and http/https.
function sanitizeImageUrl(url)
{
    if (typeof url !== "string") return "images/placeholder.png";
    const trimmed = url.trim();
    if (!trimmed) return "images/placeholder.png";

    try {
        const parsed = new URL(trimmed, window.location.origin);
        const protocol = parsed.protocol.toLowerCase();
        if (protocol === "http:" || protocol === "https:") {
            return parsed.href;
        }
    } catch (e) {
        // Keep fallback below for malformed values.
    }

    return "images/placeholder.png";
}

// Adds the selected size of a product to the session cart and updates its count.
function toggleCart(cartNode)
{
    const productContainer = cartNode.closest(".product-item");
    const colorSelect = productContainer?.querySelector(".color-select");
    if (colorSelect && !colorSelect.value) {
        alert("Please select a color before adding to cart.");
        colorSelect.focus();
        return;
    }

    const selectedButton = productContainer?.querySelector(
        '.button-label input[type="radio"]:checked'
    );

    if (!selectedButton || !selectedButton.parentElement.classList.contains("active")) {
        alert("Please select a size before adding to cart.");
        return;
    }

    const productDetails = productContainer.querySelector(".product-details");
    const cartId = selectedButton.value;
    const product = {
        name: productDetails.querySelector("h3").textContent,
        description: productDetails.querySelector(".description").textContent,
        price: productDetails.querySelector(".price").textContent,
        size: selectedButton.parentElement.innerText,
        color: colorSelect?.value || "",
        image: sanitizeImageUrl(productContainer.querySelector("img").getAttribute("src")),
        quantity: 1,
        cartId
    };

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartIDs = JSON.parse(sessionStorage.getItem("cartIDs")) || [];
    let cartCount = parseInt(sessionStorage.getItem("cartCount")) || 0;
    const existingProduct = cart.find(
        (item) => item.name === product.name
            && item.size === product.size
            && item.color === product.color
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    cartIDs.push(cartId);
    cartCount += 1;
    sessionStorage.setItem("cart", JSON.stringify(cart));
    sessionStorage.setItem("cartCount", cartCount);
    sessionStorage.setItem("cartIDs", JSON.stringify(cartIDs));
    updateCartCountDisplay();
}
// Opens the shopping-cart drawer.
function showCart()
{
     //transitions the cart open
     transWin = document.querySelector(".cartTab");
     transWin.style.right = "0%";
}
// Closes the shopping-cart drawer and refreshes the displayed cart count.
function closeCart()
{
    closeBtn = document.querySelector(".cartTab");
    closeBtn.style.right = "-400px";
    
    updateCartCountDisplay();
}
// Rebuilds the cart drawer from products saved in session storage.
function loadCart()
{

    //fixCart();
    // Get cart data from sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart'))||[];
    // window.alert(cart.length);


    // Display cart content
    const cartContent = document.querySelector('.cartContent');
    //removes all prexisting cart items from before and refreshes
    while(cartContent.firstChild)
    {
        cartContent.removeChild(cartContent.firstChild);
    }
    var subtotal = 0;


    for(i =0; i < cart.length  ; i++)
    {
        if (cart.length == 0)
        {
            const para = document.createElement("p");
            para.textContent = "Your cart is empty.";
           

            cartContent.appendChild(para);
        }
        else
        {
            //creates the item div that all the product info will be appended to
        
        
              

                //create div element
                let divContainer = document.createElement("div");
                divContainer.setAttribute("class","itemDiv");
                let displayInline = document.createElement("div");
                displayInline.setAttribute("class", "displayInline");
                displayInline.style.display="flex";
                

                //create the children of the div element

                //gets the image
                let img = document.createElement("img");
                img.setAttribute("src", sanitizeImageUrl(cart[i].image));
                img.style.maxHeight = "auto";
                img.style.maxWidth = "100%";
                divContainer.appendChild(img);


                //sets up the quanitty 
                let quantDiv = document.createElement("div");
                let indexVal = i +1
                quantDiv.setAttribute("class","quantity" + indexVal);
                quantDiv.style.display = "flex";
                quantDiv.style.alignItems = 'center';
                quantDiv.style.justifyContent = 'center';
                quantDiv.style.width = "50%";
                

                let minusBut = document.createElement("button");
                minusBut.setAttribute("class", "minus-btn");
                minusBut.addEventListener('click', function(){
                    decreaseQuantity(this);
                    
                });
                minusBut.innerText = "-";
                
                let quantityInput = document.createElement("input");
                quantityInput.setAttribute("type","text");
                quantityInput.setAttribute("class","quantity");
                quantityInput.setAttribute("value", cart[i].quantity);
                quantityInput.style.textAlign = "center";
                quantityInput.style.width = "40%";
                

                let plusBut = document.createElement("button");
                plusBut.setAttribute("class", "plus-btn");
                plusBut.innerText = "+";
                plusBut.addEventListener('click', function(){
                    increaseQuantity(this);
                });
            
            

                quantDiv.appendChild(minusBut);
                quantDiv.appendChild(quantityInput);
                quantDiv.appendChild(plusBut);
            
                //gets the subtotal
                var productPrice = parseFloat(cart[i].price.replace("$",''));
                let subtotalElement = document.querySelector(".subtotal").querySelector("h3");
                subtotal +=  quantityInput.getAttribute("value") * productPrice;
                subtotalElement.style.textAlign= "right";
                subtotalElement.innerHTML = "Subtotal: $" + subtotal.toFixed(2);
                
                
                descDiv = document.createElement("div");
                descDiv.setAttribute("class", "productDescription");
                descDiv.style.width="50%";
                descDiv.style.textAlign = "center";

                // gets the name           
                let par2 = document.createElement("p");
                par2.innerText = cart[i].name; 
                descDiv.appendChild(par2);
                
                // gets the size
                let parb = document.createElement("p");
                parb.innerText= "Size: " + cart[i].size; 
                descDiv.appendChild(parb);

                if (cart[i].color) {
                    const color = document.createElement("p");
                    color.innerText = "Color: " + cart[i].color;
                    descDiv.appendChild(color);
                }

                // gets the price
                let par = document.createElement("p");
                par.innerText= cart[i].price; 
                descDiv.appendChild(par);


                displayInline.appendChild(descDiv);
                displayInline.appendChild(quantDiv);
                divContainer.appendChild(displayInline);
                divContainer.style.padding = "20px";

                //append the information to the cartContainer
                cartContent.appendChild(divContainer);
                cartContent.style.overflowY = "auto";
                cartContent.style.padding = "0 -0px 0 0";
                cartContent.style.boxSizing = "content-box";     
                cartContent.style.width = "100%";
                cartContent.style.height = "100%";    
        }   
    }
   
}
// Recalculates the cart subtotal from the saved product quantities.
function updateSubtotal()
{
   
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    let subtotal = 0;
    for(i = 0; i < cart.length; i++)
    {
        var productPrice = parseFloat(cart[i].price.replace("$",''));
       
        let subtotalElement = document.querySelector(".subtotal").querySelector("h3");
        window.alert(productPrice);
        subtotal +=  quantityInput.getAttribute("value") * productPrice;
       
        subtotalElement.style.textAlign= "right";
        subtotalElement.innerHTML = "Subtotal: $" + subtotal.toFixed(2);

    }
    
        
}
// Increases one cart item's quantity and updates the stored count and subtotal.
function increaseQuantity(quantButton) {

    var quantDiv = quantButton.parentElement;
    var quantityInput = quantDiv.querySelector("input");
    var currentValue = parseInt(quantityInput.value);
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    const buttons = document.querySelectorAll(".plus-btn");
    
    //get the price element for the subtotal
    var priceIncrement = quantDiv.parentElement.querySelector(".productDescription").lastElementChild.innerText;
    var productPrice = parseFloat(priceIncrement.replace("$",''));
    
    //increment cart count in session storage variable
    let cartCount = parseInt(sessionStorage.getItem('cartCount'));
    cartCount +=1;
    sessionStorage.setItem("cartCount", cartCount);

    for(i=0;i<buttons.length; i++)
    {
        if(buttons[i] == quantButton)
        {
            itemInd = i;
            cart[i].quantity +=1;
            sessionStorage.setItem("cart", JSON.stringify(cart));
            break;
        }
    }

    quantityInput.value = currentValue + 1;
    
    

    let subtotalElement = document.querySelector(".subtotal").querySelector("h3");
    
    let currentSubtotal = subtotalElement.innerText.replace("Subtotal: $",'') 
    subtotal = parseFloat(currentSubtotal) + parseFloat(productPrice);
    subtotalElement.innerText =  "Subtotal: $" + subtotal.toFixed(2);

}
// Decreases a cart item's quantity, removing it when its quantity reaches zero.
function decreaseQuantity(quantButton) {
   
    var quantDiv = quantButton.parentElement;
    var quantityInput = quantDiv.querySelector("input");
    var currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue - 1;
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    let cartCount = JSON.parse(sessionStorage.getItem('cartCount'));
    const buttons = document.querySelectorAll(".minus-btn");


    //remove item from cart
    var itemInd =0;

    //delete cart item
    for(i=0;i<buttons.length; i++)
    {
        if(buttons[i] == quantButton)
        {
            itemInd = i;
            cart[itemInd].quantity -=1;
            sessionStorage.setItem("cart",JSON.stringify(cart));
            break;
        }
    }
    

    if(quantityInput.value < 1)
    {
        var itemDiv = quantDiv.parentElement.parentElement
    
        itemDiv.remove();
        cart.splice(itemInd, 1);
        sessionStorage.setItem("cart",JSON.stringify(cart));
    }


    //cartCount
    cartCount -=1;
    sessionStorage.setItem("cartCount", cartCount);

    //subtotal
    var priceIncrement = quantDiv.parentElement.querySelector(".productDescription").lastElementChild.innerText;
    var productPrice = parseFloat(priceIncrement.replace("$",''));
    let subtotalElement = document.querySelector(".subtotal").querySelector("h3");
    let currentSubtotal = subtotalElement.innerText.replace("Subtotal: $",'') 
    subtotal = parseFloat(currentSubtotal) - parseInt(productPrice);
    subtotalElement.innerText =  "Subtotal: $" + subtotal.toFixed(2);
 
 
}
// Displays the current cart quantity beside the cart icon.
function updateCartCountDisplay() {


    // Retrieve and display the cart count
    let cartCount = parseInt(sessionStorage.getItem('cartCount')) || 0;
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
}
// Navigates to the dedicated checkout page.
function goToCartPage()
{
    window.location.href = 'website-content/HTML/Checkout-SHAKE.html';
}
//----------------------------------END OF CART FUNCTIONALITY----------------------------------//





//----------------------------------PAGE FUNCTIONS----------------------------------//
// Sends the contact form fields to the site's email handler.
function submitContactForm() 
{

    var formData = new FormData(document.getElementById("contactForm"));

    // Use AJAX to send the form data to the PHP backend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "send_email.php", true);
    xhr.onload = function() {
        if (xhr.status === 200) {
        alert("Email sent successfully!");
        } else {
        alert("Failed to send email. Please try again later.");
        }
    };
    xhr.send(formData);
}  
// Marks the clicked size option as selected within its product's size group.
function highlightButton(label) 
{
    // Remove "active" class from all buttons in the same group
    const group = label.parentElement;
    const buttons = group.getElementsByClassName('button-label');
    for (const button of buttons) {
      button.classList.remove('active');
    }

    // Add "active" class to the clicked button
    label.classList.add('active');
}
// Marks a sold-out size option so it cannot be selected for purchase.
function soldOut(input)
{
    
    input.addEventListener("click", function() {
        // Code to execute when the button is clicked
        // Remove "active" class from all buttons in the same group
        const buttons = input.parentElement.parentElement.querySelectorAll("label");
        console.log(buttons.length);
        
        for (const button of buttons) {
            button.classList.remove('active');
            console.log(button);
        }
    });
 
    
    input.parentElement.classList.add("sold_out");
    input.parentElement.setAttribute("title", "SOLD OUT");

    
}
// Activates the requested page section and hides the other sections.
function showSection(sectionId) 
{
    // Hide all sections
    var sections = document.querySelectorAll('.page-section');
    sections.forEach(function(section) {
        section.classList.stle.backgroundColor = "white";
    });

    // Show the clicked section
    var activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}

//----------------------------------SITE SETUP LOAD----------------------------------//
// Converts the session cart to Square line items and redirects to its payment link.
async function redirectToCheckout()
{
    const lineOrderItems = [];

    // Get cart data from sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    for (const item of cart) {
        lineOrderItems.push({
            quantity: String(item.quantity),
            catalog_object_id: item.cartId,
            item_type: "ITEM"
        });
    }

    try {
        const paymentLink = await window.shakeSquareApi.requestSquarePaymentLink(lineOrderItems);
        window.location.href = paymentLink;
    } catch (error) {
        console.error("There was a problem creating the payment link:", error);
    }
}


window.CatalogItem = window.CatalogItem || class CatalogItem
{
    // Copies the Square catalog fields needed to display one product.
    constructor(item, index, images, itemOptions)
    {
        this.id = item.id;
        this.name = item.item_data.name;
        this.description = item.item_data.description || "";
        this.imageIds = item.item_data.image_ids || [];
        this.variations = item.item_data.variations || [];
        this.index = index;
        this.images = images;
        this.itemOptions = itemOptions;
        const productOptionIds = (item.item_data.item_options || []).map(
            (option) => option.item_option_id
        );
        this.colorOptionId = productOptionIds.find(
            (id) => this.itemOptions[id] && this.isColorOption(this.itemOptions[id])
        );
        this.colorByVariationId = new Map(
            this.variations.map((variation) => [
                variation.id,
                this.getOptionValue(variation, this.colorOptionId)
            ])
        );
        this.colors = [...new Set(
            [...this.colorByVariationId.values()].filter(Boolean)
        )];
        this.selectedColor = "";
        this.imageIdByColor = this.getImageIdsByColor(item.item_data.image_ids || []);
        this.isHomePageFeatured = item.custom_attribute_values?.[
            "Square:fb0e53e7-5b0a-4856-99ad-02f7c99e0476"
        ]?.boolean_value;
        this.createdAt = item.created_at || "";
        this.minimumPrice = Math.min(...this.variations.map(
            (variation) => Number(variation.item_variation_data.price_money?.amount || 0)
        ));
    }

    getOptionValue(variation, optionId)
    {
        const optionValue = variation.item_variation_data.item_option_values?.find(
            (value) => value.item_option_id === optionId
        );
        const option = this.itemOptions[optionId];
        const value = option?.values?.find(
            (candidate) => candidate.id === optionValue?.item_option_value_id
        );
        return value?.item_option_value_data?.name || value?.name || "";
    }

    isColorOption(option)
    {
        if (/\bcolou?rs?\b/i.test(option.name || "")) {
            return true;
        }

        const values = (option.values || []).map(
            (value) => value.item_option_value_data?.name || value.name || ""
        );
        const colorPattern = /\b(black|white|blue|red|green|purple|orange|pink|brown|yellow|olive|gray|grey|beige|tan|cream|navy|burgundy|teal|maroon|silver|gold)\b/i;
        return values.length > 1 && values.every((value) => colorPattern.test(value));
    }

    getVariationLabel(variation)
    {
        const sizeOption = variation.item_variation_data.item_option_values?.find(
            (value) => value.item_option_id !== this.colorOptionId
        );
        return this.getOptionValue(variation, sizeOption?.item_option_id)
            || variation.item_variation_data.name;
    }

    getImageUrl(variation)
    {
        const variationImageId = variation?.item_variation_data.image_ids?.[0];
        const imageId = this.selectedColor
            ? variationImageId || this.imageIdByColor.get(this.selectedColor) || this.imageIds[0]
            : this.imageIds[0] || variationImageId;
        const image = this.images[imageId];
        return typeof image === "string" ? image : image?.url || "";
    }

    getGalleryImageUrls(variation)
    {
        const colorImages = this.selectedColor
            ? this.imageIds.filter((imageId) => (
                this.images[imageId]?.name?.toLowerCase().includes(this.selectedColor.toLowerCase())
            ))
            : [];
        const imageIds = colorImages.length ? colorImages : this.imageIds;
        const urls = imageIds
            .map((imageId) => this.images[imageId])
            .map((image) => typeof image === "string" ? image : image?.url || "")
            .filter(Boolean);
        const currentUrl = this.getImageUrl(variation);

        return [...new Set([currentUrl, ...urls].filter(Boolean))];
    }

    getImageIdsByColor(productImageIds)
    {
        const imageIdsByColor = new Map();
        if (this.colors.length < 2) {
            return imageIdsByColor;
        }

        this.colors.forEach((color, index) => {
            const matchingImageId = productImageIds.find((imageId) => {
                const imageName = this.images[imageId]?.name?.toLowerCase() || "";
                return imageName.includes(color.toLowerCase());
cata            });
            const orderedImageId = productImageIds.length === this.colors.length
                ? productImageIds[index]
                : undefined;
            const imageId = matchingImageId || orderedImageId;
            if (imageId) {
                imageIdsByColor.set(color, imageId);
            }
        });

        return imageIdsByColor;
    }

    getVisibleVariations()
    {
        const color = this.selectedColor || this.colors[0];
        return this.variations.filter((variation) => (
            !color || this.colorByVariationId.get(variation.id) === color
        ));
    }

    renderVariations(buttonGroup, price)
    {
        buttonGroup.replaceChildren();
        const visibleVariations = this.getVisibleVariations();

        visibleVariations.forEach((variation) => {
            const variationData = variation.item_variation_data;
            const label = document.createElement("label");
            label.className = "button-label";
            label.append(document.createTextNode(this.getVariationLabel(variation)));

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `group ${this.id}`;
            input.className = "button";
            input.value = variation.id;
            label.append(input);

            if (variationData.location_overrides?.[0]?.sold_out) {
                soldOut(input);
            } else {
                label.addEventListener("click", function() {
                    highlightButton(this);
                });
            }

            buttonGroup.append(label);
        });

        const priceVariation = visibleVariations[0];
        if (priceVariation) {
            const amount = priceVariation.item_variation_data.price_money.amount;
            price.textContent = (Number(amount) / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        }
    }

    // Builds the product card, size choices, price, and add-to-cart button.
    render()
    {
        const node = document.createElement("div");
        node.dataset.productId = this.id;
        node.dataset.price = String(this.minimumPrice);
        node.dataset.createdAt = this.createdAt;
        node.dataset.catalogOrder = String(this.index);
        node.className = "product-item";

        const pictureContainer = document.createElement("div");
        pictureContainer.className = "pictureContainer";

        const image = document.createElement("img");
        image.alt = this.name;
        const productScroll = document.querySelector(".product-scroll");
        const isShopPage = productScroll?.dataset.catalogPage === "SHOP";
        if (isShopPage) {
            image.addEventListener("load", alignProductImageRows);
        }
        pictureContainer.append(image);

        const previousImage = document.createElement("button");
        previousImage.type = "button";
        previousImage.className = "product-image-arrow product-image-previous";
        previousImage.setAttribute("aria-label", `Previous image of ${this.name}`);
        previousImage.textContent = "‹";
        pictureContainer.append(previousImage);

        const nextImage = document.createElement("button");
        nextImage.type = "button";
        nextImage.className = "product-image-arrow product-image-next";
        nextImage.setAttribute("aria-label", `Next image of ${this.name}`);
        nextImage.textContent = "›";
        pictureContainer.append(nextImage);

        let galleryImageUrls = [];
        let currentImageIndex = 0;
        const updateGallery = () => {
            galleryImageUrls = this.getGalleryImageUrls(this.getVisibleVariations()[0]);
            currentImageIndex = 0;
            image.src = galleryImageUrls[currentImageIndex] || "";
            previousImage.hidden = galleryImageUrls.length < 2;
            nextImage.hidden = galleryImageUrls.length < 2;
        };
        const showAdjacentImage = (direction) => {
            currentImageIndex = (
                currentImageIndex + direction + galleryImageUrls.length
            ) % galleryImageUrls.length;
            image.src = galleryImageUrls[currentImageIndex];
        };
        previousImage.addEventListener("click", () => showAdjacentImage(-1));
        nextImage.addEventListener("click", () => showAdjacentImage(1));
        updateGallery();
        node.append(pictureContainer);

        const productDetails = document.createElement("div");
        productDetails.className = "product-details";
        node.append(productDetails);

        const heading = document.createElement("h3");
        heading.textContent = this.name;
        productDetails.append(heading);

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = this.description;
        productDetails.append(description);

        const price = document.createElement("p");
        price.className = "price";
        productDetails.append(price);

        if (this.colors.length > 0) {
            const colorSelection = document.createElement("div");
            colorSelection.className = "color-selection";

            const colorLabel = document.createElement("span");
            colorLabel.textContent = "Color:";
            colorSelection.append(colorLabel);

            const colorSelect = document.createElement("select");
            colorSelect.className = "color-select";
            colorSelect.setAttribute("aria-label", `Color for ${this.name}`);
            colorSelect.required = true;
            const colorPlaceholder = document.createElement("option");
            colorPlaceholder.value = "";
            colorPlaceholder.textContent = "Choose a color";
            colorPlaceholder.disabled = true;
            colorPlaceholder.selected = true;
            colorSelect.append(colorPlaceholder);
            this.colors.forEach((color) => {
                const option = document.createElement("option");
                option.value = color;
                option.textContent = color;
                colorSelect.append(option);
            });
            colorSelect.addEventListener("change", () => {
                this.selectedColor = colorSelect.value;
                updateGallery();
                this.renderVariations(buttonGroup, price);
            });
            colorSelection.append(colorSelect);
            productDetails.append(colorSelection);
        }

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";

        this.renderVariations(buttonGroup, price);

        productDetails.append(buttonGroup);

        const addToCart = document.createElement("button");
        addToCart.className = "add-to-cart";
        addToCart.textContent = "Add To Cart";
        addToCart.addEventListener("click", function() {
            toggleCart(this);
            loadCart();
        });
        productDetails.append(addToCart);

        return node;
    }
}

// Requests Square catalog items and renders the products for the current page.
async function displayCatalogItems(page)
{
    try {
        const catalog = await window.shakeSquareApi.requestSquareCatalogItems();
        const { items, images, itemOptions } = catalog;

        const productScroll = document.querySelector(".product-scroll");
        if (!productScroll) {
            throw new Error("Could not find the product catalog container.");
        }
        productScroll.dataset.catalogPage = page;
        if (page === "SHOP" && !productScroll.dataset.imageRowResizeListenerAttached) {
            window.addEventListener("resize", alignProductImageRows);
            productScroll.dataset.imageRowResizeListenerAttached = "true";
        }

        productScroll.querySelectorAll(".product-item").forEach((item) => item.remove());
        productScroll.querySelector(".catalog-empty")?.remove();

        items.forEach((item, index) => {
            const catalogItem = new window.CatalogItem(item, index, images, itemOptions);
            if (page === "HOME" && catalogItem.isHomePageFeatured === false) {
                return;
            }

            productScroll.append(catalogItem.render());
        });

        if (!productScroll.querySelector(".product-item")) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "catalog-empty";
            emptyMessage.textContent = "No products are available in this Square catalog.";
            productScroll.append(emptyMessage);
        }

        const sortSelect = document.querySelector("#sort");
        if (sortSelect) {
            if (!sortSelect.dataset.sortListenerAttached) {
                sortSelect.addEventListener("change", sortCatalogItems);
                sortSelect.dataset.sortListenerAttached = "true";
            }
            sortCatalogItems();
        }
    } catch (error) {
        console.error("There was a problem loading the catalog:", error);
    }
}

// Gives each grid row a shared image area based on its currently displayed images.
function alignProductImageRows()
{
    const productScroll = document.querySelector(".product-scroll");
    if (
        !productScroll
        || productScroll.dataset.catalogPage !== "SHOP"
        || getComputedStyle(productScroll).display !== "grid"
    ) {
        return;
    }

    const cards = [...productScroll.querySelectorAll(".product-item")];
    const columnCount = getComputedStyle(productScroll).gridTemplateColumns
        .split(/\s+/)
        .filter(Boolean)
        .length;
    if (columnCount < 1) {
        return;
    }

    for (let index = 0; index < cards.length; index += columnCount) {
        const row = cards.slice(index, index + columnCount);
        const imageAreaHeight = Math.max(0, ...row.map((card) => {
            const image = card.querySelector(".pictureContainer > img");
            const frame = card.querySelector(".pictureContainer");
            if (!image || !frame) {
                return 0;
            }

            if (!image.naturalWidth || !image.naturalHeight) {
                return 0;
            }

            return frame.clientWidth * image.naturalHeight / image.naturalWidth;
        }));

        row.forEach((card) => {
            const frame = card.querySelector(".pictureContainer");
            if (frame) {
                frame.style.height = imageAreaHeight ? `${imageAreaHeight}px` : "auto";
            }
        });
    }
}

// Sorts the rendered product cards by their selected catalog field.
function sortCatalogItems()
{
    const productScroll = document.querySelector(".product-scroll");
    const sortSelect = document.querySelector("#sort");
    if (!productScroll || !sortSelect) {
        return;
    }

    const products = [...productScroll.querySelectorAll(".product-item")];
    const sortBy = sortSelect.value;
    products.sort((first, second) => {
        if (sortBy === "name-asc") {
            return first.querySelector("h3").textContent.localeCompare(second.querySelector("h3").textContent);
        }
        if (sortBy === "name-desc") {
            return second.querySelector("h3").textContent.localeCompare(first.querySelector("h3").textContent);
        }
        if (sortBy === "date-newest") {
            return Date.parse(second.dataset.createdAt || "") - Date.parse(first.dataset.createdAt || "")
                || Number(first.dataset.catalogOrder) - Number(second.dataset.catalogOrder);
        }
        if (sortBy === "date-oldest") {
            return Date.parse(first.dataset.createdAt || "") - Date.parse(second.dataset.createdAt || "")
                || Number(first.dataset.catalogOrder) - Number(second.dataset.catalogOrder);
        }
        if (sortBy === "price") {
            return Number(first.dataset.price) - Number(second.dataset.price);
        }

        return Number(first.dataset.catalogOrder) - Number(second.dataset.catalogOrder);
    });

    products.forEach((product) => productScroll.append(product));
    alignProductImageRows();
}
//----------------------------------END OF CATALOG DISPLAY----------------------------------//
