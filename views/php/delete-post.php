<?php
session_start();
if ($_SESSION['username'] !== 'admin') {
  die("Unauthorized");
}

$conn = new mysqli("localhost", "root", "", "mengyou");
$post_id = $_POST['post_id'];

$conn->query("DELETE FROM posts WHERE id = $post_id");

echo "Post deleted. <a href='../admin.html'>Back</a>";
?>
