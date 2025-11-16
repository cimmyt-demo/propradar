
(function() {
  const listEl = document.getElementById('firm-directory-list');
  const form = document.getElementById('firm-filters');
  if (!listEl || !window.PR_DATA) return;

  const allFirms = window.PR_DATA.firms;

  function getFavorites() {
    const user = window.PR_Auth.getCurrentUser();
    if (!user) return [];
    const all = window.PR_Storage.get('favorites', []);
    return all.filter(f => f.userId === user.id).map(f => f.firmId);
  }

  function toggleFavorite(firmId) {
    const user = window.PR_Auth.getCurrentUser();
    if (!user) {
      alert('Sign in first to save favorites.');
      return;
    }
    let all = window.PR_Storage.get('favorites', []);
    const existing = all.find(f => f.userId === user.id && f.firmId === firmId);
    if (existing) {
      all = all.filter(f => !(f.userId === user.id && f.firmId === firmId));
    } else {
      all.push({ userId: user.id, firmId });
      window.PR_Analytics && window.PR_Analytics.log('favorite_add', { firmId });
    }
    window.PR_Storage.set('favorites', all);
    render(applyFilters());
  }

  function applyFilters() {
    if (!form) return allFirms;
    const data = new FormData(form);
    const asset = data.get('asset');
    const model = data.get('model');
    const platform = data.get('platform');

    return allFirms.filter(f => {
      if (asset) {
        if (asset === 'multi') {
          if (f.assets.length < 2) return false;
        } else if (!f.assets.includes(asset)) {
          return false;
        }
      }
      if (model && !f.evaluationModels.includes(model === '1step' ? '1step' : model === '2step' ? '2step' : 'instant')) return false;
      if (platform) {
        if (platform === 'mt') {
          if (!f.platforms.some(p => p.startsWith('mt'))) return false;
        } else if (platform === 'futures') {
          if (!f.platforms.includes('futures')) return false;
        } else if (platform === 'ctrader') {
          if (!f.platforms.includes('ctrader')) return false;
        }
      }
      return true;
    });
  }

  function handleClickout(firmId) {
    const click = {
      id: 'clk_' + Date.now(),
      firmId,
      ts: new Date().toISOString(),
      user: window.PR_Auth.getCurrentUser()
    };
    window.PR_Storage.push('clicks', click);
    window.PR_Analytics && window.PR_Analytics.log('clickout', { firmId });
    alert('Simulated redirect to firm website with tracking id: ' + click.id);
  }

  function render(firms) {
    const favorites = getFavorites();
    listEl.innerHTML = firms.map(firm => {
      const isFav = favorites.includes(firm.id);
      const assets = firm.assets.join(', ');
      const models = firm.evaluationModels.join(', ');
      const platforms = firm.platforms.join(', ');
      return `
      <article class="section-card">
        <div class="section-header" style="margin-bottom:0.4rem;">
          <div>
            <h2 class="section-title" style="font-size:0.95rem;">
              <a href="firm.html?id=${firm.id}">${firm.name}</a>
            </h2>
            <div class="rating-row">
              <span class="rating-stars">★★★★☆</span>
              <span>${firm.rating.toFixed(1)} / 5 • ${firm.reviewsCount}+ reviews (demo)</span>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.25rem;">
            <span class="badge badge-pill-soft">Max allocation ≈ $${firm.maxAllocation.toLocaleString()}</span>
            <button type="button" class="btn btn-sm" data-favorite="${firm.id}">
              ${isFav ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        </div>
        <p class="section-subtitle" style="margin-bottom:0.5rem;">${firm.summary}</p>
        <p class="section-subtitle" style="margin-bottom:0.35rem;">
          <strong>Assets:</strong> ${assets}<br>
          <strong>Models:</strong> ${models}<br>
          <strong>Platforms:</strong> ${platforms}<br>
          <strong>Region (demo):</strong> ${firm.country}
        </p>
        <div class="chip-row" style="margin-bottom:0.5rem;">
          ${firm.assets.map(a => `<span class="chip">${a}</span>`).join('')}
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-sm" data-buy="${firm.id}">Buy via partner</button>
          <a href="compare.html?add=${firm.id}" class="btn btn-sm">Add to comparison</a>
          <a href="firm.html?id=${firm.id}" class="btn btn-sm">View firm details</a>
        </div>
      </article>
      `;
    }).join('');
  }

  function attachHandlers() {
    listEl.addEventListener('click', function(e) {
      const favBtn = e.target.closest('[data-favorite]');
      if (favBtn) {
        const firmId = favBtn.getAttribute('data-favorite');
        toggleFavorite(firmId);
        return;
      }
      const buyBtn = e.target.closest('[data-buy]');
      if (buyBtn) {
        const firmId = buyBtn.getAttribute('data-buy');
        handleClickout(firmId);
      }
    });
  }

  function init() {
    const firms = applyFilters();
    render(firms);
    attachHandlers();
    if (form) {
      form.addEventListener('change', function() {
        render(applyFilters());
      });
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
