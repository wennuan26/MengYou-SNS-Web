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
