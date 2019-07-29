<?php

require 'php/PHPMailerAutoload.php';

$mail = new PHPMailer;

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$tel = htmlspecialchars($_POST["phone"]);
$action = htmlspecialchars($_POST["action"]);

$mail->isSMTP();                                       // Указываем что используем SMTP
$mail->Host = 'mail.margin-studio.uz';               //  Адрес вашего SMTP Сервера был отправлен вместе с доступами к cPanel
$mail->SMTPAuth = true;                          // Включение проверки подлинности SMTP
$mail->Username = 'info@margin-studio.uz';                 // Логин почтового ящика
$mail->Password = ')YN#amQM}8Jn';                           // Пароль
$mail->SMTPSecure = 'ssl';                            // Указываем какое подключение используем TLS или SSL в нашем случае SSL
$mail->Port = 465;                                    // Порт для SSL - 465, TLS 587.

$site = 'www.ims.uz';

$mail->setFrom('info@margin-studio.uz', 'Margin Studio');
$mail->addAddress('usmanovmirislam@gmail.com', 'Margin Studio');     // Добавить получателя

$mail->isHTML(true);                                  // Разрешаем передавать HTML
$mail->CharSet = 'UTF-8';                          // Разрешаем символы на кириллице

$mail->Subject = $action . ' - Margin Studio';
$mail->Body    = "<strong>Имя:</strong> ".$name."<br><strong>Телефон:</strong> " .$tel."<br><strong>E-mail:</strong> " .$email."<br><br>Письмо с сайта " . $site;


if(!$mail->send()) {
    echo 'Письмо по технической проблеме не отправлено!';
    echo 'Позвоните по номеру +998 71 200 02 44';
} else {
    echo '
    <link rel="stylesheet" href="css/core-style.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <style>
        .gradient-background {
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hero-slides-content {
            display: flex;
            align-items: center;
        }
        .hero-slides-content h2 {
            font-size: 35px;
            margin-bottom: 0;
            margin-left: 20px;
        }
    </style>
    <!doctype html>
    <html lang="ru">
    <head>
    <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                     <meta http-equiv="X-UA-Compatible" content="ie=edge">
         <title>Ваше письмо удачно отправлено</title>
    </head>
    <body>
         <div class="gradient-background">
            <div class="hero-slides-content">
                 <img src="img/checked.svg" alt="" width="75px" height="75px">
               <h2>Ваша заявка отправлена</h2>
            </div>
        </div>
    </body>
    </html>
 
    ';
}
