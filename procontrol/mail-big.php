
<?php

$recepient = "usmanovmirislam@gmail.com";
$siteName = "Проконтрол";

$formname = trim($_POST["form-name"]);
$name = trim($_POST["name"]);
$phone = trim($_POST["phone"]);
$pom = trim($_POST["pom"]);
$kol = trim($_POST["kol"]);
$system = trim($_POST["system"]);
$plus = trim($_POST["plus"]);
$range = trim($_POST["range"]);
$height = trim($_POST["height"]);
$type = trim($_POST["type"]);
$textarea = trim($_POST["textarea"]);
$call = trim($_POST["callname"]);

$message = "Форма заявки: $formname \r\nИмя: $name \r\nТелефон: $phone \r\nПомещение: $pom \r\nКол-во людей: $kol \r\nСостав системы: $system \r\nДополнительные опции: $plus \r\nПлощадь помещений (м2): $range \r\nВысота потолков (м): $height \r\nТип системы вентиляции: $type \r\nСпособ связи: $call \r\nДополнительные комментарии: $textarea";

$pagetitle = "Заявка с сайта \"$siteName\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

?>