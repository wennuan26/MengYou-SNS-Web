// ============ USER SESSION & INIT ============ //
document.addEventListener('DOMContentLoaded', function () {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  console.log('Logged in as:', JSON.parse(currentUser).email);
  initializeApp();
  setupFloatingMessagesButton();
});

// ============ APP INITIALIZATION ============ //
function initializeApp() {
  // Navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  const pages = document.querySelectorAll('.page');

  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (this.classList.contains('logout-btn')) return;

      const targetPage = this.dataset.page;
      navButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(targetPage).classList.add('active');
    });
  });

  // Categories and Filters
  document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('click', function () {
      document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  setupHeroBanner();
  setupCommunityActions();
  setupMessages();
  setupCreatePostForm();
}

// ============ BUY NOW HANDLER ============ //
function buyNow(name, description, imageUrl, price) {
  const product = { name, description, imageUrl, price };
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "payment.html";
}

// ============ COMMUNITY ACTIONS ============ //
function setupCommunityActions() {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('join-btn')) {
      e.target.textContent = 'Leave';
      e.target.classList.replace('join-btn', 'leave-btn');
      showNotification('Joined community successfully!');
    } else if (e.target.classList.contains('leave-btn')) {
      e.target.textContent = 'Join';
      e.target.classList.replace('leave-btn', 'join-btn');
      showNotification('Left community successfully!');
    } else if (e.target.classList.contains('contact-btn')) {
      openMessages();
      showNotification('Opening messages...');
    } else if (e.target.classList.contains('wishlist-btn')) {
      if (e.target.textContent.includes('❤️')) {
        e.target.innerHTML = '💔 Remove from Wishlist';
        showNotification('Added to wishlist!');
      } else {
        e.target.innerHTML = '❤️ Wishlist';
        showNotification('Removed from wishlist!');
      }
    } else if (e.target.classList.contains('view-posts-btn')) {
      showNotification('Loading community posts...');
    }
  });
}

// ============ HERO BANNER ============ //
function setupHeroBanner() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.hero-nav-btn.prev');
  const nextBtn = document.querySelector('.hero-nav-btn.next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 8000);
  }

  showSlide(currentSlide);
}

// ============ CREATE POST FORM ============ //
function setupCreatePostForm() {
  const createPostForm = document.getElementById('createPostForm');
  if (!createPostForm) return;

  createPostForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;
    const imageInput = document.getElementById('postImage');

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    let imageBase64 = '';
    if (imageInput && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      imageBase64 = await toBase64(file);
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      category,
      image: imageBase64,
      author: JSON.parse(localStorage.getItem('currentUser')).email,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    localStorage.setItem('posts', JSON.stringify([newPost]));
    showNotification("Post created successfully!");
    closeCreatePost();
    createPostForm.reset();
    renderCommunityPosts?.();
  });
}

// ============ MESSAGING PANEL ============ //
function setupMessages() {
  loadMessages();

  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (!message) return;

  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const newMessage = {
    id: Date.now(),
    sender: currentUser.email,
    text: message,
    timestamp: new Date().toISOString()
  };

  messages.unshift(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  input.value = '';
  loadMessages();
  showNotification('Message sent!');
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  const messagesList = document.querySelector('.messages-list');

  if (messages.length === 0) {
    const defaultMessages = [
      {
        id: 1,
        sender: 'AnimeOtaku2025',
        text: 'Hey! Interested in your anime figure collection!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: 'GameMaster2025',
        text: 'Great post about the new gaming setup!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('messages', JSON.stringify(defaultMessages));
    loadMessages();
    return;
  }

  messagesList.innerHTML = messages.map(msg => `
    <div class="message-item">
      <div class="message-avatar"></div>
      <div class="message-content">
        <div class="message-sender">${msg.sender}</div>
        <div class="message-text">${msg.text}</div>
        <div class="message-time">${formatTime(msg.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

function formatTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / (1000 * 60 * 60));
  if (diff < 1) return 'Just now';
  if (diff < 24) return `${diff}h ago`;
  return `${Math.floor(diff / 24)}d ago`;
}

// ============ UI TOGGLES ============ //
function openCreatePost() {
  document.getElementById('createPostModal')?.classList.add('active');
}

function closeCreatePost() {
  document.getElementById('createPostModal')?.classList.remove('active');
}

function openMessages() {
  document.getElementById('messagesPanel')?.classList.add('active');
}

function closeMessages() {
  document.getElementById('messagesPanel')?.classList.remove('active');
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// ============ UTILS ============ //
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showNotification(message) {
  alert(message); // You can replace this with a custom toast/snackbar
}

function setupFloatingMessagesButton() {
  const messagesBtn = document.createElement('button');
  messagesBtn.innerHTML = '💬';
  messagesBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background: #4CAF50;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 998;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

  messagesBtn.addEventListener('click', openMessages);
  messagesBtn.addEventListener('mouseenter', () => messagesBtn.style.transform = 'scale(1.1)');
  messagesBtn.addEventListener('mouseleave', () => messagesBtn.style.transform = 'scale(1)');

  document.body.appendChild(messagesBtn);
}
