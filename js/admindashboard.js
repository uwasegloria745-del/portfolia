// Admin Dashboard JavaScript

const ADMIN_SESSION_KEY = 'portfolioAdminSession';
const ADMIN_TOKEN_KEY = 'portfolioAdminToken';
let messages = [];

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

function getAdminToken() {
    try {
        return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
    } catch {
        return '';
    }
}

function isAuthorized() {
    try {
        return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
    } catch {
        return false;
    }
}

async function fetchAdmin(url, options = {}) {
    const token = getAdminToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'Request failed.');
    }

    return data;
}

function requireAuthorization() {
    const loginCard = document.getElementById('adminLoginCard');
    if (!isAuthorized()) {
        if (loginCard) loginCard.style.display = 'block';
        return false;
    }

    if (loginCard) loginCard.style.display = 'none';
    return true;
}

function logoutAdmin() {
    try {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    location.reload();
}

async function loadMessages() {
    if (!isAuthorized()) {
        requireAuthorization();
        return;
    }

    if (loadingState) loadingState.style.display = 'flex';
    if (messageTable) messageTable.style.display = 'none';

    try {
        const conversations = await fetchAdmin('http://localhost:3001/api/conversations');
        messages = conversations.map((conversation) => ({
            id: conversation.id,
            name: conversation.visitorName,
            email: conversation.visitorEmail,
            subject: conversation.subject,
            message: conversation.latestMessage,
            date: conversation.updatedAt,
            read: conversation.unreadCount === 0,
            starred: false,
            conversationId: conversation.id,
            unreadCount: conversation.unreadCount,
            latestMessage: conversation.latestMessage,
        }));
        render();
    } catch (error) {
        console.error('Failed to load admin messages:', error);
        showNotification(error.message || 'Unable to load messages.', 'error');
    } finally {
        if (loadingState) loadingState.style.display = 'none';
    }
}

function updateStats() {
    const total = messages.length;
    const read = messages.filter((m) => m.read).length;
    const unread = total - read;
    const starred = messages.filter((m) => m.starred).length;

    if (totalMessagesEl) totalMessagesEl.textContent = total;
    if (readMessagesEl) readMessagesEl.textContent = read;
    if (newMessagesEl) newMessagesEl.textContent = unread;
    if (starredMessagesEl) starredMessagesEl.textContent = starred;
}

function getFilteredMessages() {
    let filtered = [...messages];

    const filterVal = adminFilter ? adminFilter.value : 'all';
    if (filterVal === 'unread') filtered = filtered.filter((m) => !m.read);
    if (filterVal === 'read') filtered = filtered.filter((m) => m.read);
    if (filterVal === 'starred') filtered = filtered.filter((m) => m.starred);

    const q = (adminSearch ? adminSearch.value : '').trim().toLowerCase();
    if (q) {
        filtered = filtered.filter((m) => {
            const hay = `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase();
            return hay.includes(q);
        });
    }

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
            messageRows.innerHTML = '<div class="message-table-empty">No messages match your filter/search.</div>';
        }
        return;
    }

    if (messageRows) {
        messageRows.innerHTML = filtered.map((msg) => {
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
                        ${msg.starred ? '<span class="star-pill" title="Starred"><i class="fas fa-star"></i> Starred</span>' : ''}
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
                        <button class="btn btn-danger btn-small" type="button" data-action="delete" data-id="${msg.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

if (messageRows) {
    messageRows.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!action || !id) return;

        const item = messages.find((message) => message.id === id);
        if (!item) return;

        if (action === 'toggleRead') {
            try {
                await fetchAdmin(`http://localhost:3001/api/conversations/${id}/read`, {
                    method: 'PATCH',
                    body: JSON.stringify({ read: !item.read }),
                });
                item.read = !item.read;
                render();
            } catch (error) {
                showNotification(error.message || 'Unable to update message status.', 'error');
            }
            return;
        }

        if (action === 'delete') {
            const ok = confirm('Delete this conversation?');
            if (!ok) return;
            try {
                await fetchAdmin(`http://localhost:3001/api/messages/${id}`, { method: 'DELETE' });
                messages = messages.filter((message) => message.id !== id);
                render();
                showNotification('Conversation deleted.', 'success');
            } catch (error) {
                showNotification(error.message || 'Unable to delete conversation.', 'error');
            }
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
        minute: '2-digit',
    });
}

function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function showNotification(message, type = 'info') {
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

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const loginCard = document.getElementById('adminLoginCard');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetchAdmin('http://localhost:3001/api/admin/logout', { method: 'POST' });
            } catch {
                // Continue logout even if the server rejects.
            }
            logoutAdmin();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = String(formData.get('username') || '').trim();
            const password = String(formData.get('password') || '').trim();

            if (!username || !password) {
                showNotification('Please enter both username and password.', 'error');
                return;
            }

            try {
                const result = await fetch('http://localhost:3001/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include',
                });

                const data = await result.json().catch(() => ({}));
                if (!result.ok) {
                    throw new Error(data.error || 'Invalid username or password.');
                }

                sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
                sessionStorage.setItem(ADMIN_SESSION_KEY, 'admin');
                if (loginCard) loginCard.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'inline-flex';
                showNotification('Welcome admin!', 'success');
                await loadMessages();
            } catch (error) {
                console.error('Admin login failed:', error);
                showNotification(error.message || 'Unable to log in.', 'error');
            }
        });
    }

    if (adminFilter) {
        adminFilter.addEventListener('change', render);
    }

    if (adminSearch) {
        let timer;
        adminSearch.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(render, 150);
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async () => {
            if (!messages.length) return;
            try {
                await Promise.all(messages.map((message) => fetchAdmin(`http://localhost:3001/api/conversations/${message.id}/read`, {
                    method: 'PATCH',
                    body: JSON.stringify({ read: true }),
                })));
                messages = messages.map((message) => ({ ...message, read: true }));
                render();
                showNotification('All messages marked as read.', 'success');
            } catch (error) {
                showNotification(error.message || 'Unable to mark messages as read.', 'error');
            }
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', async () => {
            const ok = confirm('Clear all messages? This cannot be undone.');
            if (!ok || !messages.length) return;
            try {
                await Promise.all(messages.map((message) => fetchAdmin(`http://localhost:3001/api/messages/${message.id}`, { method: 'DELETE' })));
                messages = [];
                render();
                showNotification('All messages cleared.', 'success');
            } catch (error) {
                showNotification(error.message || 'Unable to clear messages.', 'error');
            }
        });
    }

    if (requireAuthorization()) {
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        loadMessages();
    }
});

