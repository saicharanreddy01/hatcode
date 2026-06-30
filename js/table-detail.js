// ─── SIDEBAR ──────────────────────────────────────────────
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── TABLE DATA ───────────────────────────────────────────
const tableData = {
    customers: {
        title: 'customers', health: 85, healthClass: 'green',
        meta: '100,000 rows · 6 columns · PostgreSQL',
        columns: [
            { name: 'id',         type: 'INTEGER',   null: '0%',   nullClass: 'null-ok',   unique: '100%', min: '1',    max: '100,000', status: 'ok'   },
            { name: 'name',       type: 'VARCHAR',   null: '0%',   nullClass: 'null-ok',   unique: '94%',  min: '—',    max: '—',       status: 'ok'   },
            { name: 'email',      type: 'VARCHAR',   null: '4.9%', nullClass: 'null-warn', unique: '98%',  min: '—',    max: '—',       status: 'warn' },
            { name: 'city',       type: 'VARCHAR',   null: '0%',   nullClass: 'null-ok',   unique: '0.01%',min: '—',    max: '—',       status: 'ok'   },
            { name: 'age',        type: 'INTEGER',   null: '0%',   nullClass: 'null-ok',   unique: '100%', min: '18',   max: '79',      status: 'ok'   },
            { name: 'created_at', type: 'TIMESTAMP', null: '0%',   nullClass: 'null-ok',   unique: '100%', min: '—',    max: '—',       status: 'ok'   },
        ],
        violations: [
            { column: 'email', rule: 'NOT_NULL', severity: 'warn', rows: '4,940', pct: '4.9%', msg: 'Null values found in non-nullable column' },
        ],
        duplicates: [
            { sim: '0.87', v1: '"Priya Sharma"',  v2: '"Priya Sharme"',  id1: 'Row 9',  id2: 'Row 10' },
            { sim: '0.91', v1: '"Acme Corp"',     v2: '"ACME Corp."',    id1: 'Row 44', id2: 'Row 45' },
            { sim: '0.83', v1: '"John Smith"',    v2: '"Jon Smith"',     id1: 'Row 72', id2: 'Row 73' },
        ],
        history: [
            { date: 'Jun 22, 14:02', type: 'Full scan', rows: '100,000', violations: 1, dot: 'green' },
            { date: 'Jun 21, 10:15', type: 'Full scan', rows: '98,420',  violations: 1, dot: 'green' },
            { date: 'Jun 20, 09:00', type: 'Full scan', rows: '97,100',  violations: 2, dot: 'amber' },
        ],
    },
    orders: {
        title: 'orders', health: 72, healthClass: 'amber',
        meta: '500,000 rows · 4 columns · PostgreSQL',
        columns: [
            { name: 'id',         type: 'INTEGER', null: '0%',   nullClass: 'null-ok',   unique: '100%', min: '1',       max: '500,000', status: 'ok'   },
            { name: 'customer_id',type: 'INTEGER', null: '0%',   nullClass: 'null-ok',   unique: '20%',  min: '1',       max: '100,000', status: 'ok'   },
            { name: 'amount',     type: 'DECIMAL', null: '1.0%', nullClass: 'null-warn', unique: '100%', min: '0.01',    max: '50,000',  status: 'err'  },
            { name: 'created_at', type: 'TIMESTAMP',null:'0%',   nullClass: 'null-ok',   unique: '100%', min: '—',       max: '—',       status: 'ok'   },
        ],
        violations: [
            { column: 'amount', rule: 'NOT_NULL', severity: 'warn', rows: '5,087', pct: '1.0%', msg: 'Null values in amount column' },
            { column: 'amount', rule: 'RANGE',    severity: 'err',  rows: '2,341', pct: '0.5%', msg: 'Values below minimum threshold of 0' },
        ],
        duplicates: [],
        history: [
            { date: 'Jun 22, 14:02', type: 'Full scan', rows: '500,000', violations: 2, dot: 'amber' },
            { date: 'Jun 21, 10:15', type: 'Full scan', rows: '490,000', violations: 3, dot: 'amber' },
        ],
    },
    products: {
        title: 'products', health: 91, healthClass: 'green',
        meta: '10,000 rows · 5 columns · PostgreSQL',
        columns: [
            { name: 'id',       type: 'INTEGER', null: '0%',   nullClass: 'null-ok',   unique: '100%', min: '1',    max: '10,000', status: 'ok'   },
            { name: 'name',     type: 'VARCHAR', null: '0%',   nullClass: 'null-ok',   unique: '99%',  min: '—',    max: '—',      status: 'ok'   },
            { name: 'price',    type: 'DECIMAL', null: '0.6%', nullClass: 'null-warn', unique: '85%',  min: '0.99', max: '9,999',  status: 'warn' },
            { name: 'category', type: 'VARCHAR', null: '0%',   nullClass: 'null-ok',   unique: '0.05%',min: '—',    max: '—',      status: 'ok'   },
            { name: 'stock',    type: 'INTEGER', null: '0%',   nullClass: 'null-ok',   unique: '60%',  min: '0',    max: '5,000',  status: 'ok'   },
        ],
        violations: [
            { column: 'price', rule: 'NOT_NULL', severity: 'warn', rows: '58', pct: '0.6%', msg: 'Null values found in price column' },
        ],
        duplicates: [],
        history: [
            { date: 'Jun 22, 14:02', type: 'Full scan', rows: '10,000', violations: 1, dot: 'green' },
            { date: 'Jun 21, 10:15', type: 'Full scan', rows: '9,800',  violations: 1, dot: 'green' },
        ],
    },
};

