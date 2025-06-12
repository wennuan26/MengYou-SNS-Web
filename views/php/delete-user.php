<?php
session_start();
if ($_SESSION['username'] !== 'admin') {
  die("Unauthorized");
}

$conn = new mysqli("localhost", "root", "", "mengyou");
$user_id = $_POST['user_id'];

// Delete user-related content first (optional)
$conn->query("DELETE FROM posts WHERE user_id = $user_id");
$conn->query("DELETE FROM marketplace WHERE user_id = $user_id");
$conn->query("DELETE FROM community_members WHERE user_id = $user_id");

$conn->query("DELETE FROM users WHERE id = $user_id");

echo "User deleted. <a href='../admin.html'>Back</a>";
?>
