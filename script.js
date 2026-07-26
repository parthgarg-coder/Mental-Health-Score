/* =========================================================
   MindPredict — script.js
   Vanilla JS: form validation, FastAPI integration, result
   gauge animation, toasts, dark mode, and nav interactions.
   ========================================================= */

'use strict';

/* ---------- Config ---------- */
const API_BASE = 'http://127.0.0.1:8000';
const PREDICT_ENDPOINT = `${API_BASE}/predict`;

/* Field definitions: id -> validation rule.
   `name` must match the FastAPI request body exactly. */
const FIELD_RULES = {
    age: { name: 'age', type: 'int', min: 10, max: 100, label: 'Age' },
    gender: { name: 'gender', type: 'select', label: 'Gender' },
    country: { name: 'country', type: 'text', label: 'Country' },
    academicLevel: { name: 'academic_level', type: 'select', label: 'Academic level' },
    platform: { name: 'most_used_platform', type: 'select', label: 'Most used platform' },
    purpose: { name: 'purpose_of_use', type: 'select', label: 'Purpose of use' },
    usageHours: { name: 'avg_daily_usage_hours', type: 'float', min: 0, max: 24, label: 'Average daily usage' },
    unlocks: { name: 'daily_unlocks', type: 'int', min: 0, max: null, label: 'Daily unlocks' },
    studyHours: { name: 'study_hours', type: 'float', min: 0, max: 24, label: 'Study hours' },
    activityHours: { name: 'physical_activity_hours', type: 'float', min: 0, max: 24, label: 'Physical activity hours' },
    sleepHours: { name: 'sleep_hours_per_night', type: 'float', min: 0, max: 24, label: 'Sleep hours' },
    stress: { name: 'stress_level', type: 'select', label: 'Stress level' },
};

/* ---------- DOM references ---------- */
const form = document.getElementById('predictorForm');
const submitBtn = document.getElementById('submitBtn');
const btnSpinner = document.getElementById('btnSpinner');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('result');
const gaugeProgress = document.getElementById('gaugeProgress');
const scoreValueEl = document.getElementById('scoreValue');
const resultMessage = document.getElementById('resultMessage');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
const ctaStart = document.getElementById('ctaStart');

const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 86; // r = 86, matches SVG

/* =========================================================
   Validation
   ========================================================= */

/** Validate a single field element against its rule. Returns an error string, or '' if valid. */
function validateField(id) {
    const rule = FIELD_RULES[id];
    const el = document.getElementById(id);
    if (!el || !rule) return '';

    const rawValue = el.value;

    if (rule.type === 'select') {
        if (!rawValue) return `Please select a ${rule.label.toLowerCase()}.`;
        return '';
    }

    if (rule.type === 'text') {
        if (!rawValue || !rawValue.trim()) return `${rule.label} is required.`;
        if (rawValue.trim().length < 2) return `${rule.label} looks too short.`;
        return '';
    }

    // Numeric fields (int / float)
    if (rawValue === '' || rawValue === null) return `${rule.label} is required.`;
    const num = Number(rawValue);
    if (Number.isNaN(num)) return `${rule.label} must be a number.`;
    if (rule.type === 'int' && !Number.isInteger(num)) return `${rule.label} must be a whole number.`;
    if (rule.min !== undefined && rule.min !== null && num < rule.min) return `${rule.label} must be at least ${rule.min}.`;
    if (rule.max !== undefined && rule.max !== null && num > rule.max) return `${rule.label} must be at most ${rule.max}.`;

    return '';
}

/** Show or clear the error state for a field. */
function applyFieldValidation(id) {
    const error = validateField(id);
    const group = document.getElementById(id).closest('.field-group');
    const errorEl = document.getElementById(`err-${id}`);

    if (error) {
        group.classList.add('invalid');
        errorEl.textContent = error;
    } else {
        group.classList.remove('invalid');
        errorEl.textContent = '';
    }
    return !error;
}

/** Validate every field in the form. Returns true only if all fields pass. */
function validateAllFields() {
    let allValid = true;
    Object.keys(FIELD_RULES).forEach((id) => {
        const valid = applyFieldValidation(id);
        if (!valid) allValid = false;
    });
    return allValid;
}

/** Build the JSON payload expected by the FastAPI /predict endpoint. */
function buildPayload() {
    const payload = {};
    Object.entries(FIELD_RULES).forEach(([id, rule]) => {
        const el = document.getElementById(id);
        if (rule.type === 'int') payload[rule.name] = parseInt(el.value, 10);
        else if (rule.type === 'float') payload[rule.name] = parseFloat(el.value);
        else payload[rule.name] = el.value.trim ? el.value.trim() : el.value;
    });
    return payload;
}

