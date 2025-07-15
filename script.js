const correctUsername = "mengyou";
const correctPassword = "123456";
let carouselStarted = false;

function login() {
  const user = document.getElementById("username").value.trim().toLowerCase();
  const pass = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (user === correctUsername && pass === correctPassword) {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");
    if (!carouselStarted) {
      startCarousel();
      carouselStarted = true;
    }
  } else {
    errorMsg.textContent = "Invalid username or password!";
    errorMsg.style.color = "red";
  }
}

function logout() {
  document.getElementById("main-page").classList.add("hidden");
  document.getElementById("login-page").classList.remove("hidden");
}

function showPage(page) {
  const sections = ["feed", "profile", "community", "market"];
  sections.forEach(p => {
    document.getElementById(p).classList.add("hidden");
  });
  document.getElementById(page).classList.remove("hidden");
}

function toggleLike(button) {
  button.classList.toggle("liked");
  button.textContent = button.classList.contains("liked") ? "❤ Liked" : "♡ Like";
}

let carouselIndex = 0;
let carouselImages;

function startCarousel() {
  carouselImages = document.querySelectorAll(".carousel-img");
  if (carouselImages.length > 0) {
    setInterval(() => {
      carouselImages.forEach(img => img.classList.add("hidden"));
      carouselIndex = (carouselIndex + 1) % carouselImages.length;
      carouselImages[carouselIndex].classList.remove("hidden");
    }, 3000);
  }
}
