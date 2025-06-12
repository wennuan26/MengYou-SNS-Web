<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  echo "Login required to post items.";
  exit;
}

$conn = new mysqli("localhost", "root", "", "mengyou");

$name = $_POST['item_name'];
$desc = $_POST['description'];
$price = $_POST['price'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO marketplace (user_id, item_name, description, price) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $name, $desc, $price);

if ($stmt->execute()) {
  echo "Item listed successfully! <a href='../marketplace.html'>Back</a>";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
