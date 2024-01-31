function toggleCart(cartNode, productId) 
{

    const selectedButton = document.querySelector('.button-label input[type="radio"]:checked');
    if (selectedButton) 
    {
    
         // Get existing cart data from sessionStorage
         let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
         let cartCount = parseInt(sessionStorage.getItem('cartCount')) || 0;
        
         let productContainer = cartNode.parentElement.parentElement


        // Extract product information from the container
        let product = {
            name: productContainer.querySelector("div").querySelector("h3").innerHTML,
            description: productContainer.querySelector("div").querySelector("p").innerHTML,
            price: productContainer.querySelector("div").getElementsByClassName("price")[0].innerHTML,
            // size: productContainer.querySelector("div").,
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


    for(i =0; i < cart.length -1 ; i++)
    {
        if (cart.length == 0) 
        {
            const para = document.createElement("p");
            const node = document.createTextNode("Your cart is empty.");
            para.appendChild(node);

            cartContent.appendChild(para);
        } 
        else
        {
            //create div element
            let divContainer = document.createElement("div");
            

            //create the children of the div element

            //gets the image
            let img = document.createElement("img");
            img.setAttribute('src',cart[i].image);
            divContainer.appendChild(img);
            

            // gets the name           
            let par2 = document.createElement("p");
            par2.innerText = cart[i].name; 
            divContainer.appendChild(par2);
            
            

            // gets the price
            let par = document.createElement("p");
            par.innerText= cart[i].price; 
            divContainer.appendChild(par);
            

            //append the information to the cartContainer
            cartContent.appendChild(divContainer);
            
                            
        }
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

