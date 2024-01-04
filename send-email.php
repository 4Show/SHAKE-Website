<?php
// isset($_POST['$email']) && ($_POST['$email'] != "") && isset($_POST['$name']) && ($_POST['$name'] != "") && isset($_POST['$message']) && ($_POST['$message'])!= "" 
if(!empty($_POST["send"])){
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $headers = "Name: " .$user. "\r\n";
    $recipient = "4showinvestments@gmail.com";

    $message_sent= mail($recipient,"SHAKE Support", $message, $headers);
   
    
}
?>

<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="HomePageStyle.css">
  <title>SHAKE - Luxury Streetwear</title>
  <script src="script.js"></script>
</head>

<body>

  <header>
    <div>
      <img src="SHK-Logo.png" alt="SHK Logo">
      <div class="cart-icon" onclick="goToCartPage()">🛒 <span id="cartCount">0</span></div>
    </div>
    <h3>Start Hustling And Kill Everything</h3>
    
  </header>

  <nav>
    <ul>
      <li><a href="Home-SHAKE.html">Home</a></li>
      <li><a href="Shop-SHAKE.html">Shop</a>
        <ul class="submenu">
          <li><a href="#">Men</a></li>
          <li><a href="#">Women</a></li>
        </ul>
      </li>
      <li><a href="About-SHAKE.html">About Us</a></li>
      <li><a href="Contact-SHAKE.html">Contact</a></li>
    </ul>
  </nav>
 

    <?php
        if($message_sent != false):
    ?>
        <!-- display contact form with success message -->

    <?php
        else:
    ?>
  
    <div class = "contact-form-container">
        <div class = "formDiv">
            <form class="contactForm" method="post" action = "send-email.php">
                <h2>Contact Us</h2>
                <p>Email: support@shake.com</p>
                <p>Instagram: <a href="https://www.instagram.com/shk_shake" target="_blank">@shk_shake</a></p>

                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            
                <label for="message">Message:</label>
                <textarea id="message" name="message" required></textarea>
            
                <button type="submit" on>Submit</button>
            </form>
        </div>

    </div>
    <?php
        endif;
    ?>
  

</body>


<footer>
  <h4>&copy; 2018 SHAKE - Luxury Streetwear. All rights reserved.</h4>
  
  <div class="footerDiv">
    <div class="left-section">
      <img src="HustlersConceptTag.png" alt="Transparent Image"  width="50%">
    </div>
  
    
    <div class="right-section">
      <div class="follow-us">
        <h3 class="follow">Follow us:</h3>
        <div>
          <a href="https://www.instagram.com/shk_shake" target="_blank"><img src="instagram.png" alt="Instagram"></a>
          <a href="#" target="_blank"><img src="twitter_logo.png" alt="Twitter"></a>
          <a href="#" target="_blank"><img src="tiktok_logo.png" alt="TikTok"></a>
          <a href="#" target="_blank"><img src="facebook_logo.png" alt="Facebook"></a>
        </div>

      </div>
  
      <div class="subscribe">
        <label for="email">Subscribe to our newsletter:</label>
        <input type="email" id="email" name="email" placeholder="Your email">
        <label for="phone">Subscribe via phone:</label>
        <input type="tel" id="phone" name="phone" placeholder="Your phone number">
        <button type="submit">Subscribe</button>
      </div>
    </div>

  </div>

  
</footer>
</html>