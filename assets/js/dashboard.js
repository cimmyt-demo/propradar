
(function() {
  const summaryEl = document.getElementById('dash-summary');
  const favEl = document.getElementById('dash-favorites');
  const reviewEl = document.getElementById('dash-reviews');
  const loyaltyBalanceEl = document.getElementById('dash-loyalty');

  function user() {
    return window.PR_Auth.getCurrentUser();
  }

  function render() {
    const u = user();
    if (!u) {
      if (summaryEl) summaryEl.innerHTML = '<p class="section-subtitle">Sign in to see your dashboard.</p>';
      if (favEl) favEl.innerHTML = '';
      if (reviewEl) reviewEl.innerHTML = '';
      if (loyaltyBalanceEl) loyaltyBalanceEl.textContent = '0 pts';
      return;
    }

    const favorites = window.PR_Storage.get('favorites', []).filter(f => f.userId === u.id);
    const reviews = window.PR_Storage.get('reviews', []).filter(r => r.userId === u.id);
    const ledger = window.PR_Storage.get('points_ledger', []).filter(e => e.userId === u.id);
    const balance = ledger.reduce((sum, e) => sum + e.delta, 0);

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="grid grid-3">
          <div class="section-card">
            <div class="card-title">Favorite firms</div>
            <div class="card-value">${favorites.length}</div>
          </div>
          <div class="section-card">
            <div class="card-title">Reviews written</div>
            <div class="card-value">${reviews.length}</div>
          </div>
          <div class="section-card">
            <div class="card-title">Loyalty balance</div>
            <div class="card-value">${balance} pts</div>
          </div>
        </div>
      `;
    }

    if (favEl) {
      if (!favorites.length) {
        favEl.innerHTML = '<p class="section-subtitle">No favorites yet.</p>';
      } else {
        favEl.innerHTML = '<ul class="section-subtitle" style="padding-left:1rem;">' + favorites.map(f => {
          const firm = window.PR_DATA.getFirmById(f.firmId);
          return `<li><a href="firm.html?id=${f.firmId}">${firm ? firm.name : f.firmId}</a></li>`;
        }).join('') + '</ul>';
      }
    }

    if (reviewEl) {
      if (!reviews.length) {
        reviewEl.innerHTML = '<p class="section-subtitle">No reviews yet.</p>';
      } else {
        reviewEl.innerHTML = reviews.slice().reverse().map(r => `
          <article class="section-card-soft">
            <div class="rating-row">
              <span class="rating-stars">${'★★★★★'.slice(0, r.rating)}</span>
              <span>${r.rating.toFixed(1)} / 5 – ${r.firmName}</span>
            </div>
            <p class="section-subtitle" style="margin-top:0.4rem;">${r.text}</p>
          </article>
        `).join('');
      }
    }

    if (loyaltyBalanceEl) {
      loyaltyBalanceEl.textContent = balance + ' pts';
    }
  }

  function init() {
    render();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
