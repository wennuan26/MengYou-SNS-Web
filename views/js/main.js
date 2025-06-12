document.addEventListener("DOMContentLoaded", () => {
  // Theme setup
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Fetch posts if postPreview exists
  const postPreview = document.getElementById("postPreview");
  if (postPreview) {
    fetch("php/fetch-posts.php")
      .then(response => response.json())
      .then(data => {
        data.forEach(post => {
          const postElement = document.createElement("div");
          postElement.className = "post";
          postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
          postPreview.appendChild(postElement);
        });
      })
      .catch(() => {
        postPreview.innerHTML = "<p>Failed to load posts.</p>";
      });
  }
});

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}
