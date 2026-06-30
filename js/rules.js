document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── RULES DATA ───────────────────────────────────────────
const rules = [
    { id: 1, table: 'customers', column: 'email',  type: 'NOT_NULL', severity: 'warning', threshold: 0.0 },
    { id: 2, table: 'orders',    column: 'amount',  type: 'NOT_NULL', severity: 'warning', threshold: 0.0 },
    { id: 3, table: 'orders',    column: 'amount',  type: 'RANGE',    severity: 'error',   min: 0, max: 999999 },
    { id: 4, table: 'customers', column: 'age',     type: 'RANGE',    severity: 'error',   min: 0, max: 120 },
    { id: 5, table: 'products',  column: 'price',   type: 'NOT_NULL', severity: 'warning', threshold: 0.0 },
    { id: 6, table: 'customers', column: 'id',      type: 'UNIQUE',   severity: 'error' },
];

let selectedRuleId = rules[0].id;

function renderRulesList() {
    const el = document.getElementById('rules-list');
    document.getElementById('rules-count-badge').textContent = `(${rules.length})`;
    el.innerHTML = rules.map(r => `
    <div class="rule-item ${r.id === selectedRuleId ? 'selected' : ''}" onclick="selectRule(${r.id})">
      <div class="rule-item-title">${r.table}.${r.column}</div>
      <div class="rule-item-meta">
        <span class="mono">${r.type}</span>
        <span>·</span>
        <span class="rule-item-sev ${r.severity}">${r.severity.toUpperCase()}</span>
      </div>
    </div>
  `).join('');
}

window.selectRule = function(id) {
    selectedRuleId = id;
    renderRulesList();
    loadRuleIntoEditor(id);
};

function loadRuleIntoEditor(id) {
    const r = rules.find(x => x.id === id);
    if (!r) return;
    document.getElementById('editor-badge').textContent = `${r.table}.${r.column}`;
    document.getElementById('rf-table').value = r.table;
    document.getElementById('rf-column').value = r.column;
    document.getElementById('rf-type').value = r.type;

    toggleTypeFields(r.type);

    if (r.type === 'RANGE') {
        document.getElementById('rf-min').value = r.min ?? '';
        document.getElementById('rf-max').value = r.max ?? '';
    } else {
        document.getElementById('rf-threshold').value = r.threshold ?? 0;
    }

    document.querySelectorAll('.rf-sev-opt').forEach(opt => {
        const input = opt.querySelector('input');
        opt.classList.toggle('selected', input.value === r.severity);
        input.checked = input.value === r.severity;
    });
}

function toggleTypeFields(type) {
    document.getElementById('rf-threshold-group').style.display = type === 'RANGE' ? 'none' : 'flex';
    document.getElementById('rf-range-group').style.display = type === 'RANGE' ? 'flex' : 'none';
}

document.getElementById('rf-type')?.addEventListener('change', function() {
    toggleTypeFields(this.value);
});

// Severity selector
document.querySelectorAll('.rf-sev-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.rf-sev-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
    });
});

// Save rule
document.getElementById('btn-save-rule')?.addEventListener('click', () => {
    const r = rules.find(x => x.id === selectedRuleId);
    if (!r) return;
    r.table = document.getElementById('rf-table').value;
    r.column = document.getElementById('rf-column').value;
    r.type = document.getElementById('rf-type').value;
    r.severity = document.querySelector('input[name="severity"]:checked').value;
    renderRulesList();

    const btn = document.getElementById('btn-save-rule');
    const original = btn.textContent;
    btn.textContent = 'Saved ✓';
    setTimeout(() => btn.textContent = original, 1500);
});

// Delete rule
document.getElementById('btn-delete-rule')?.addEventListener('click', () => {
    const idx = rules.findIndex(r => r.id === selectedRuleId);
    if (idx === -1) return;
    rules.splice(idx, 1);
    if (rules.length > 0) {
        selectedRuleId = rules[0].id;
        renderRulesList();
        loadRuleIntoEditor(selectedRuleId);
    } else {
        renderRulesList();
    }
});

// Add rule
document.getElementById('btn-add-rule')?.addEventListener('click', () => {
    const newId = Math.max(...rules.map(r => r.id), 0) + 1;
    const newRule = { id: newId, table: 'customers', column: 'name', type: 'NOT_NULL', severity: 'warning', threshold: 0.0 };
    rules.unshift(newRule);
    selectedRuleId = newId;
    renderRulesList();
    loadRuleIntoEditor(newId);
});

// Init
renderRulesList();
loadRuleIntoEditor(selectedRuleId);