<?php
$count = $_POST['count'];
$from = $_POST['from'];
$name = $_POST['name'];
$phone = $_POST['tel'];
$product = $_POST['product'];

$message_mail .= '<b>Откуда:</b> ' . $from . '<br>';
$message_mail .= '<b>Какой товар:</b> ' . $product . '<br>';
$message_mail .= '<b>Количество:</b> ' . $count . '<br>';
$message_mail .= '<b>Имя:</b> ' . $name . '<br>';
$message_mail .= '<b>Телефон:</b>' . $phone;


$to  = "dozone12@gmail.com";
$subject = "Письмо с сайта GazSt";
$headers  = "Content-type: text/html; charset=utf-8 \r\n";
$headers .= "From: GazSt <from@example.com>\r\n";
$headers .= "Reply-To: reply-to@example.com\r\n";

mail($to, $subject, $message_mail, $headers);
