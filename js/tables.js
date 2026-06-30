// ─── SIDEBAR ──────────────────────────────────────────────
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── SEARCH ───────────────────────────────────────────────
document.getElementById('table-search')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.table-row').forEach(row => {
        const name = row.dataset.table.toLowerCase();
        row.style.display = name.includes(q) ? '' : 'none';
    });
});

// ─── SORT ─────────────────────────────────────────────────
const tableData = [
    { name: 'customers', columns: 6,  rows: 100000, health: 85, violations: 3,  lastScan: '2h ago' },
    { name: 'orders',    columns: 4,  rows: 500000, health: 72, violations: 2,  lastScan: '2h ago' },
    { name: 'products',  columns: 5,  rows: 10000,  health: 91, violations: 0,  lastScan: '2h ago' },
];

let sortCol = null;
let sortDir = 1;

document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (sortCol === col) sortDir *= -1;
        else { sortCol = col; sortDir = 1; }

        document.querySelectorAll('th.sortable').forEach(t => t.classList.remove('sorted'));
        th.classList.add('sorted');

        tableData.sort((a, b) => {
            let av = a[col], bv = b[col];
            if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
            return av < bv ? -sortDir : av > bv ? sortDir : 0;
        });

        renderTable();
    });
});

function healthClass(h) {
    return h >= 80 ? 'green' : h >= 50 ? 'amber' : 'red';
}
function violationBadge(v) {
    if (v === 0) return `<span class="badge badge-ok">No issues</span>`;
    return `<span class="badge badge-${v >= 2 ? 'err' : 'warn'}">${v} ${v === 1 ? 'issue' : 'issues'}</span>`;
}

function renderTable() {
    const tbody = document.getElementById('tables-tbody');
    if (!tbody) return;
    tbody.innerHTML = tableData.map(t => {
        const hc = healthClass(t.health);
        return `
    <tr class="table-row" data-table="${t.name}" onclick="location.href='table-detail.html?table=${t.name}'">
      <td>
        <div class="table-name-cell">
          <div class="table-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"/></svg>
          </div>
          <span class="table-name-text">${t.name}</span>
        </div>
      </td>
      <td><span class="mono">${t.columns}</span></td>
      <td><span class="mono">${t.rows.toLocaleString()}</span></td>
      <td>
        <div class="health-cell">
          <div class="health-bar-wrap">
            <div class="health-bar-fill ${hc}" style="width:${t.health}%"></div>
          </div>
          <span class="health-score ${hc}">${t.health}</span>
        </div>
      </td>
      <td>${violationBadge(t.violations)}</td>
      <td><span class="time-ago">${t.lastScan}</span></td>
      <td><a href="table-detail.html?table=${t.name}" class="table-detail-link">View →</a></td>
    </tr>`;
    }).join('');
}