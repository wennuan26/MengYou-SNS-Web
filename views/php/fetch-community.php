<?php
$conn = new mysqli("localhost", "root", "", "mengyou");

$result = $conn->query("SELECT id, name, description FROM communities ORDER BY id DESC");

$communities = [];
while ($row = $result->fetch_assoc()) {
  $communities[] = $row;
}

echo json_encode($communities);
?>
