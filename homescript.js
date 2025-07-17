const followBtn = document.querySelector(".follow-btn");

followBtn.addEventListener("click", () => {
  followBtn.textContent = "Following";
  followBtn.style.backgroundColor = "#444";
});
function toggleHeart(icon) {
  icon.classList.toggle('liked');
  icon.style.color = icon.classList.contains('liked') ? 'red' : '';
}

function toggleComment(icon) {
  alert("Opening comments... (you can replace this with real logic)");
}

function followUser(button) {
  button.classList.toggle('following');
  button.textContent = button.classList.contains('following') ? 'Following' : 'Follow';
}

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// Optional: Auto slide
setInterval(nextSlide, 5000);
