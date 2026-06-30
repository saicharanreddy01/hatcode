// ─── SIDEBAR ──────────────────────────────────────────────
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('app-main').classList.toggle('expanded');
});

// ─── STATE MANAGEMENT ─────────────────────────────────────
const statePre      = document.getElementById('state-pre');
const stateScanning = document.getElementById('state-scanning');
const stateComplete = document.getElementById('state-complete');

function showState(state) {
    [statePre, stateScanning, stateComplete].forEach(s => s.classList.add('hidden'));
    state.classList.remove('hidden');
}

// ─── SCAN TYPE SELECTION ──────────────────────────────────
document.querySelectorAll('.scan-type-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.scan-type-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// ─── TABLE SELECTION ──────────────────────────────────────
document.querySelectorAll('.scope-table-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
        const selected = document.querySelectorAll('.scope-table-card.selected').length;
        document.querySelector('.scan-scope-sub').textContent =
            `${selected} of 3 tables will be scanned`;
    });
});

// ─── TOGGLE SWITCHES ──────────────────────────────────────
document.querySelectorAll('.toggle-switch').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('on');
        btn.setAttribute('aria-checked', btn.classList.contains('on'));
    });
});

// ─── SCAN TABLES CONFIG ───────────────────────────────────
const tables = [
    { id: 'customers', duration: 4000 },
    { id: 'orders',    duration: 7000 },
    { id: 'products',  duration: 2000 },
];
const totalDuration = tables.reduce((s, t) => s + t.duration, 0);

let cancelled = false;
let elapsedIv = null;

// Icon SVGs
const svgWait  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const svgSpin  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
const svgCheck = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function setTableState(id, state) {
    const icon   = document.getElementById(`slt-${id}-icon`);
    const status = document.getElementById(`slt-${id}-status`);
    const bar    = document.getElementById(`slt-${id}-bar`);
    const row    = document.getElementById(`slt-${id}`);

    row.classList.remove('scanning-row', 'done-row');

    if (state === 'scanning') {
        icon.className = 'slt-icon scanning-icon';
        icon.innerHTML = svgSpin;
        status.className = 'slt-status scanning';
        status.textContent = 'Scanning…';
        row.classList.add('scanning-row');
        document.getElementById('scan-status-text').textContent = `Scanning ${id} table…`;
    } else if (state === 'done') {
        icon.className = 'slt-icon done-icon';
        icon.innerHTML = svgCheck;
        status.className = 'slt-status done';
        status.textContent = 'Complete ✓';
        bar.style.width = '100%';
        bar.classList.add('done');
        row.classList.add('done-row');
    } else {
        icon.className = 'slt-icon pending';
        icon.innerHTML = svgWait;
        status.className = 'slt-status';
        status.textContent = 'Waiting';
        bar.style.width = '0%';
        bar.classList.remove('done');
    }
}

function resetTables() {
    tables.forEach(t => setTableState(t.id, 'waiting'));
    document.getElementById('scan-progress-fill').style.width = '0%';
    document.getElementById('scan-progress-pct').textContent = '0%';
    document.getElementById('scan-elapsed').textContent = 'Elapsed: 0s';
    document.getElementById('scan-remaining').textContent = '';
    document.getElementById('scan-status-text').textContent = 'Initialising scan engine…';
}

async function runScan() {
    cancelled = false;
    const startTime = Date.now();
    const fill      = document.getElementById('scan-progress-fill');
    const pctEl     = document.getElementById('scan-progress-pct');
    const elapsedEl = document.getElementById('scan-elapsed');
    const remainEl  = document.getElementById('scan-remaining');

    elapsedIv = setInterval(() => {
        const s = Math.floor((Date.now() - startTime) / 1000);
        elapsedEl.textContent = `Elapsed: ${s}s`;
    }, 500);

    let completedMs = 0;

    for (const table of tables) {
        if (cancelled) break;
        setTableState(table.id, 'scanning');
        const tableBar = document.getElementById(`slt-${table.id}-bar`);
        const tStart = Date.now();

        await new Promise(resolve => {
            function frame() {
                if (cancelled) { resolve(); return; }
                const elapsed  = Date.now() - tStart;
                const tProg    = Math.min(elapsed / table.duration, 1);
                const overall  = (completedMs + tProg * table.duration) / totalDuration;
                const pctVal   = Math.round(overall * 100);
                fill.style.width = pctVal + '%';
                pctEl.textContent = pctVal + '%';
                tableBar.style.width = Math.round(tProg * 100) + '%';
                const remS = Math.ceil((totalDuration - (completedMs + tProg * table.duration)) / 1000);
                remainEl.textContent = remS > 0 ? `~${remS}s remaining` : '';
                if (tProg < 1) requestAnimationFrame(frame);
                else resolve();
            }
            requestAnimationFrame(frame);
        });

        if (!cancelled) {
            setTableState(table.id, 'done');
            completedMs += table.duration;
        }
    }

    clearInterval(elapsedIv);

    if (!cancelled) {
        fill.style.width = '100%';
        pctEl.textContent = '100%';
        remainEl.textContent = '';
        const totalSec = Math.round((Date.now() - startTime) / 1000);
        document.getElementById('final-time').textContent = totalSec + 's';
        setTimeout(() => showState(stateComplete), 600);
    }
}

// ─── BUTTON EVENTS ────────────────────────────────────────
document.getElementById('btn-start-scan')?.addEventListener('click', () => {
    resetTables();
    showState(stateScanning);
    runScan();
});

document.getElementById('btn-cancel-scan')?.addEventListener('click', () => {
    cancelled = true;
    clearInterval(elapsedIv);
    showState(statePre);
});

document.getElementById('btn-scan-again')?.addEventListener('click', () => {
    resetTables();
    showState(statePre);
});