// ─── LOAD TABLE FROM URL ───────────────────────────────────
const params    = new URLSearchParams(window.location.search);
const tableName = params.get('table') || 'customers';
const data      = tableData[tableName] || tableData.customers;

// Set page title + breadcrumb
document.title = `${data.title} — HatCode`;
document.getElementById('breadcrumb-table').textContent = data.title;
document.getElementById('td-title').textContent         = data.title;
document.getElementById('td-meta').textContent          = data.meta;
document.getElementById('td-health').textContent        = data.health;
document.getElementById('td-health').className         = `td-health-val ${data.healthClass}`;

// ─── RENDER PROFILE ───────────────────────────────────────
function statusBadge(s) {
    if (s === 'ok')   return `<span class="badge badge-ok">OK</span>`;
    if (s === 'warn') return `<span class="badge badge-warn">Warning</span>`;
    return `<span class="badge badge-err">Error</span>`;
}

const profileTbody = document.getElementById('profile-tbody');
if (profileTbody) {
    profileTbody.innerHTML = data.columns.map(col => `
    <tr>
      <td><span class="mono" style="font-weight:700;color:var(--deep)">${col.name}</span></td>
      <td><span class="col-type-badge">${col.type}</span></td>
      <td><span class="${col.nullClass}">${col.null}</span></td>
      <td><span class="mono">${col.unique}</span></td>
      <td><span class="mono">${col.min}</span></td>
      <td><span class="mono">${col.max}</span></td>
      <td>${statusBadge(col.status)}</td>
    </tr>
  `).join('');
}

// ─── RENDER VIOLATIONS ────────────────────────────────────
const violationsTbody = document.getElementById('violations-tbody');
document.getElementById('violations-count').textContent = `${data.violations.length} found`;
if (violationsTbody) {
    if (data.violations.length === 0) {
        violationsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-3)">No violations found for this table.</td></tr>`;
    } else {
        violationsTbody.innerHTML = data.violations.map(v => `
      <tr>
        <td><span class="mono" style="font-weight:700">${v.column}</span></td>
        <td><span class="mono">${v.rule}</span></td>
        <td><span class="badge badge-${v.severity === 'err' ? 'err' : 'warn'}">${v.severity === 'err' ? 'ERROR' : 'WARNING'}</span></td>
        <td><span class="mono">${v.rows}</span></td>
        <td><span class="mono">${v.pct}</span></td>
        <td style="font-size:12px;color:var(--text-2)">${v.msg}</td>
      </tr>
    `).join('');
    }
}

// ─── RENDER DUPLICATES ────────────────────────────────────
document.getElementById('dups-count').textContent = data.duplicates.length > 0
    ? `${data.duplicates.length} pairs found`
    : 'No duplicates found';

const dupsList = document.getElementById('dups-list');
if (dupsList) {
    if (data.duplicates.length === 0) {
        dupsList.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-3);font-size:14px">No near-duplicate pairs detected in this table.</div>`;
    } else {
        dupsList.innerHTML = data.duplicates.map(d => `
      <div class="dup-group">
        <div class="dup-group-left">
          <div class="dup-sim">Similarity ${d.sim}</div>
          <div class="dup-vals">
            <span>${d.v1}</span>
            <span class="dup-arr">↔</span>
            <span>${d.v2}</span>
          </div>
          <div class="dup-ids">${d.id1} · ${d.id2}</div>
        </div>
        <button class="btn-review">Review</button>
      </div>
    `).join('');
    }
}

// ─── RENDER HISTORY ───────────────────────────────────────
const historyList = document.getElementById('history-list');
if (historyList) {
    historyList.innerHTML = data.history.map(h => `
    <div class="scan-history-row">
      <span class="scan-dot ${h.dot}"></span>
      <span class="scan-date">${h.date}</span>
      <span class="scan-type">${h.type}</span>
      <span class="scan-rows">${h.rows} rows</span>
      <span class="scan-violations">${h.violations} violation${h.violations !== 1 ? 's' : ''}</span>
      <a href="history.html" class="scan-report-link">View report →</a>
    </div>
  `).join('');
}

// ─── TABS ─────────────────────────────────────────────────
document.querySelectorAll('.td-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.td-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.td-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
});