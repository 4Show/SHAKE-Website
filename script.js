function toggleCart(cartNode, productId) 
{

    const selectedButton = document.querySelector('.button-label input[type="radio"]:checked');
    if (selectedButton) 
    {
    
         // Get existing cart data from sessionStorage
         let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
         let cartCount = parseInt(sessionStorage.getItem('cartCount')) || 0;
        
         let productContainer = cartNode.parentElement.parentElement
         let radioButtonsLabel = productContainer.querySelector("div").getElementsByClassName("button-group")[0].querySelectorAll("label");


         for (index = 0; index < radioButtonsLabel.length; index++) 
         {
            var radioButtons = radioButtonsLabel[index].querySelector("input");
           
           
             if (radioButtons.checked) 
             {
                 // Get the label associated with the checked radio button
                var sizeHold = radioButtonsLabel[index].innerText;
                
             }
         }


        // Extract product information from the container
        let product = {
            name: productContainer.querySelector("div").querySelector("h3").innerHTML,
            description: productContainer.querySelector("div").querySelector("p").innerHTML,
            price: productContainer.querySelector("div").getElementsByClassName("price")[0].innerHTML,
            size: sizeHold,
            image: productContainer.querySelector("img").getAttribute("src")
        };

        
        //window.alert(productContainer.querySelector("div").getElementsByClassName("price")[0].innerHTML);

        cart.push(product);
        
        cartCount++;

         // Update sessionStorage with the new cart data
        sessionStorage.setItem('cart', JSON.stringify(cart));
        sessionStorage.setItem('cartCount', cartCount);
        updateCartCountDisplay();
    }
    else 
    {
        alert('Please select a product before adding to cart.');
    }



}

function loadCart()
{

    // Get cart data from sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    // window.alert(cart.length);


    // Display cart content
    const cartContent = document.getElementById('cartContent');
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
            let itemDiv = document.createElement("div");
            


            // //create div element
            // let divContainer = document.createElement("div");
            // let displayInline = document.createElement("div");
            // displayInline.setAttribute("class", "displayInline");
            // displayInline.style.display="flex";


            // //gets the subtotal
            // var productPrice = parseFloat(cart[i].price.replace("$",''));
            // let subtotalElement = document.getElementById("subtotal").querySelector("h3");
            // subtotal +=  productPrice;
            // subtotalElement.style.textAlign= "right";
            // subtotalElement.innerHTML = "Subtotal: $" + subtotal;
        
            

            // //create the children of the div element

            // //gets the image
            // let img = document.createElement("img");
            // img.setAttribute('src',cart[i].image);
            // divContainer.appendChild(img);


            // //sets up the quanitty 
            // let quantDiv = document.createElement("div");
            // quantDiv.setAttribute("class","quantity");
            // quantDiv.style.display = "flex";
            // quantDiv.style.alignItems = 'center';
            // quantDiv.style.justifyContent = 'center';
            // quantDiv.style.width = "50%";
            

            // let minusBut = document.createElement("button");
            // minusBut.setAttribute("class", "minus-btn");
            // minusBut.addEventListener('click', function(){
            //     decreaseQuantity();
            // });
            // minusBut.innerText = "-";
            

            // let quantityInput = document.createElement("input");
            // quantityInput.setAttribute("type","text");
            // quantityInput.setAttribute("id","quantity");
            // quantityInput.setAttribute("value", 1);
            // quantityInput.style.textAlign = "center";
            // quantityInput.style.width = "40%";
            

            // let plusBut = document.createElement("button");
            // plusBut.setAttribute("class", "plus-btn");
            // plusBut.addEventListener('click', increaseQuantity);
            // plusBut.innerText = "+";
           

            // quantDiv.appendChild(minusBut);
            // quantDiv.appendChild(quantityInput);
            // quantDiv.appendChild(plusBut);
           
            // displayInline.appendChild(quantDiv);
            
            // descDiv = document.createElement("div");
            // descDiv.setAttribute("class", "productDescription");
            // descDiv.style.width="50%";
            // descDiv.style.textAlign = "center";

            // // gets the name           
            // let par2 = document.createElement("p");
            // par2.innerText = cart[i].name; 
            // descDiv.appendChild(par2);
            
            // // gets the size
            // let parb = document.createElement("p");
            // parb.innerText= "Size: " + cart[i].size; 
            // descDiv.appendChild(parb);

            // // gets the price
            // let par = document.createElement("p");
            // par.innerText= cart[i].price; 
            // descDiv.appendChild(par);


            // displayInline.appendChild(descDiv);
            // divContainer.appendChild(displayInline);
            

            // //append the information to the cartContainer
            // cartContent.appendChild(divContainer);
            
                            
        }
    }
   
}
function increaseQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function decreaseQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
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


document.querySelector("cart-icon").addEventListener('click',function()
{
    let cart = JSON.parse(sessionStorage("cart"));
    let subtotal = 0;
    for(i = 0; i < cart.length ; i++)
    {
        subtotal += cart[i].price;
    }

   
});