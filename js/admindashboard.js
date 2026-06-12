// Admin Dashboard JavaScript

let messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const loadingState = document.getElementById('loadingState');
const noMessages = document.getElementById('noMessages');
const messageTable = document.getElementById('messageTable');
const messageRows = document.getElementById('messageRows');

const totalMessagesEl = document.getElementById('totalMessages');
const readMessagesEl = document.getElementById('readMessages');
const newMessagesEl = document.getElementById('newMessages');
const starredMessagesEl = document.getElementById('starredMessages');

const adminFilter = document.getElementById('adminFilter');
const adminSearch = document.getElementById('adminSearch');

const markAllReadBtn = document.getElementById('markAllReadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// ===== Auth + Authorization (front-end demo only) =====
const ADMIN_SESSION_KEY = 'portfolioAdminSession';
const ADMIN_ROLE = 'admin';

function getDefaultAdminCredentials() {
    return {
        username: 'admin',
        password: 'Gloria@745123'
    };
}

function getAdminCredentials() {
    const username = localStorage.getItem('portfolioAdminUsername');
    const password = localStorage.getItem('portfolioAdminPassword');

    const defaults = getDefaultAdminCredentials();
    return {
        username: username || defaults.username,
        password: password || defaults.password
    };
}

function isAuthorized() {
    try {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_ROLE;
    } catch {
        return false;
    }
}

function requireAuthorization() {
    // If already authorized, allow.
    if (isAuthorized()) return true;

    // If no login UI exists, block rendering.
    const loginCard = document.getElementById('adminLoginCard');
    if (!loginCard) {
        showNotification('Not authorized. Login required.', 'error');
        return false;
    }

    // Show login card
    loginCard.style.display = 'block';
    return false;
}

function logoutAdmin() {
    try {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    location.reload();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // If login form exists, wire it.
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }

    // Show/hide login/logout based on auth state
    const applyAuthUI = () => {
        const loginCard = document.getElementById('adminLoginCard');
        const authorizedNow = isAuthorized();
        if (loginCard) loginCard.style.display = authorizedNow ? 'none' : 'block';
        if (logoutBtn) logoutBtn.style.display = authorizedNow ? 'inline-flex' : 'none';
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const username = String(formData.get('username') || '').trim();
            const password = String(formData.get('password') || '');

            const creds = getAdminCredentials();
            if (username === creds.username && password === creds.password) {
                try {
                    sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_ROLE);
                } catch {}

                applyAuthUI();

                // Continue with dashboard rendering
                loadAndRender();

                // Re-bind controls (since they are created after render)
                if (adminFilter) adminFilter.addEventListener('change', () => render());
                if (adminSearch) {
                    let t;
                    adminSearch.addEventListener('input', () => {
                        clearTimeout(t);
                        t = setTimeout(() => render(), 150);
                    });
                }

                if (markAllReadBtn) {
                    markAllReadBtn.addEventListener('click', () => {
                        messages = messages.map(m => ({ ...m, read: true }));
                        saveMessages();
                        render();
                        showNotification('All messages marked as read', 'success');
                    });
                }

                if (clearAllBtn) {
                    clearAllBtn.addEventListener('click', () => {
                        const ok = confirm('Clear ALL messages from localStorage? This cannot be undone.');
                        if (!ok) return;
                        messages = [];
                        saveMessages();
                        render();
                        showNotification('All messages cleared', 'success');
                    });
                }

                showNotification('Welcome admin!', 'success');
            } else {
                showNotification('Invalid username or password.', 'error');
            }
        });
    }

    // If not authorized yet, show login and stop.
    const authorized = requireAuthorization();
    applyAuthUI();
    if (!authorized) return;

    // Render dashboard immediately if authorized.
    loadAndRender();

    if (adminFilter) {
        adminFilter.addEventListener('change', () => render());
    }
    if (adminSearch) {
        let t;
        adminSearch.addEventListener('input', () => {
            clearTimeout(t);
            t = setTimeout(() => render(), 150);
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            messages = messages.map(m => ({ ...m, read: true }));
            saveMessages();
            render();
            showNotification('All messages marked as read', 'success');
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            const ok = confirm('Clear ALL messages from localStorage? This cannot be undone.');
            if (!ok) return;
            messages = [];
            saveMessages();
            render();
            showNotification('All messages cleared', 'success');
        });
    }
});


function saveMessages() {
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
}

