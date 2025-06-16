function createPost() {
  const feed = document.getElementById("feed");
  const textarea = document.querySelector(".post-creator textarea");
  const content = textarea.value.trim();

  if (content === "") {
    alert("Post cannot be empty!");
    return;
  }

  const newPost = document.createElement("article");
  newPost.classList.add("post");
  newPost.innerHTML = `
    <h3>@guest</h3>
    <p>${content}</p>
    <span>${new Date().toISOString().slice(0, 10)}</span>
  `;

  feed.prepend(newPost);
  textarea.value = "";
}