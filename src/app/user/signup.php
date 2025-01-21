<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$name = $data->name;
$password = $data->password;

$servername = "db4free.net";
$username = "userrwt";
$password = "talahoon123!";
$dbname = "db_rwt";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Verbindung fehlgeschlagen: " . $conn->connect_error]));
} else {
    $stmt = $conn->prepare("INSERT INTO tbl_user (email, name, password) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $email, $name, $password);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Daten erfolgreich eingetragen."]);
    } else {
        echo json_encode(["message" => "Fehler beim Eintragen der Daten: " . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}
?>
