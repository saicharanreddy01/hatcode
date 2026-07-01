// ─── SIDEBAR ──────────────────────────────────────────────
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

const API = 'http://localhost:8080/api';

// ─── AUTH HELPER ──────────────────────────────────────────
function getToken() {
    const token = localStorage.getItem('hc_token');
    if (!token) { window.location.href = '../login.html'; return null; }
    return token;
}

function authHeaders() {
    return { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

// ─── FETCH CONNECTIONS ────────────────────────────────────
async function loadConnections() {
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(`${API}/connections`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) { window.location.href = '../login.html'; return; }
        const data = await res.json();
        renderConnections(data);
    } catch (err) {
        console.error('Failed to load connections:', err);
        renderConnections([]);
    }
}

// ─── RENDER CONNECTIONS ───────────────────────────────────
function statusDot(status) {
    if (status === 'CONNECTED')    return 'green';
    if (status === 'ERROR')        return 'red';
    if (status === 'DISCONNECTED') return 'amber';
    return 'amber'; // UNKNOWN
}

function formatDate(dateStr) {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderConnections(connections) {
    const grid = document.getElementById('connections-grid');
    grid.innerHTML = connections.map(c => `
    <div class="conn-card" id="conn-${c.id}">
      <div class="conn-card-top">
        <span class="conn-status-dot ${statusDot(c.status)}"></span>
        <span class="conn-card-name">${c.name}</span>
      </div>
      <div class="conn-card-url">${c.dbType} · ${c.host}:${c.port}/${c.databaseName}</div>
      <div class="conn-card-meta">Last scanned: ${formatDate(c.lastScannedAt)}</div>
      <div class="conn-card-actions">
        <button class="btn-conn-action primary" onclick="scanConnection(${c.id})">Scan now</button>
        <button class="btn-conn-action" onclick="testConnection(${c.id}, this)">Test</button>
        <button class="btn-conn-action danger" onclick="deleteConnection(${c.id})">Delete</button>
      </div>
    </div>
  `).join('') + `
    <div class="add-conn-card" id="add-conn-card">
      <div class="add-conn-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      <div class="add-conn-title">Add a new connection</div>
      <div class="add-conn-sub">PostgreSQL · MySQL · SQLite · more</div>
    </div>
  `;
    document.getElementById('add-conn-card')?.addEventListener('click', openModal);
}

// ─── TEST CONNECTION ──────────────────────────────────────
window.testConnection = async function(id, btn) {
    const original = btn.textContent;
    btn.textContent = 'Testing…';
    btn.disabled = true;

    try {
        const res = await fetch(`${API}/connections/${id}/test`, {
            method: 'POST',
            headers: authHeaders()
        });
        const data = await res.json();
        btn.textContent = res.ok ? 'Connected ✓' : 'Failed ✗';
        btn.style.color = res.ok ? 'var(--success)' : 'var(--danger)';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.color = '';
            btn.disabled = false;
            loadConnections(); // refresh to show updated status
        }, 2000);
    } catch (err) {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2000);
    }
};