/* Attach live validation + floating-label state to every field */
Object.keys(FIELD_RULES).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => applyFieldValidation(id));
    el.addEventListener('input', () => {
        // Only re-validate live once the user has already seen an error,
        // so we don't flag empty fields before they've had a chance to type.
        const group = el.closest('.field-group');
        if (group.classList.contains('invalid')) applyFieldValidation(id);
    });

    if (el.tagName === 'SELECT') {
        el.addEventListener('change', () => {
            el.classList.toggle('has-value', Boolean(el.value));
            applyFieldValidation(id);
        });
    }
});

/* =========================================================
   Toast notifications
   ========================================================= */

function showToast(message, type = 'info', duration = 4200) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    window.setTimeout(() => {
        toast.classList.add('leaving');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
}

/* =========================================================
   Result gauge
   ========================================================= */

function colorForScore(score) {
    if (score >= 80) return getComputedStyle(document.documentElement).getPropertyValue('--success').trim();
    if (score >= 60) return getComputedStyle(document.documentElement).getPropertyValue('--warning').trim();
    return getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();
}

function messageForScore(score) {
    if (score >= 80) return 'Excellent! Your digital habits appear well balanced.';
    if (score >= 60) return "You're doing okay, but there's room to improve your habits.";
    return 'Consider reducing screen time and improving sleep and study balance.';
}

/** Animate the circular gauge and count-up score readout. */
function renderResult(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const offset = GAUGE_CIRCUMFERENCE - (clamped / 100) * GAUGE_CIRCUMFERENCE;

    gaugeProgress.style.stroke = colorForScore(clamped);
    // Force reflow so the transition reliably animates from the reset state.
    gaugeProgress.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE}`;
    gaugeProgress.style.strokeDashoffset = `${GAUGE_CIRCUMFERENCE}`;
    requestAnimationFrame(() => {
        gaugeProgress.style.strokeDashoffset = `${offset}`;
    });

    animateCountUp(score);
    resultMessage.textContent = messageForScore(clamped);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function animateCountUp(target) {
    const durationMs = 1100;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        scoreValueEl.textContent = (target * eased).toFixed(2);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* =========================================================
   Form submission
   ========================================================= */

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnSpinner.hidden = !isLoading;
    submitBtn.querySelector('.btn-label').textContent = isLoading ? 'Predicting…' : 'Predict Score';
}

async function handlePredictSubmit(event) {
    event.preventDefault();

    if (!validateAllFields()) {
        showToast('Please fix the highlighted fields before submitting.', 'error');
        const firstInvalid = form.querySelector('.field-group.invalid input, .field-group.invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    const payload = buildPayload();
    setLoading(true);

    try {
        const response = await fetch(PREDICT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const message = await extractErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();
        renderResult(data.predicted_mental_health_score);
        showToast('Prediction complete.', 'success');
    } catch (err) {
        // Distinguish a network failure (backend unreachable) from a backend error response.
        if (err instanceof TypeError) {
            showToast('Could not reach the prediction server. Is the backend running?', 'error', 6000);
        } else {
            showToast(err.message || 'Something went wrong while predicting your score.', 'error', 6000);
        }
    } finally {
        setLoading(false);
    }
}

/** Pull a readable message out of a FastAPI error response (validation or generic). */
async function extractErrorMessage(response) {
    try {
        const data = await response.json();
        if (Array.isArray(data.detail)) {
            // FastAPI/Pydantic validation error array
            const first = data.detail[0];
            const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : 'field';
            return `${field}: ${first.msg}`;
        }
        if (typeof data.detail === 'string') return data.detail;
        return `Server responded with status ${response.status}.`;
    } catch {
        return `Server responded with status ${response.status}.`;
    }
}

/* =========================================================
   Reset
   ========================================================= */

function resetForm() {
    form.reset();
    Object.keys(FIELD_RULES).forEach((id) => {
        const el = document.getElementById(id);
        const group = el.closest('.field-group');
        group.classList.remove('invalid');
        document.getElementById(`err-${id}`).textContent = '';
        if (el.tagName === 'SELECT') el.classList.remove('has-value');
    });
    resultSection.hidden = true;
    showToast('Form reset.', 'info', 2200);
}

/* =========================================================
   Dark mode
   ========================================================= */

function applyStoredTheme() {
    const stored = localStorage.getItem('mindpredict-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('mindpredict-theme', next);
}

/* =========================================================
   Mobile nav + smooth scroll
   ========================================================= */

function toggleMobileNav() {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileNav() {
    navLinks.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
}

/* =========================================================
   Init
   ========================================================= */

function init() {
    applyStoredTheme();
    document.getElementById('year').textContent = new Date().getFullYear();

    form.addEventListener('submit', handlePredictSubmit);
    resetBtn.addEventListener('click', resetForm);
    tryAgainBtn.addEventListener('click', () => {
        resultSection.hidden = true;
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
    });

    themeToggle.addEventListener('click', toggleTheme);
    navBurger.addEventListener('click', toggleMobileNav);
    navLinks.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', closeMobileNav));

    ctaStart.addEventListener('click', () => {
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('age').focus({ preventScroll: true });
    });
}

document.addEventListener('DOMContentLoaded', init);