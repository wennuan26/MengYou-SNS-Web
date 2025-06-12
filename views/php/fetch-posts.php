<?php
header('Content-Type: application/json');

$posts = [
  ["title" => "Welcome to MengYou!", "content" => "This is a test public post."],
  ["title" => "Join Our Community", "content" => "Explore niche interests!"],
];

echo json_encode($posts);
?>
