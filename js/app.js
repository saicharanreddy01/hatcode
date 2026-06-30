// ─── SIDEBAR COLLAPSE ─────────────────────────────────────
const sidebar   = document.getElementById('sidebar');
const appMain   = document.getElementById('app-main');
const toggleBtn = document.getElementById('sidebar-toggle');

toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    appMain.classList.toggle('expanded');
});

// ─── AVATAR DROPDOWN ──────────────────────────────────────
document.querySelectorAll('.topbar-avatar').forEach(avatar => {
    // Wrap avatar in a positioned container if not already
    if (!avatar.parentElement.classList.contains('topbar-avatar-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'topbar-avatar-wrap';
        avatar.parentNode.insertBefore(wrap, avatar);
        wrap.appendChild(avatar);
    }

    const wrap = avatar.parentElement;

    const dropdown = document.createElement('div');
    dropdown.className = 'avatar-dropdown';
    dropdown.innerHTML = `
    <div class="avatar-dropdown-header">
      <div class="sidebar-avatar" style="width:36px;height:36px;font-size:12px">SC</div>
      <div>
        <div class="avatar-dropdown-name">Sai Charan</div>
        <div class="avatar-dropdown-email">sai@hatcode.io</div>
      </div>
    </div>
    <div class="avatar-dropdown-section">
      <a href="settings.html" class="avatar-dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profile
      </a>
      <a href="settings.html#notifications" class="avatar-dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notifications
      </a>
      <a href="settings.html#api" class="avatar-dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><circle cx="12" cy="16" r="0.5"/></svg>
        API keys
      </a>
    </div>
    <div class="avatar-dropdown-section">
      <a href="settings.html" class="avatar-dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        All settings
      </a>
    </div>
    <div class="avatar-dropdown-section">
      <button class="avatar-dropdown-item danger" id="dropdown-signout">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign out
      </button>
    </div>
  `;
    wrap.appendChild(dropdown);

    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.avatar-dropdown.open').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
    });
});

// ─── SETTINGS DEEP LINK (jump to section via hash) ────────
function activateSettingsSection() {
    if (!window.location.pathname.includes('settings.html')) return;
    const hash = window.location.hash.replace('#', '') || 'profile';
    document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${hash}`)?.classList.add('active');
}
activateSettingsSection();
window.addEventListener('hashchange', activateSettingsSection);

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.avatar-dropdown.open').forEach(d => d.classList.remove('open'));
});

// Sign out handler
document.addEventListener('click', (e) => {
    if (e.target.closest('#dropdown-signout')) {
        window.location.href = '../login.html';
    }
});