<?php
session_start();
if ($_SESSION['username'] !== 'admin') {
  http_response_code(403);
  exit("Access denied");
}

$conn = new mysqli("localhost", "root", "", "mengyou");
$result = $conn->query("SELECT id, title, content FROM posts ORDER BY id DESC");

$posts = [];
while ($row = $result->fetch_assoc()) {
  $posts[] = $row;
}
echo json_encode($posts);
?>
