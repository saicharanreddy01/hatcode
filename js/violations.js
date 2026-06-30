// ─── DATA ─────────────────────────────────────────────────
const violations = [
    { table: 'customers', column: 'email',  rule: 'NOT_NULL', sev: 'warn', rows: 4940,  pct: '4.9%', msg: 'Null values found in non-nullable column', samples: ['NULL', 'NULL', 'NULL'] },
    { table: 'orders',    column: 'amount', rule: 'NOT_NULL', sev: 'warn', rows: 5087,  pct: '1.0%', msg: 'Null values in required amount column',      samples: ['NULL', 'NULL', 'NULL'] },
    { table: 'orders',    column: 'amount', rule: 'RANGE',    sev: 'err',  rows: 2341,  pct: '0.5%', msg: 'Values below minimum threshold of 0',        samples: ['-12.50', '-99.00', '-0.01'] },
    { table: 'products',  column: 'price',  rule: 'NOT_NULL', sev: 'warn', rows: 58,    pct: '0.6%', msg: 'Null values found in price column',           samples: ['NULL', 'NULL', 'NULL'] },
];

let expandedRow = null;

function renderViolations(data) {
    const tbody = document.getElementById('violations-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map((v, i) => `
    <tr class="v-row table-row" data-index="${i}" onclick="toggleExpand(${i})">
      <td><a href="table-detail.html?table=${v.table}" class="table-detail-link" onclick="event.stopPropagation()">${v.table}</a></td>
      <td><span class="mono" style="font-weight:700">${v.column}</span></td>
      <td><span class="mono">${v.rule}</span></td>
      <td><span class="badge badge-${v.sev === 'err' ? 'err' : 'warn'}">${v.sev === 'err' ? 'ERROR' : 'WARNING'}</span></td>
      <td><span class="mono">${v.rows.toLocaleString()}</span></td>
      <td><span class="mono">${v.pct}</span></td>
      <td style="font-size:12px;color:var(--text-2);max-width:200px">${v.msg}</td>
      <td>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="expand-chevron" id="chev-${i}" style="color:var(--text-3);transition:transform 0.2s"><path d="M6 9l6 6 6-6"/></svg>
      </td>
    </tr>
    <tr class="v-expand-row" id="expand-${i}" style="display:none">
      <td colspan="8">
        <div class="v-expand-inner">
          <p><strong>Message:</strong> ${v.msg}</p>
          <p><strong>Sample values:</strong></p>
          <div class="v-sample-vals">
            ${v.samples.map(s => `<span class="v-sample">${s}</span>`).join('')}
          </div>
          <div class="v-expand-actions">
            <button class="btn-view-table" onclick="location.href='table-detail.html?table=${v.table}'">View in table →</button>
            <button class="btn-dismiss">Dismiss</button>
          </div>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleExpand = function(i) {
    const row   = document.getElementById(`expand-${i}`);
    const chev  = document.getElementById(`chev-${i}`);
    const vRow  = document.querySelector(`tr[data-index="${i}"]`);
    const isOpen = row.style.display !== 'none';

    // Close previous
    if (expandedRow !== null && expandedRow !== i) {
        document.getElementById(`expand-${expandedRow}`).style.display = 'none';
        document.getElementById(`chev-${expandedRow}`).style.transform = '';
        document.querySelector(`tr[data-index="${expandedRow}"]`)?.classList.remove('expanded');
    }

    row.style.display = isOpen ? 'none' : '';
    chev.style.transform = isOpen ? '' : 'rotate(180deg)';
    vRow.classList.toggle('expanded', !isOpen);
    expandedRow = isOpen ? null : i;
};

// ─── FILTERS ──────────────────────────────────────────────
function applyFilters() {
    const sev   = document.getElementById('filter-severity').value;
    const table = document.getElementById('filter-table').value;
    const rule  = document.getElementById('filter-rule').value;

    const filtered = violations.filter(v =>
        (!sev   || v.sev   === sev) &&
        (!table || v.table === table) &&
        (!rule  || v.rule  === rule)
    );
    expandedRow = null;
    renderViolations(filtered);
}

document.getElementById('filter-severity')?.addEventListener('change', applyFilters);
document.getElementById('filter-table')?.addEventListener('change', applyFilters);
document.getElementById('filter-rule')?.addEventListener('change', applyFilters);

// ─── EXPORT ───────────────────────────────────────────────
document.getElementById('btn-export')?.addEventListener('click', () => {
    const headers = ['Table','Column','Rule','Severity','Affected Rows','% of Total','Message'];
    const rows = violations.map(v =>
        [v.table, v.column, v.rule, v.sev.toUpperCase(), v.rows, v.pct, v.msg].join(',')
    );
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'violations.csv'; a.click();
    URL.revokeObjectURL(url);
});

// ─── INIT ─────────────────────────────────────────────────
renderViolations(violations);// ─── DATA ─────────────────────────────────────────────────
const violations = [
    { table: 'customers', column: 'email',  rule: 'NOT_NULL', sev: 'warn', rows: 4940,  pct: '4.9%', msg: 'Null values found in non-nullable column', samples: ['NULL', 'NULL', 'NULL'] },
    { table: 'orders',    column: 'amount', rule: 'NOT_NULL', sev: 'warn', rows: 5087,  pct: '1.0%', msg: 'Null values in required amount column',      samples: ['NULL', 'NULL', 'NULL'] },
    { table: 'orders',    column: 'amount', rule: 'RANGE',    sev: 'err',  rows: 2341,  pct: '0.5%', msg: 'Values below minimum threshold of 0',        samples: ['-12.50', '-99.00', '-0.01'] },
    { table: 'products',  column: 'price',  rule: 'NOT_NULL', sev: 'warn', rows: 58,    pct: '0.6%', msg: 'Null values found in price column',           samples: ['NULL', 'NULL', 'NULL'] },
];

let expandedRow = null;

function renderViolations(data) {
    const tbody = document.getElementById('violations-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map((v, i) => `
    <tr class="v-row table-row" data-index="${i}" onclick="toggleExpand(${i})">
      <td><a href="table-detail.html?table=${v.table}" class="table-detail-link" onclick="event.stopPropagation()">${v.table}</a></td>
      <td><span class="mono" style="font-weight:700">${v.column}</span></td>
      <td><span class="mono">${v.rule}</span></td>
      <td><span class="badge badge-${v.sev === 'err' ? 'err' : 'warn'}">${v.sev === 'err' ? 'ERROR' : 'WARNING'}</span></td>
      <td><span class="mono">${v.rows.toLocaleString()}</span></td>
      <td><span class="mono">${v.pct}</span></td>
      <td style="font-size:12px;color:var(--text-2);max-width:200px">${v.msg}</td>
      <td>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="expand-chevron" id="chev-${i}" style="color:var(--text-3);transition:transform 0.2s"><path d="M6 9l6 6 6-6"/></svg>
      </td>
    </tr>
    <tr class="v-expand-row" id="expand-${i}" style="display:none">
      <td colspan="8">
        <div class="v-expand-inner">
          <p><strong>Message:</strong> ${v.msg}</p>
          <p><strong>Sample values:</strong></p>
          <div class="v-sample-vals">
            ${v.samples.map(s => `<span class="v-sample">${s}</span>`).join('')}
          </div>
          <div class="v-expand-actions">
            <button class="btn-view-table" onclick="location.href='table-detail.html?table=${v.table}'">View in table →</button>
            <button class="btn-dismiss">Dismiss</button>
          </div>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleExpand = function(i) {
    const row   = document.getElementById(`expand-${i}`);
    const chev  = document.getElementById(`chev-${i}`);
    const vRow  = document.querySelector(`tr[data-index="${i}"]`);
    const isOpen = row.style.display !== 'none';

    // Close previous
    if (expandedRow !== null && expandedRow !== i) {
        document.getElementById(`expand-${expandedRow}`).style.display = 'none';
        document.getElementById(`chev-${expandedRow}`).style.transform = '';
        document.querySelector(`tr[data-index="${expandedRow}"]`)?.classList.remove('expanded');
    }

    row.style.display = isOpen ? 'none' : '';
    chev.style.transform = isOpen ? '' : 'rotate(180deg)';
    vRow.classList.toggle('expanded', !isOpen);
    expandedRow = isOpen ? null : i;
};

// ─── FILTERS ──────────────────────────────────────────────
function applyFilters() {
    const sev   = document.getElementById('filter-severity').value;
    const table = document.getElementById('filter-table').value;
    const rule  = document.getElementById('filter-rule').value;

    const filtered = violations.filter(v =>
        (!sev   || v.sev   === sev) &&
        (!table || v.table === table) &&
        (!rule  || v.rule  === rule)
    );
    expandedRow = null;
    renderViolations(filtered);
}

document.getElementById('filter-severity')?.addEventListener('change', applyFilters);
document.getElementById('filter-table')?.addEventListener('change', applyFilters);
document.getElementById('filter-rule')?.addEventListener('change', applyFilters);

// ─── EXPORT ───────────────────────────────────────────────
document.getElementById('btn-export')?.addEventListener('click', () => {
    const headers = ['Table','Column','Rule','Severity','Affected Rows','% of Total','Message'];
    const rows = violations.map(v =>
        [v.table, v.column, v.rule, v.sev.toUpperCase(), v.rows, v.pct, v.msg].join(',')
    );
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'violations.csv'; a.click();
    URL.revokeObjectURL(url);
});

// ─── INIT ─────────────────────────────────────────────────
renderViolations(violations);