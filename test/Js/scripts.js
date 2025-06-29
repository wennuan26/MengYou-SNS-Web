// Hardcoded Users
const hardcodedUsers = [
  { username: "guest", password: "1234", bio: "Welcome to my profile!", posts: 3, friends: 2 },
  { username: "wen", password: "1234", bio: "Dreamer of codes and clouds", posts: 5, friends: 1 }
];

// Save session
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let posts = JSON.parse(localStorage.getItem("posts")) || [];

function saveSession() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const user = hardcodedUsers.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    saveSession();
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials!");
  }
}

function register() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  if (!username || !password) return alert("Please fill all fields!");
  const exists = hardcodedUsers.find(u => u.username === username);
  if (exists) return alert("Username already taken!");

  const newUser = { username, password, bio: "New user", posts: 0, friends: 0 };
  hardcodedUsers.push(newUser);
  alert("Registered! Please login.");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("currentUser");
}

function createPost() {
  const text = document.getElementById("postText").value;
  if (!text) return alert("Post cannot be empty!");
  const post = {
    user: currentUser.username,
    text,
    time: new Date().toLocaleString()
  };
  posts.unshift(post);
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("postText").value = "";
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;
  feed.innerHTML = "";
  posts.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<b>@${p.user}</b><p>${p.text}</p><span>${p.time}</span>`;
    feed.appendChild(div);
  });
}

function loadProfile() {
  if (!currentUser) return;
  document.querySelector(".profile-box").innerHTML = `
    <h2>@${currentUser.username}</h2>
    <p>Posts: ${currentUser.posts}</p>
    <p>Friends: ${currentUser.friends}</p>
    <p>Bio: ${currentUser.bio}</p>
  `;
}

function loadMessages() {
  const box = document.querySelector(".message-box");
  if (!box) return;
  box.innerHTML += `
    <div class="message"><b>@${currentUser.username}:</b> I'm online!</div>
    <input type="text" placeholder="Type your message..." onkeypress="sendMessage(event)" />
  `;
}

function sendMessage(e) {
  if (e.key === "Enter") {
    const input = e.target;
    const text = input.value;
    if (!text) return;
    const box = document.querySelector(".message-box");
    const msg = document.createElement("div");
    msg.className = "message";
    msg.innerHTML = `<b>@${currentUser.username}:</b> ${text}`;
    box.insertBefore(msg, input);
    input.value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("feed")) renderFeed();
  if (document.querySelector(".profile-box")) loadProfile();
  if (document.querySelector(".message-box")) loadMessages();
});
