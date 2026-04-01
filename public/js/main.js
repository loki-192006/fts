// ForexPro - Main JS

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}

// Animated counter
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = parseFloat(start.toFixed(2)).toLocaleString();
  }, 16);
}

// Animate counters on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-counter'));
    if (!isNaN(target)) animateCounter(el, target);
  });

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
});

// Trade form calculator
const amountInput = document.getElementById('trade-amount');
const baseCurrencySelect = document.getElementById('base-currency');
const targetCurrencySelect = document.getElementById('target-currency');
const calcResult = document.getElementById('calc-result');

function calculateTrade() {
  const amount = parseFloat(amountInput?.value) || 0;
  const base = baseCurrencySelect?.value;
  const target = targetCurrencySelect?.value;
  if (!amount || !base || !target || !calcResult) return;

  const ratesData = window.RATES_DATA || {};
  const baseRate = ratesData[base] || 1;
  const targetRate = ratesData[target] || 1;
  const exchangeRate = targetRate / baseRate;
  const total = amount * exchangeRate;

  document.getElementById('calc-rate').textContent = exchangeRate.toFixed(6);
  document.getElementById('calc-total').textContent = total.toFixed(4) + ' ' + target;
  document.getElementById('calc-fee').textContent = (total * 0.001).toFixed(4) + ' ' + target;
  calcResult.classList.add('show');
}

if (amountInput) amountInput.addEventListener('input', calculateTrade);
if (baseCurrencySelect) baseCurrencySelect.addEventListener('change', calculateTrade);
if (targetCurrencySelect) targetCurrencySelect.addEventListener('change', calculateTrade);

// Trade type selector
document.querySelectorAll('.trade-type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.trade-type-btn').forEach(b => b.classList.remove('active-buy', 'active-sell'));
    const type = this.dataset.type;
    this.classList.add(type === 'buy' ? 'active-buy' : 'active-sell');
    const hiddenInput = document.getElementById('trade-type-hidden');
    if (hiddenInput) hiddenInput.value = type;
  });
});

// Dashboard Chart
function initDashboardChart() {
  const ctx = document.getElementById('marketChart');
  if (!ctx) return;
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const datasets = [
    { label: 'EUR/USD', data: [0.91,0.89,0.92,0.94,0.91,0.93,0.92,0.95,0.91,0.90,0.92,0.92], borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.1)', tension: 0.4, fill: true, borderWidth: 2 },
    { label: 'GBP/USD', data: [0.77,0.80,0.78,0.79,0.82,0.80,0.79,0.81,0.78,0.79,0.80,0.79], borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.05)', tension: 0.4, fill: true, borderWidth: 2 }
  ];
  new Chart(ctx, {
    type: 'line', data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Sora', size: 11 }, boxWidth: 20 } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } } }
      }
    }
  });
}

function initPortfolioChart() {
  const ctx = document.getElementById('portfolioChart');
  if (!ctx) return;
  const labels = window.PORTFOLIO_LABELS || [];
  const data = window.PORTFOLIO_DATA || [];
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: ['#14b8a6','#22d3ee','#22c55e','#f59e0b','#ef4444','#a78bfa'], borderColor: 'transparent', borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Sora', size: 11 }, padding: 16 } } },
      cutout: '70%'
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboardChart();
  initPortfolioChart();
});
