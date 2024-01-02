cartCount = 0;

function toggleCart() 
{
  // Add your logic to show/hide the cart or navigate to the cart page
  // For now, let's just increment the cart count
  cartCount++;
  document.getElementById('cartCount').innerText = cartCount;
}


//this function will take the user to the checkout page after clicking the cart icon
function goToCartPage()
{
    window.location.href = '';
}

// this function will take care of the actions associated with submitting the contact form
// on the contact page
function submitContactForm() {

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

function isAnySizeHighlighted(product) {
    // Get the size buttons container for the specified product
    const sizeButtonsContainer = document.querySelector(`.size-buttons[data-product="${product}"]`);

    // Check if any size button is highlighted
    const highlightedSize = sizeButtonsContainer.querySelector('.highlight');
    
    // Return true if any size button is highlighted, otherwise return false
    return !!highlightedSize;
}


function highlightSize(button, product, size) {
    // Toggle the 'highlight' class for the clicked button
    button.classList.toggle('highlight');

    // You can now use the 'size' parameter to get the selected size
    console.log('Product: ' + product + ', Selected Size: ' + size);

    
}

function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.page-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    // Show the clicked section
    var activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}

