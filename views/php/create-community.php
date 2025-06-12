<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  echo "Login required to create community.";
  exit;
}

$conn = new mysqli("localhost", "root", "", "mengyou");

$name = $_POST['community_name'];
$desc = $_POST['description'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO communities (name, description, created_by) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $name, $desc, $user_id);

if ($stmt->execute()) {
  echo "Community created successfully! <a href='../communities.html'>Back</a>";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
