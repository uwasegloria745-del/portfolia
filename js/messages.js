// Messages Page JavaScript

// Load messages from localStorage (or use sample data if none exist)
let messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        subject: "Project Inquiry - E-commerce Website",
        message: "Hi Gloria,\n\nI'm interested in building an e-commerce website for my new business. Could you please provide a quote for a full-featured online store with payment integration?\n\nLooking forward to hearing from you.\n\nBest regards,\nJohn",
        date: "2026-03-10T14:30:00",
        read: false,
        starred: false
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
        subject: "Frontend Development Opportunity",
        message: "Hello Gloria,\n\nWe are looking for an experienced frontend developer for a long-term project. Your portfolio looks impressive!\n\nWould you be available for a quick call to discuss the requirements?\n\nBest,\nSarah Johnson\nHR Manager",
        date: "2026-03-08T09:15:00",
        read: true,
        starred: true
    },
    {
        id: 3,
        name: "Michael Chen",
        email: "m.chen@startup.io",
        subject: "Collaboration Proposal",
        message: "Hi Gloria,\n\nI'm reaching out regarding a potential collaboration on a new SaaS product. We're building a project management tool and would love to have you on board as our lead developer.\n\nPlease let me know if you're interested.\n\nMichael\nFounder, StartupHub",
        date: "2026-03-05T16:45:00",
        read: false,
        starred: false
    }
];

// Save messages to localStorage whenever they change
function saveMessages() {
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
}

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const noMessages = document.getElementById('noMessages');
const totalMessagesEl = document.getElementById('totalMessages');
const readMessagesEl = document.getElementById('readMessages');
const newMessagesEl = document.getElementById('newMessages');
const modal = document.getElementById('messageModal');
const modalClose = document.querySelector('.modal-close');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    updateStats();
});

// Load and display messages
function loadMessages() {
    // Show loading state briefly
    setTimeout(() => {
        if (messages.length === 0) {
            messagesContainer.innerHTML = '';
            noMessages.style.display = 'block';
            return;
        }

        noMessages.style.display = 'none';
        renderMessages();
    }, 500);
}

// Render messages to the container
function renderMessages() {
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message-card ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-card-header">
                <div class="message-sender">
                    <div class="sender-avatar">${getInitials(msg.name)}</div>
                    <div class="sender-info">
                        <h4>${msg.name}</h4>
                        <span>${msg.email}</span>
                    </div>
                </div>
                <div class="message-date">
                    <i class="far fa-clock"></i>
                    ${formatDate(msg.date)}
                </div>
            </div>
            <h3 class="message-subject">${msg.subject}</h3>
            <p class="message-preview">${msg.message}</p>
            <div class="message-actions">
                <button class="btn-read" onclick="viewMessage(${msg.id})">
                    <i class="far fa-eye"></i> ${msg.read ? 'View' : 'Mark as Read'}
                </button>
                <button class="btn-delete" onclick="deleteMessage(${msg.id})">
                    <i class="far fa-trash-alt"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Get initials from name
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Update statistics
function updateStats() {
    const total = messages.length;
    const read = messages.filter(m => m.read).length;
    const unread = total - read;
    
    totalMessagesEl.textContent = total;
    readMessagesEl.textContent = read;
    newMessagesEl.textContent = unread;
}

// View message details
function viewMessage(id) {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    // Mark as read
    message.read = true;
    saveMessages();
    updateStats();
    renderMessages();

    // Populate modal
    document.getElementById('modalSubject').textContent = message.subject;
    document.getElementById('modalName').textContent = message.name;
    document.getElementById('modalEmail').textContent = message.email;
    document.getElementById('modalDate').textContent = new Date(message.date).toLocaleString();
    document.getElementById('modalBody').textContent = message.message;

    // Store current message ID for actions
    modal.dataset.messageId = id;

    // Show modal
    modal.classList.add('active');
}

// Delete message
function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        messages = messages.filter(m => m.id !== id);
        saveMessages();
        updateStats();
        renderMessages();
        
        // Show notification
        showNotification('Message deleted successfully', 'success');
    }
}

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Reply button
document.getElementById('replyBtn').addEventListener('click', () => {
    const messageId = parseInt(modal.dataset.messageId);
    const message = messages.find(m => m.id === messageId);
    
    if (message) {
        window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
    }
});

// Delete from modal
document.getElementById('deleteBtn').addEventListener('click', () => {
    const messageId = parseInt(modal.dataset.messageId);
    deleteMessage(messageId);
    modal.classList.remove('active');
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});