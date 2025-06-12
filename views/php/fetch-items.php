<?php
$conn = new mysqli("localhost", "root", "", "mengyou");

$result = $conn->query("SELECT item_name, description, price FROM marketplace ORDER BY id DESC");

$items = [];

while ($row = $result->fetch_assoc()) {
  $items[] = $row;
}

echo json_encode($items);
?>