function loadAndRender() {
    // Brief loading state
    if (loadingState) loadingState.style.display = 'flex';
    if (messageTable) messageTable.style.display = 'none';

    setTimeout(() => {
        render();
    }, 400);
}

function updateStats() {
    const total = messages.length;
    const read = messages.filter(m => m.read).length;
    const unread = total - read;
    const starred = messages.filter(m => m.starred).length;

    if (totalMessagesEl) totalMessagesEl.textContent = total;
    if (readMessagesEl) readMessagesEl.textContent = read;
    if (newMessagesEl) newMessagesEl.textContent = unread;
    if (starredMessagesEl) starredMessagesEl.textContent = starred;
}

function getFilteredMessages() {
    let filtered = [...messages];

    const filterVal = adminFilter ? adminFilter.value : 'all';
    if (filterVal === 'unread') filtered = filtered.filter(m => !m.read);
    if (filterVal === 'read') filtered = filtered.filter(m => m.read);
    if (filterVal === 'starred') filtered = filtered.filter(m => m.starred);

    const q = (adminSearch ? adminSearch.value : '').trim().toLowerCase();
    if (q) {
        filtered = filtered.filter(m => {
            const hay = `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase();
            return hay.includes(q);
        });
    }

    // newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
}

function render() {
    updateStats();

    const filtered = getFilteredMessages();

    if (!messagesContainer) return;

    if (messages.length === 0) {
        if (loadingState) loadingState.style.display = 'none';
        if (noMessages) noMessages.style.display = 'block';
        if (messageTable) messageTable.style.display = 'none';
        if (messageRows) messageRows.innerHTML = '';
        return;
    }

    if (loadingState) loadingState.style.display = 'none';
    if (noMessages) noMessages.style.display = 'none';
    if (messageTable) messageTable.style.display = 'block';

    if (filtered.length === 0) {
        if (messageRows) {
            messageRows.innerHTML = `
                <div class="message-table-empty">No messages match your filter/search.</div>
            `;
        }
        return;
    }

    if (messageRows) {
        messageRows.innerHTML = filtered.map(msg => {
            const dateStr = formatDateTime(msg.date);
            const statusLabel = msg.read ? 'Read' : 'Unread';
            const statusClass = msg.read ? 'status-read' : 'status-unread';

            return `
                <div class="message-table-row" data-id="${msg.id}">
                    <div class="cell">
                        <div class="from-name">${escapeHtml(msg.name)}</div>
                        <div class="from-email">${escapeHtml(msg.email)}</div>
                    </div>
                    <div class="cell">
                        <div class="subject">${escapeHtml(msg.subject)}</div>
                        ${msg.starred ? `<span class="star-pill" title="Starred"><i class="fas fa-star"></i> Starred</span>` : ''}
                    </div>
                    <div class="cell">
                        <span class="date">${escapeHtml(dateStr)}</span>
                    </div>
                    <div class="cell">
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="cell actions">
                        <button class="btn btn-secondary btn-small" type="button" data-action="toggleRead" data-id="${msg.id}">
                            <i class="fas fa-eye"></i> ${msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button class="btn btn-secondary btn-small" type="button" data-action="toggleStar" data-id="${msg.id}">
                            <i class="fas fa-star"></i> ${msg.starred ? 'Unstar' : 'Star'}
                        </button>
                        <button class="btn btn-danger btn-small" type="button" data-action="delete" data-id="${msg.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Table actions (event delegation)
if (messageRows) {
    messageRows.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        if (!action || Number.isNaN(id)) return;

        if (action === 'toggleRead') {
            messages = messages.map(m => m.id === id ? { ...m, read: !m.read } : m);
            saveMessages();
            render();
            return;
        }

        if (action === 'toggleStar') {
            messages = messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m);
            saveMessages();
            render();
            return;
        }

        if (action === 'delete') {
            const ok = confirm('Delete this message?');
            if (!ok) return;
            messages = messages.filter(m => m.id !== id);
            saveMessages();
            render();
            showNotification('Message deleted', 'success');
            return;
        }
    });
}

function formatDateTime(dateString) {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return String(dateString || '');

    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '<')
        .replaceAll('>', '>')
        .replaceAll('"', '"')
        .replaceAll("'", '&#039;');
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `admin-notification notification notification-${type}`;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))';
    } else {
        notification.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95))';
    }

    notification.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="notification-close" aria-label="Close" style="background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
    `;

    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // no modal here; keep for future parity
    }
});

