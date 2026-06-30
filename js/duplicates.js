// ─── EXACT DUPLICATES ─────────────────────────────────────
const exactDups = [
    { val: '"John Smith"',    count: 3, table: 'customers', rows: [{ id: 'Row 12', data: 'John Smith · john@email.com · New York' }, { id: 'Row 45', data: 'John Smith · john@email.com · New York' }, { id: 'Row 89', data: 'John Smith · john@email.com · New York' }] },
    { val: '"Jane Doe"',      count: 2, table: 'customers', rows: [{ id: 'Row 34', data: 'Jane Doe · jane@email.com · Chicago' }, { id: 'Row 67', data: 'Jane Doe · jane@email.com · Chicago' }] },
    { val: '"Bob Johnson"',   count: 2, table: 'customers', rows: [{ id: 'Row 56', data: 'Bob Johnson · bob@email.com · Boston' }, { id: 'Row 78', data: 'Bob Johnson · bob@email.com · Boston' }] },
];

const nearDups = [
    { sim: '0.91', v1: '"Acme Corp"',     v2: '"ACME Corp."',    id1: 'Row 44', id2: 'Row 45' },
    { sim: '0.87', v1: '"Priya Sharma"',  v2: '"Priya Sharme"',  id1: 'Row 9',  id2: 'Row 10' },
    { sim: '0.85', v1: '"Mike Wilson"',   v2: '"Michael Wilson"',id1: 'Row 23', id2: 'Row 91' },
    { sim: '0.83', v1: '"John Smith"',    v2: '"Jon Smith"',     id1: 'Row 72', id2: 'Row 73' },
    { sim: '0.81', v1: '"Sara Connor"',   v2: '"Sarah Connor"',  id1: 'Row 55', id2: 'Row 56' },
];

function renderExactDups() {
    const el = document.getElementById('exact-dups-list');
    if (!el) return;
    el.innerHTML = exactDups.map((d, i) => `
    <div class="exact-dup-group" id="edg-${i}">
      <div class="exact-dup-header" onclick="toggleExact(${i})">
        <div class="exact-dup-left">
          <span class="exact-dup-count">${d.count} copies</span>
          <span class="exact-dup-val">${d.val}</span>
          <span class="exact-dup-table-badge">· ${d.table}</span>
        </div>
        <svg class="exact-dup-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="exact-dup-body">
        <div class="exact-dup-rows">
          ${d.rows.map(r => `
            <div class="edr-row">
              <span class="edr-id">${r.id}</span>
              <span>${r.data}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

window.toggleExact = function(i) {
    document.getElementById(`edg-${i}`).classList.toggle('open');
};

function renderNearDups(threshold = 0.80) {
    const el = document.getElementById('near-dups-list');
    if (!el) return;
    const filtered = nearDups.filter(d => parseFloat(d.sim) >= threshold);
    el.innerHTML = filtered.map(d => `
    <div class="near-dup-card">
      <div class="ndc-left">
        <div class="ndc-sim">Similarity ${d.sim}</div>
        <div class="ndc-vals">
          <span>${d.v1}</span>
          <span class="ndc-arr">↔</span>
          <span>${d.v2}</span>
        </div>
        <div class="ndc-ids">${d.id1} · ${d.id2}</div>
      </div>
      <div class="ndc-actions">
        <button class="btn-review">Review</button>
        <button class="btn-dismiss-sm">Dismiss</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('sim-threshold')?.addEventListener('change', function() {
    renderNearDups(parseFloat(this.value));
});

renderExactDups();
renderNearDups();