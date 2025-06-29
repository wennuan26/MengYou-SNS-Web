let feed = document.getElementById('feed');

function createPost() {
  const text = document.getElementById('postText').value;
  const imageInput = document.getElementById('imageUpload');
  const imageFile = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const postHTML = `
      <article class="post">
        <div class="post-header">
          <h3>@chei</h3>
          <span>${new Date().toISOString().slice(0, 10)}</span>
        </div>
        <p>${text}</p>
        ${imageFile ? `<img src="${e.target.result}" alt="User Image">` : ''}
        <div class="actions">
          <button onclick="likePost(this)">❤️ Like</button>
          <span class="like-count">0</span>
        </div>
        <div class="comment-box">
          <input type="text" placeholder="Write a comment..." onkeypress="handleComment(event, this)">
          <div class="comment-list"></div>
        </div>
      </article>
    `;
    feed.insertAdjacentHTML('afterbegin', postHTML);
    document.getElementById('postText').value = '';
    imageInput.value = '';
    savePosts();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onload({ target: { result: "" } });
  }
}

function likePost(button) {
  const countSpan = button.nextElementSibling;
  let count = parseInt(countSpan.textContent);
  countSpan.textContent = count + 1;
}

function handleComment(event, input) {
  if (event.key === 'Enter' && input.value.trim()) {
    const commentList = input.nextElementSibling;
    const comment = document.createElement('div');
    comment.textContent = `@you: ${input.value}`;
    commentList.appendChild(comment);
    input.value = '';
  }
}

// Save posts in localStorage
function savePosts() {
  localStorage.setItem("feedContent", feed.innerHTML);
}

// Load saved posts on page load
window.onload = function () {
  const saved = localStorage.getItem("feedContent");
  if (saved) {
    feed.innerHTML = saved;
  }
};

// Js/scripts.js

// Hardcoded credentials
const hardcodedUsername = "admin";
const hardcodedPassword = "1234";

// Login function
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username === hardcodedUsername && password === hardcodedPassword) {
    // Save login state in localStorage
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);

    // Redirect to index.html
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password!");
  }
}

// Check login status before showing index.html content
function checkLogin() {
  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn !== "true") {
    // Redirect back to login if not logged in
    window.location.href = "login.html";
  }
}

// Optional: Logout
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}
// Create a post and store it in localStorage
function createPost() {
  const text = document.getElementById("postText").value;
  const imageInput = document.getElementById("imageUpload");
  const username = localStorage.getItem("username");

  if (!text && imageInput.files.length === 0) {
    alert("Please enter a message or select an image.");
    return;
  }

  // Create post object
  const post = {
    user: username,
    text: text,
    image: imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : null,
    timestamp: new Date().toLocaleString()
  };

  // Load existing posts
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Add new post
  posts.unshift(post);

  // Save back to localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Clear form
  document.getElementById("postText").value = "";
  imageInput.value = "";

  // Reload feed
  displayPosts();
}
function displayPosts() {
  const feed = document.getElementById("feed");
  const username = localStorage.getItem("username");
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Clear feed first
  feed.innerHTML = "";

  // Filter and display posts for this user
  posts
    .filter(post => post.user === username)
    .forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      postDiv.innerHTML = `
        <p><strong>${post.user}</strong> <em>${post.timestamp}</em></p>
        <p>${post.text}</p>
        ${post.image ? `<img src="${post.image}" alt="Post Image" style="max-width: 100%; height: auto;">` : ""}
      `;

      feed.appendChild(postDiv);
    });
}

