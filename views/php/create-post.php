<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  echo "You must be logged in.";
  exit;
}

$conn = new mysqli("localhost", "root", "", "mengyou");

$title = $_POST['title'];
$content = $_POST['content'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user_id, $title, $content);

if ($stmt->execute()) {
  echo "Post created successfully! <a href='../index.html'>View Posts</a>";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
