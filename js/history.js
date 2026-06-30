document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── CHART ────────────────────────────────────────────────
const ctx = document.getElementById('history-chart');
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun 9','Jun 10','Jun 11','Jun 12','Jun 13','Jun 14','Jun 15','Jun 16','Jun 17','Jun 18','Jun 19','Jun 20','Jun 21','Jun 22'],
            datasets: [{
                data: [75,77,78,76,79,80,78,80,79,83,81,76,81,85],
                borderColor: '#4F7C82',
                backgroundColor: 'rgba(79,124,130,0.06)',
                borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#4F7C82',
                tension: 0.4, fill: true,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: {
                    backgroundColor: '#0B2E33', titleColor: '#B8E3E9', bodyColor: '#fff',
                    padding: 10, cornerRadius: 8,
                }},
            scales: {
                x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#93B1B5', maxRotation: 0 }},
                y: { min: 60, max: 100, grid: { color: 'rgba(214,234,237,0.5)', drawBorder: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#93B1B5' }},
            }
        }
    });
}

// ─── DATA ─────────────────────────────────────────────────
const scans = [
    { date: 'Jun 22', time: '14:02', type: 'Full scan', rows: '610,000', violations: 3, duration: '22s', dot: 'green' },
    { date: 'Jun 22', time: '10:15', type: 'Full scan', rows: '610,000', violations: 3, duration: '19s', dot: 'green' },
    { date: 'Jun 21', time: '16:45', type: 'Full scan', rows: '610,000', violations: 5, duration: '24s', dot: 'amber' },
    { date: 'Jun 21', time: '09:00', type: 'Incremental', rows: '4,200', violations: 0, duration: '2s', dot: 'green' },
    { date: 'Jun 20', time: '15:30', type: 'Full scan', rows: '605,000', violations: 4, duration: '21s', dot: 'amber' },
    { date: 'Jun 19', time: '11:00', type: 'Full scan', rows: '600,000', violations: 2, duration: '20s', dot: 'green' },
];

function groupByDate(data) {
    const groups = {};
    data.forEach(s => {
        if (!groups[s.date]) groups[s.date] = [];
        groups[s.date].push(s);
    });
    return groups;
}

function renderHistory(data) {
    const el = document.getElementById('history-timeline');
    const groups = groupByDate(data);
    el.innerHTML = Object.entries(groups).map(([date, scans]) => `
    <div class="history-date-divider">${date}</div>
    ${scans.map(s => `
      <div class="history-row">
        <span class="hr-dot ${s.dot}"></span>
        <span class="hr-time">${s.time}</span>
        <span class="hr-type">${s.type}</span>
        <span class="hr-rows">${s.rows} rows</span>
        <span class="hr-violations">${s.violations} violation${s.violations !== 1 ? 's' : ''}</span>
        <span class="hr-duration">${s.duration}</span>
        <a href="#" class="hr-link">View report →</a>
      </div>
    `).join('')}
  `).join('');
}

document.getElementById('filter-scan-type')?.addEventListener('change', function() {
    const filtered = this.value ? scans.filter(s => s.type === this.value) : scans;
    renderHistory(filtered);
});

renderHistory(scans);