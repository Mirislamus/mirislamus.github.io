<?php
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$selectedProjects  = 'None';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: Content-Type");

$letter = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><title>New question | Luxeberry</title></head><body>";
if(isset($_POST['projects']) && is_array($_POST['projects']) && count($_POST['projects']) > 0){
    $selectedProjects = implode(', ', $_POST['projects']);
    $letter .= "<p>I’m interested in: ".htmlspecialchars($selectedProjects)."</p>";
}
if ($name) {
    $letter .= "<p>Name: ".htmlspecialchars($name)."</p>";
}
if ($email) {
    $letter .= "<p>Email: ".htmlspecialchars($email)."</p>";
}
if ($message) {
    $letter .= "<p>Project description:</p><div><pre>".htmlspecialchars($message)."</pre></div>";
}

$letter .= "</body></html>";

$url = 'https://api.eu.mailgun.net/v3/humandone.com/messages';
$data = array(
    'from' => 'hello@humandone.com',
    'to' => 'hello@humandone.com',
    'subject' => "New question | Humandone",
    'html' => $letter
);

$username = "api";
$api_key = "96fbfb23d8a8859449bd56d002d11268-6e0fd3a4-f3348c8d";
$credentials = base64_encode("$username:$api_key");

$options = array(
    'http' => array(
        'header' => "Authorization: Basic " . $credentials,
        'method' => 'POST',
        'content' => http_build_query($data)
    )
);
$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo 'OK';
return $result;
?>
