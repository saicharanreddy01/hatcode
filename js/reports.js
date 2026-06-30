document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── REPORTS DATA ─────────────────────────────────────────
let reports = [
    { type: 'pdf', name: 'Scan Report — Jun 22, 14:02', meta: 'Full scan · production-db', size: '342 KB' },
    { type: 'csv', name: 'Violations Export — Jun 22, 14:02', meta: 'Full scan · production-db', size: '18 KB' },
    { type: 'pdf', name: 'Scan Report — Jun 21, 16:45', meta: 'Full scan · production-db', size: '338 KB' },
    { type: 'csv', name: 'Duplicates Export — Jun 20, 15:30', meta: 'Full scan · production-db', size: '94 KB' },
    { type: 'pdf', name: 'Scan Report — Jun 19, 11:00', meta: 'Full scan · production-db', size: '312 KB' },
];

function pdfIconSVG() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
}
function csvIconSVG() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"/></svg>`;
}

function renderReports() {
    const el = document.getElementById('reports-list');
    document.getElementById('reports-count').textContent = `${reports.length} report${reports.length !== 1 ? 's' : ''}`;

    if (reports.length === 0) {
        el.innerHTML = `
      <div class="reports-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>No reports yet. Generate one from a recent scan above.</p>
      </div>
    `;
        return;
    }

    el.innerHTML = reports.map((r, i) => `
    <div class="report-row">
      <div class="report-type-icon ${r.type}">
        ${r.type === 'pdf' ? pdfIconSVG() : csvIconSVG()}
      </div>
      <div class="report-info">
        <div class="report-name">${r.name}</div>
        <div class="report-meta">${r.meta}</div>
      </div>
      <span class="report-size">${r.size}</span>
      <div class="report-actions">
        <button class="btn-report-download" onclick="downloadReport(${i})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
        <button class="btn-report-delete" onclick="deleteReport(${i})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

window.downloadReport = function(i) {
    const r = reports[i];
    // Simulate a file download
    const blob = new Blob([`This is a simulated ${r.type.toUpperCase()} report.\n\n${r.name}\n${r.meta}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = r.name.replace(/[^a-z0-9]/gi, '_') + '.' + r.type;
    a.click();
    URL.revokeObjectURL(url);
};

window.deleteReport = function(i) {
    reports.splice(i, 1);
    renderReports();
};

// ─── GENERATE NEW REPORT ──────────────────────────────────
function generateReport(type) {
    const select = document.getElementById('report-scan-select');
    const scanLabel = select.value;
    const btn = type === 'pdf' ? document.getElementById('btn-gen-pdf') : document.getElementById('btn-gen-csv');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<span class="spinner" style="width:13px;height:13px;border-width:2px"></span> Generating…`;
    btn.disabled = true;

    setTimeout(() => {
        reports.unshift({
            type,
            name: `${type === 'pdf' ? 'Scan Report' : 'Data Export'} — ${scanLabel.split(' · ')[0]}`,
            meta: `${scanLabel.split(' · ')[1]} · production-db`,
            size: type === 'pdf' ? `${Math.round(280 + Math.random() * 100)} KB` : `${Math.round(10 + Math.random() * 80)} KB`,
        });
        renderReports();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1200);
}

document.getElementById('btn-gen-pdf')?.addEventListener('click', () => generateReport('pdf'));
document.getElementById('btn-gen-csv')?.addEventListener('click', () => generateReport('csv'));

renderReports();