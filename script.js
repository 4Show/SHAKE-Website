const cartCount = 0;

function toggleCart(cartNode, productItem) 
{
    
    window.location.href = '';

}


//this function will take the user to the checkout page after clicking the cart icon
function goToCartPage()
{
    window.location.href = '';
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
function highlightSize(selectedButton, productName) 
{

    //select the product item you are currently under ot identify the right information to send
    var product = document.getElementById(productName);
    //get the buttons under this element
    var buttons = product.querySelectorAll("button");
    
    // Remove "highlighted" class from all buttons
    buttons.forEach(btn => btn.classList.remove('.highlighted'));

    // Add "highlighted" class to the selected button
    buttons[selectedButton - 1].classList.add('.highlighted');
}    

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

