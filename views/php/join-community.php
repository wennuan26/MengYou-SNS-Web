<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  echo "Please log in to join communities.";
  exit;
}

$conn = new mysqli("localhost", "root", "", "mengyou");

$user_id = $_SESSION['user_id'];
$community_id = $_POST['community_id'];

$stmt = $conn->prepare("INSERT IGNORE INTO community_members (user_id, community_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $community_id);

if ($stmt->execute()) {
  echo "Joined successfully! <a href='../communities.html'>Back</a>";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
