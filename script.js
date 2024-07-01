

function toggleCart(cartNode, productId) 
{

    const selectedButton = document.querySelector('.button-label input[type="radio"]:checked');
    if (selectedButton) 
    {
    
         // Get existing cart data from sessionStorage
         let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
         let cartCount = parseInt(sessionStorage.getItem('cartCount')) || 0;
         let cartIDs = JSON.parse(sessionStorage.getItem('cartIDs')) || [];
         
        
         let productContainer = cartNode.parentElement.parentElement
         let radioButtonsLabel = productContainer.querySelector("div").getElementsByClassName("button-group")[0].querySelectorAll("label");
         let sizeSelected=false;

         for (index = 0; index < radioButtonsLabel.length; index++) 
         {
            var radioButtons = radioButtonsLabel[index].querySelector("input");
           
           
             if (radioButtons.checked) 
             {
                 // Get the label associated with the checked radio button
                var sizeHold = radioButtonsLabel[index].innerText;
                sizeSelected = true;
                
                var cartId = (radioButtonsLabel[index].querySelector("input").getAttribute("value"));

                
                
             }
         }
         

        // Extract product information from the container
        let product = {
            name: productContainer.querySelector("div").querySelector("h3").innerHTML,
            description: productContainer.querySelector("div").querySelector("p").innerHTML,
            price: productContainer.querySelector("div").getElementsByClassName("price")[0].innerHTML,
            size: sizeHold,
            image: productContainer.querySelector("img").getAttribute("src"),
            quantity:1,
            cartId: cartId
        };

        

     

        if(!sizeSelected)
        {
            alert("Please select a size before adding to cart");
        }
        else{
            var i=0;
            while(i < cart.length)
            {
                if(cart[i].name == product.name && cart[i].size == product.size)
                {
                    var found = true;
                    break;
                }
                i++;
            }

            if(found == true)
            {
                cart[i].quantity +=1;
                sessionStorage.setItem(cart, JSON.stringify(cart));
            }
            else{
                cart.push(product);
                
            }
            cartIDs.push(cartId);
            cartCount++;

            // Update sessionStorage with the new cart data
            sessionStorage.setItem('cart', JSON.stringify(cart));
            sessionStorage.setItem('cartCount', cartCount);
            sessionStorage.setItem('cartIDs', JSON.stringify(cartIDs));
            
            updateCartCountDisplay();
            
            
        }
        
    }
    else 
    {
        alert('Please select a product before adding to cart.');
    }

    

}



function showCart()
{
     //transitions the cart open
     transWin = document.querySelector(".cartTab");
     transWin.style.right = "0%";
}

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


    if (cart.length == 0) 
    {
       window.alert("Cart Empty")
    } 
    

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
                img.setAttribute('src',cart[i].image);
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



function updateCartCountDisplay() {


    // Retrieve and display the cart count
    let cartCount = parseInt(sessionStorage.getItem('cartCount')) || 0;
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
}


//this function will take the user to the checkout page after clicking the cart icon
function goToCartPage()
{
    window.location.href = 'Checkout-SHAKE.html';
}

// this function will take care of the actions associated with submitting the contact form
// on the contact page
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

//when the button is clicked within the specific product item
//I want the background color of the button to change to red
//SELECTS THE correct size button for each product
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

function closeCart()
{
    closeBtn = document.querySelector(".cartTab");
    closeBtn.style.right = "-400px";
    
    updateCartCountDisplay();
}

async function callPaymentLink()
{

    const awsEndpoint = "https://82nxujrefe.execute-api.us-east-1.amazonaws.com/createPaymentLink";
    const functionURL = "https://b44ax3y3wncvazueob7tlu53iu0jjscm.lambda-url.us-east-1.on.aws/";
    var params = new URLSearchParams();
    var lineOrderItems = []

    // Get cart data from sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart'))||[];

    for(let i = 0; i< cart.length; i++)
    {
        var cartID = cart[i].cartId;
        var quantity = cart[i].quantity;

        
        lineOrderItems[i] =  {
            "quantity": String(quantity),
            "catalog_object_id": cartID,
            "item_type": "ITEM"
            }
    }
    
    // window.alert(params);
    // Use the parameters in a URL
    // var urlWithParams = `${url}?${params.toString()}`;
    // bodyContent = {
    //     "lineOrderItems": lineOrderItems
    // }

    bodyContent = {
        // "description": "SHK Apparel",
        "line_items": lineOrderItems,
        // "allow_tipping": False,
        // "ask_for_shipping_address": True,
        // "apple_pay": True,
        // "google_pay": True,
        // "cash_app_pay": True,
        // "afterpay_clearpay": True,
        // "enable_coupon": False,
        // "enable_loyalty": False
        
}

    try {
        const response = await fetch(functionURL, 
        {
            method: 'POST', // or 'GET', 'PUT', etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyContent)
            
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        let data = await response.text();
        window.location.href  = data;

        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}