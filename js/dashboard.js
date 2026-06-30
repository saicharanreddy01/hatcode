// ─── HEALTH CHART ─────────────────────────────────────────
const ctx = document.getElementById('health-chart');
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21', 'Jun 22'],
            datasets: [{
                label: 'Health Score',
                data: [78, 80, 79, 83, 81, 76, 85],
                borderColor: '#4F7C82',
                backgroundColor: 'rgba(79,124,130,0.06)',
                borderWidth: 2,
                pointBackgroundColor: '#4F7C82',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0B2E33',
                    titleColor: '#B8E3E9',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => ` Health: ${ctx.raw}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(214,234,237,0.5)', drawBorder: false },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                        color: '#93B1B5'
                    }
                },
                y: {
                    min: 60, max: 100,
                    grid: { color: 'rgba(214,234,237,0.5)', drawBorder: false },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                        color: '#93B1B5',
                        stepSize: 10
                    }
                }
            }
        }
    });
}

// ─── RUN SCAN BUTTON ──────────────────────────────────────
document.getElementById('run-scan-btn')?.addEventListener('click', () => {
    window.location.href = 'scan.html';
});