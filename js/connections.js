document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── CONNECTIONS DATA ─────────────────────────────────────
const connections = [
    { name: 'Production PostgreSQL', url: 'postgresql://prod-db:5432/orders', status: 'green', lastScan: '2 hours ago' },
    { name: 'Staging MySQL',         url: 'mysql://staging-db:3306/users',    status: 'amber', lastScan: '3 days ago' },
];

function renderConnections() {
    const grid = document.getElementById('connections-grid');
    grid.innerHTML = connections.map(c => `
    <div class="conn-card">
      <div class="conn-card-top">
        <span class="conn-status-dot ${c.status}"></span>
        <span class="conn-card-name">${c.name}</span>
      </div>
      <div class="conn-card-url">${c.url}</div>
      <div class="conn-card-meta">Last scanned: ${c.lastScan}</div>
      <div class="conn-card-actions">
        <button class="btn-conn-action primary" onclick="location.href='scan.html'">Scan now</button>
        <button class="btn-conn-action">Edit</button>
        <button class="btn-conn-action danger">Delete</button>
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

// ─── MODAL ────────────────────────────────────────────────
const modal = document.getElementById('add-conn-modal');

function openModal() {
    modal.classList.add('open');
    goToStep(1);
}
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

// Test connection
document.getElementById('btn-test-conn')?.addEventListener('click', function() {
    const area = document.getElementById('test-conn-area');
    area.innerHTML = `<div class="test-result"><div class="spinner" style="width:32px;height:32px;border-width:3px"></div><p style="font-size:13px;color:var(--text-2)">Testing connection…</p></div>`;

    setTimeout(() => {
        area.innerHTML = `
      <div class="test-result">
        <div class="test-result-icon success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="test-result-title">Connected successfully</div>
        <div class="test-result-sub">3 tables found</div>
      </div>
    `;
        document.getElementById('btn-save-conn').classList.remove('hidden');
    }, 1500);
});

// Save connection
document.getElementById('btn-save-conn')?.addEventListener('click', () => {
    connections.push({
        name: 'New Connection',
        url: 'postgresql://new-db:5432/data',
        status: 'green',
        lastScan: 'Never',
    });
    renderConnections();
    closeModal();
});

renderConnections();