// ─── DELETE CONNECTION ────────────────────────────────────
window.deleteConnection = async function(id) {
    if (!confirm('Delete this connection? This cannot be undone.')) return;

    try {
        const res = await fetch(`${API}/connections/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (res.ok) loadConnections();
    } catch (err) {
        console.error('Delete failed:', err);
    }
};

// ─── SCAN NOW ─────────────────────────────────────────────
window.scanConnection = function(id) {
    // Will connect to scan engine in Phase 3
    window.location.href = `scan.html`;
};

// ─── MODAL ────────────────────────────────────────────────
const modal = document.getElementById('add-conn-modal');

function openModal() { modal.classList.add('open'); goToStep(1); }
function closeModal() { modal.classList.remove('open'); }

document.getElementById('btn-add-connection')?.addEventListener('click', openModal);
document.getElementById('modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function goToStep(n) {
    [1,2,3].forEach(i => {
        document.getElementById(`step-${i}`).classList.toggle('active', i === n);
        const ind = document.getElementById(`step-${i}-ind`);
        ind.classList.toggle('active', i === n);
        ind.classList.toggle('done', i < n);
    });
}

document.getElementById('step1-next')?.addEventListener('click', () => goToStep(2));
document.getElementById('step2-back')?.addEventListener('click', () => goToStep(1));
document.getElementById('step2-next')?.addEventListener('click', () => goToStep(3));
document.getElementById('step3-back')?.addEventListener('click', () => goToStep(2));

// DB type selection
document.querySelectorAll('.db-type-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.db-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// SSL toggle
document.getElementById('ssl-toggle')?.addEventListener('click', function() {
    this.classList.toggle('on');
});

// ─── TEST IN MODAL ────────────────────────────────────────
let savedFormData = null;

document.getElementById('step2-next')?.addEventListener('click', () => {
    const dbType = document.querySelector('.db-type-card.selected')?.dataset?.db?.toUpperCase() || 'MYSQL';

    savedFormData = {
        name:         document.querySelector('#step-2 input[placeholder="e.g. Staging Database"]')?.value?.trim(),
        host:         document.querySelector('#step-2 input[placeholder="db.example.com"]')?.value?.trim(),
        port:         parseInt(document.querySelector('#step-2 input[placeholder="5432"]')?.value) || 3306,
        databaseName: document.querySelector('#step-2 input[placeholder="my_database"]')?.value?.trim(),
        username:     document.querySelector('#step-2 input[placeholder="db_user"]')?.value?.trim(),
        password:     document.querySelector('#step-2 input[type="password"]')?.value,
        schema:       document.querySelector('#step-2 input[placeholder="public"]')?.value?.trim() || null,
        sslEnabled:   document.getElementById('ssl-toggle')?.classList.contains('on'),
        dbType:       dbType,
    };

    console.log('Saving connection:', savedFormData); // debug — remove later
    goToStep(3);
});

document.getElementById('btn-test-conn')?.addEventListener('click', async function() {
    const area = document.getElementById('test-conn-area');
    area.innerHTML = `<div class="test-result"><div class="spinner" style="width:32px;height:32px;border-width:3px"></div><p style="font-size:13px;color:var(--text-2)">Testing connection…</p></div>`;

    try {
        // First save the connection to get an ID, then test it
        const res = await fetch(`${API}/connections`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(savedFormData)
        });
        const conn = await res.json();

        if (!res.ok) {
            area.innerHTML = `<div class="test-result"><div class="test-result-icon error"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="test-result-title">Failed to save</div><div class="test-result-sub">${conn.error || 'Unknown error'}</div></div>`;
            return;
        }

        // Now test it
        const testRes = await fetch(`${API}/connections/${conn.id}/test`, {
            method: 'POST',
            headers: authHeaders()
        });
        const testData = await testRes.json();

        if (testRes.ok) {
            area.innerHTML = `<div class="test-result"><div class="test-result-icon success"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div class="test-result-title">Connected successfully</div><div class="test-result-sub">Connection saved</div></div>`;
            document.getElementById('btn-save-conn').classList.remove('hidden');
            document.getElementById('btn-save-conn').dataset.id = conn.id;
        } else {
            area.innerHTML = `<div class="test-result"><div class="test-result-icon error"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="test-result-title">Connection failed</div><div class="test-result-sub">${testData.error}</div></div>`;
        }
    } catch (err) {
        area.innerHTML = `<div class="test-result"><div class="test-result-icon error"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="test-result-title">Error</div><div class="test-result-sub">Could not reach backend</div></div>`;
    }
});

// ─── SAVE CONNECTION ──────────────────────────────────────
document.getElementById('btn-save-conn')?.addEventListener('click', () => {
    closeModal();
    loadConnections();
});

// ─── INIT ─────────────────────────────────────────────────
loadConnections();