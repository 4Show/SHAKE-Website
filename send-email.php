<?php

// isset($_POST['$email']) && ($_POST['$email'] != "") && isset($_POST['$name']) && ($_POST['$name'] != "") && isset($_POST['$message']) && ($_POST['$message'])!= "" 


    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $headers = "Name: " .$name. "\r\n";
    $recipient = "4showinvestments@gmail.com";

    mail($recipient,"SHAKE Support", $message, $headers);
   
    echo "message sent";


?>