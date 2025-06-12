<?php
session_start();
// Security: Only allow admin
if ($_SESSION['username'] !== 'admin') {
  http_response_code(403);
  exit("Access denied");
}

$conn = new mysqli("localhost", "root", "", "mengyou");
$result = $conn->query("SELECT id, username, email, role FROM users");

$users = [];
while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}
echo json_encode($users);
?>
