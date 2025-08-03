// Wait for DOM content to fully load before initializing core features
document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();       // Fade-in effect & section animation
    initializeScrollEffects();   // Header shadow on scroll
    initializeShareButtons();    // Social & email sharing handlers
    lazyLoadImages();            // Optimize performance with lazy load
    console.log('Dream Friends About page loaded successfully');
});

// Fade in the page and animate elements as they appear in view
function initializeAnimations() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    });

    const targets = document.querySelectorAll('.article-card, .story-content, .story-visual');
    targets.forEach((el) => observer.observe(el));
}

// Add a shadow to the header when user scrolls down
function initializeScrollEffects() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 100
            ? '0 2px 20px rgba(0, 0, 0, 0.1)'
            : 'none';
    });
}

// Enable share buttons: Facebook, Twitter, LinkedIn, Email, Copy
function initializeShareButtons() {
    window.shareArticle = function (platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Inspiring Creativity That Brings People Together - 梦友录 Dream Friends');
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
            showNotification(`Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        }
    };

    window.copyArticleLink = function () {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => showNotification('Link copied to clipboard!'))
            .catch(() => fallbackCopyTextToClipboard(url));
    };

    window.shareViaEmail = function () {
        const subject = encodeURIComponent('Check out this article from 梦友录 Dream Friends');
        const body = encodeURIComponent(`I thought you might find this interesting:\n\nInspiring Creativity That Brings People Together\n\n${window.location.href}\n\nBest regards!`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        showNotification('Opening email client...');
    };
}

// Simple toast notification system
function showNotification(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const note = document.createElement('div');
    note.className = 'toast-notification';
    note.textContent = message;

    note.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #262626;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 2000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(note);
    setTimeout(() => { note.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        note.style.transform = 'translateX(100%)';
        setTimeout(() => note.remove(), 300);
    }, 4000);
}

// Clipboard fallback for older browsers
function fallbackCopyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        showNotification(successful ? 'Link copied to clipboard!' : 'Failed to copy link');
    } catch (err) {
        console.error('Fallback: copy failed', err);
        showNotification('Failed to copy link');
    }

    document.body.removeChild(textarea);
}

// Optimize image loading performance with IntersectionObserver
function lazyLoadImages() {
    const images = document.querySelectorAll('img');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                img.onload = () => { img.style.opacity = '1'; };
                obs.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

// Redirect user to login page with delay and feedback
function redirectToLogin() {
    showNotification('Redirecting to login page...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}
