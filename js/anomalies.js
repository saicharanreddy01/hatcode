// ─── DATA ─────────────────────────────────────────────────
const anomalies = [
    {
        location: 'orders.amount',
        type: 'AVG_VALUE spike',
        zscore: '6,998.94',
        expected: '~510.00 (±7.07)',
        actual: '50,000.00',
        baseline: '510.00',
        desc: 'The average order amount jumped 98× above the historical baseline. This indicates either a data entry error, a bulk test transaction, or a pricing misconfiguration affecting thousands of rows.',
        chartData: [508, 512, 505, 515, 510, 507, 50000, 512],
        chartLabels: ['Jun 15','Jun 16','Jun 17','Jun 18','Jun 19','Jun 20','Jun 21','Jun 22'],
        id: 'anom-0',
    },
    {
        location: 'customers.email',
        type: 'NULL_RATE increase',
        zscore: '4.21',
        expected: '~0.1% (±0.05%)',
        actual: '4.9%',
        baseline: '0.1%',
        desc: 'The null rate for the email column increased from 0.1% baseline to 4.9% — a 49× increase. This may indicate a data ingestion issue or a broken signup flow that is not capturing email addresses.',
        chartData: [0.1, 0.1, 0.12, 0.09, 0.11, 0.1, 4.9, 4.8],
        chartLabels: ['Jun 15','Jun 16','Jun 17','Jun 18','Jun 19','Jun 20','Jun 21','Jun 22'],
        id: 'anom-1',
    },
];

function renderAnomalies() {
    const el = document.getElementById('anomaly-list');
    if (!el) return;

    el.innerHTML = anomalies.map((a, i) => `
    <div class="anomaly-card">
      <div class="anomaly-card-top">
        <div class="anomaly-card-left">
          <div class="anomaly-location">${a.location}</div>
          <div class="anomaly-type">${a.type}</div>
        </div>
        <div>
          <div class="anomaly-zscore">Z: ${a.zscore}</div>
          <div class="anomaly-zscore-label">Z-score</div>
        </div>
      </div>

      <div class="anomaly-stats">
        <div class="anom-stat">
          <div class="anom-stat-label">Expected</div>
          <div class="anom-stat-val">${a.expected}</div>
        </div>
        <div class="anom-stat">
          <div class="anom-stat-label">Actual (last scan)</div>
          <div class="anom-stat-val warning">${a.actual}</div>
        </div>
        <div class="anom-stat">
          <div class="anom-stat-label">Baseline</div>
          <div class="anom-stat-val">${a.baseline}</div>
        </div>
      </div>

      <p class="anomaly-desc">${a.desc}</p>

      <div class="anomaly-chart-wrap">
        <canvas id="chart-${i}"></canvas>
      </div>

      <div class="anomaly-actions">
        <button class="btn-view-col" onclick="location.href='table-detail.html?table=${a.location.split('.')[0]}'">View column →</button>
        <button class="btn-dismiss-anom" onclick="dismissAnomaly(this)">Dismiss</button>
        <button class="btn-mark-known" onclick="markKnown(this)">Mark as known issue</button>
      </div>
    </div>
  `).join('');

    // Render mini charts
    anomalies.forEach((a, i) => {
        const ctx = document.getElementById(`chart-${i}`);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: a.chartLabels,
                datasets: [{
                    data: a.chartData,
                    borderColor: '#D97706',
                    backgroundColor: 'rgba(217,119,6,0.06)',
                    borderWidth: 2,
                    pointBackgroundColor: a.chartData.map((v, idx) =>
                        idx === a.chartData.length - 2 ? '#DC2626' : '#4F7C82'
                    ),
                    pointRadius: a.chartData.map((v, idx) =>
                        idx === a.chartData.length - 2 ? 6 : 3
                    ),
                    tension: 0.4, fill: true,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: {
                        backgroundColor: '#0B2E33', titleColor: '#B8E3E9',
                        bodyColor: '#fff', padding: 8, cornerRadius: 6,
                    }},
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#93B1B5' }},
                    y: { grid: { color: 'rgba(214,234,237,0.4)', drawBorder: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#93B1B5' }},
                }
            }
        });
    });
}

window.dismissAnomaly = function(btn) {
    btn.closest('.anomaly-card').style.opacity = '0.4';
    btn.textContent = 'Dismissed';
    btn.disabled = true;
};

window.markKnown = function(btn) {
    const card = btn.closest('.anomaly-card');
    card.style.borderLeftColor = 'var(--mid)';
    btn.textContent = 'Marked as known';
    btn.disabled = true;
};

renderAnomalies();