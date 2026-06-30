document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── TOGGLE SWITCHES ──────────────────────────────────────
document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('on'));
});

// Schedule toggle shows/hides options
const scheduleToggle = document.getElementById('schedule-toggle');
const scheduleOptions = document.getElementById('schedule-options');
scheduleToggle?.addEventListener('click', () => {
    scheduleToggle.classList.toggle('on');
    scheduleOptions.style.display = scheduleToggle.classList.contains('on') ? 'block' : 'none';
});
scheduleToggle?.classList.add('on');

// ─── API KEYS ─────────────────────────────────────────────
let apiKeys = [
    { name: 'Production key', last4: '8f2a', created: 'Jun 10, 2026' },
    { name: 'CI/CD pipeline', last4: '3d91', created: 'May 22, 2026' },
];

function renderApiKeys() {
    const el = document.getElementById('api-key-list');
    if (!el) return;
    el.innerHTML = apiKeys.map((k, i) => `
    <div class="api-key-row">
      <div class="api-key-info">
        <span class="api-key-name">${k.name}</span>
        <span class="api-key-meta">hc_••••••••${k.last4} · Created ${k.created}</span>
      </div>
      <button class="btn-revoke-key" onclick="revokeKey(${i})">Revoke</button>
    </div>
  `).join('');
}

window.revokeKey = function(i) {
    apiKeys.splice(i, 1);
    renderApiKeys();
};

document.getElementById('btn-generate-key')?.addEventListener('click', () => {
    const last4 = Math.random().toString(16).slice(2, 6);
    apiKeys.unshift({ name: 'New API key', last4, created: 'Just now' });
    renderApiKeys();
});

renderApiKeys();

// ─── SAVE BUTTON FEEDBACK ─────────────────────────────────
document.querySelectorAll('.btn-save-settings').forEach(btn => {
    btn.addEventListener('click', () => {
        const original = btn.textContent;
        btn.textContent = 'Saved ✓';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1500);
    });
});

// ─── DANGER BUTTONS ───────────────────────────────────────
document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Are you sure? This action cannot be undone.')) {
            btn.textContent = 'Done';
            btn.disabled = true;
        }
    });
});