// ─── PANEL SWITCH ─────────────────────────────────────────
const layout       = document.getElementById('auth-layout');
const loginWrap    = document.getElementById('login-wrap');
const signupWrap   = document.getElementById('signup-wrap');
const brandHeading = document.getElementById('brand-heading');
const brandSub     = document.getElementById('brand-sub');
const brandIllust  = document.getElementById('brand-illustration');
const goSignup     = document.getElementById('go-signup');
const goLogin      = document.getElementById('go-login');

function switchTo(mode) {
    const formPanel  = document.getElementById('form-panel');
    const brandPanel = document.getElementById('brand-panel');

    if (mode === 'signup') {
        // Fade out current form
        loginWrap.style.opacity = '0';
        loginWrap.style.transform = 'translateX(-20px)';

        // Slide panels
        setTimeout(() => {
            layout.classList.add('signup-mode');

            // Swap illustration with crossfade
            brandIllust.style.opacity = '0';
            brandIllust.style.transform = 'translateY(10px)';
            setTimeout(() => {
                brandIllust.src = 'solo-illustration.png';
                brandIllust.style.opacity = '1';
                brandIllust.style.transform = 'translateY(0)';
            }, 250);

            // Swap brand text
            brandHeading.style.opacity = '0';
            brandSub.style.opacity = '0';
            setTimeout(() => {
                brandHeading.innerHTML = 'Clean data starts<br/>with one scan.';
                brandSub.textContent   = 'HatCode profiles every column, catches every duplicate, flags every anomaly.';
                brandHeading.style.opacity = '1';
                brandSub.style.opacity = '1';
            }, 200);

            // Swap form
            loginWrap.classList.add('hidden-form');
            signupWrap.classList.remove('hidden-form');
            signupWrap.style.opacity = '0';
            signupWrap.style.transform = 'translateX(20px)';
            setTimeout(() => {
                signupWrap.style.opacity = '1';
                signupWrap.style.transform = 'translateX(0)';
            }, 50);

        }, 200);

    } else {
        // Fade out signup form
        signupWrap.style.opacity = '0';
        signupWrap.style.transform = 'translateX(20px)';

        setTimeout(() => {
            layout.classList.remove('signup-mode');

            // Swap illustration
            brandIllust.style.opacity = '0';
            brandIllust.style.transform = 'translateY(10px)';
            setTimeout(() => {
                brandIllust.src = 'team-illustration.png';
                brandIllust.style.opacity = '1';
                brandIllust.style.transform = 'translateY(0)';
            }, 250);

            // Swap brand text
            brandHeading.style.opacity = '0';
            brandSub.style.opacity = '0';
            setTimeout(() => {
                brandHeading.innerHTML = 'Trust starts with<br/>knowing your data.';
                brandSub.textContent   = 'Join teams who stopped guessing and started scanning.';
                brandHeading.style.opacity = '1';
                brandSub.style.opacity = '1';
            }, 200);

            // Swap form
            signupWrap.classList.add('hidden-form');
            loginWrap.classList.remove('hidden-form');
            loginWrap.style.opacity = '0';
            loginWrap.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                loginWrap.style.opacity = '1';
                loginWrap.style.transform = 'translateX(0)';
            }, 50);

        }, 200);
    }
}

goSignup?.addEventListener('click', (e) => { e.preventDefault(); switchTo('signup'); });
goLogin?.addEventListener('click',  (e) => { e.preventDefault(); switchTo('login');  });

// Init login as visible
loginWrap.classList.remove('hidden-form');
loginWrap.style.opacity = '1';
loginWrap.style.transform = 'translateX(0)';

// ─── PASSWORD TOGGLES ─────────────────────────────────────
function setupToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    const eyeOpen = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOff  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

    btn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? eyeOff : eyeOpen;
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
}

setupToggle('toggle-login-pwd',  'login-password');
setupToggle('toggle-signup-pwd', 'signup-password');

// ─── VALIDATION HELPERS ───────────────────────────────────
function showError(inputId, errorId, msg) {
    document.getElementById(inputId)?.classList.add('error');
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
}
function clearError(inputId, errorId) {
    document.getElementById(inputId)?.classList.remove('error');
    const el = document.getElementById(errorId);
    if (el) el.textContent = '';
}

['login-email','login-password','signup-name',
    'signup-email','signup-password','signup-confirm'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
        clearError(id, id + '-error');
    });
});

// ─── LOGIN SUBMIT ─────────────────────────────────────────
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let valid = true;

    if (!email) {
        showError('login-email', 'login-email-error', 'Email is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('login-email', 'login-email-error', 'Enter a valid email.'); valid = false;
    }
    if (!password) {
        showError('login-password', 'login-password-error', 'Password is required.'); valid = false;
    }
    if (!valid) return;

    const btn  = document.getElementById('login-submit');
    const text = btn.querySelector('.submit-text');
    const spin = btn.querySelector('.spinner');
    btn.disabled = true;
    text.textContent = 'Logging in…';
    spin.classList.remove('hidden');

    await new Promise(r => setTimeout(r, 1500));
    window.location.href = 'app/dashboard.html';
});

// ─── SIGNUP SUBMIT ────────────────────────────────────────
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm  = document.getElementById('signup-confirm').value;
    let valid = true;

    if (!name) {
        showError('signup-name', 'signup-name-error', 'Full name is required.'); valid = false;
    }
    if (!email) {
        showError('signup-email', 'signup-email-error', 'Email is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('signup-email', 'signup-email-error', 'Enter a valid email.'); valid = false;
    }
    if (!password || password.length < 8) {
        showError('signup-password', 'signup-password-error', 'Password must be at least 8 characters.'); valid = false;
    }
    if (confirm !== password) {
        showError('signup-confirm', 'signup-confirm-error', 'Passwords do not match.'); valid = false;
    }
    if (!valid) return;

    const btn  = document.getElementById('signup-submit');
    const text = btn.querySelector('.submit-text');
    const spin = btn.querySelector('.spinner');
    btn.disabled = true;
    text.textContent = 'Creating account…';
    spin.classList.remove('hidden');

    await new Promise(r => setTimeout(r, 1500));
    window.location.href = 'app/dashboard.html';
});