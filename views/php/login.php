<?php
session_start();
$conn = new mysqli("localhost", "root", "", "mengyou");

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
  $stmt->bind_result($user_id, $hashed_password);
  $stmt->fetch();

  if (password_verify($password, $hashed_password)) {
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    header("Location: ../profile.html");
  } else {
    echo "Incorrect password.";
  }
} else {
  echo "User not found.";
}

$stmt->close();
$conn->close();
?>
