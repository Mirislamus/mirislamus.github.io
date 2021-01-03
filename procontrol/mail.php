
<?php

$recepient = "usmanovmirislam@gmail.com";
$siteName = "Проконтрол";

$formname = trim($_POST["form-name"]);
$name = trim($_POST["name"]);
$phone = trim($_POST["phone"]);
$message = "Форма заявки: $formname \r\nИмя: $name \r\nТелефон: $phone";

$pagetitle = "Заявка с сайта \"$siteName\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

?>