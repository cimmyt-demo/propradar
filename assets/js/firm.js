
(function() {
  if (!window.PR_DATA) return;
  const params = new URLSearchParams(window.location.search);
  const firmId = params.get('id');
  if (!firmId) return;

  const firm = window.PR_DATA.getFirmById(firmId);
  const firmEl = document.getElementById('firm-detail');
  const challengesEl = document.getElementById('firm-challenges');
  const offersEl = document.getElementById('firm-offers');

  if (!firm || !firmEl) {
    if (firmEl) firmEl.innerHTML = '<p class="section-subtitle">Firm not found.</p>';
    return;
  }

  function renderFirm() {
    firmEl.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">${firm.name}</h1>
          <p class="section-subtitle">${firm.summary}</p>
          <div class="rating-row" style="margin-top:0.4rem;">
            <span class="rating-stars">★★★★☆</span>
            <span>${firm.rating.toFixed(1)} / 5 • ${firm.reviewsCount}+ reviews (demo)</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;">
          <span class="badge badge-pill-soft">Max allocation ≈ $${firm.maxAllocation.toLocaleString()}</span>
          <button class="btn btn-sm" id="firm-fav-btn">Save to favorites</button>
        </div>
      </div>
      <p class="section-subtitle" style="margin-top:0.6rem;">
        <strong>Country:</strong> ${firm.country} • <strong>Years active:</strong> ${firm.yearsActive}<br>
        <strong>Assets:</strong> ${firm.assets.join(', ')}<br>
        <strong>Evaluation models:</strong> ${firm.evaluationModels.join(', ')}<br>
        <strong>Platforms:</strong> ${firm.platforms.join(', ')}
      </p>
    `;
  }

  function renderChallenges() {
    if (!challengesEl) return;
    const challenges = window.PR_DATA.getChallengesByFirmId(firm.id);
    if (!challenges.length) {
      challengesEl.innerHTML = '<p class="section-subtitle">Demo data has no detailed challenges for this firm yet.</p>';
      return;
    }
    challengesEl.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Account size</th>
            <th>Steps</th>
            <th>Targets</th>
            <th>Drawdown</th>
            <th>Time limits</th>
            <th>Payout</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${challenges.map(ch => `
            <tr>
              <td>${ch.name}</td>
              <td>$${ch.accountSize.toLocaleString()}</td>
              <td>${ch.phaseCount === 1 ? '1-step' : ch.phaseCount + '-step'}</td>
              <td>${ch.profitTargetPhase1Pct}${ch.profitTargetPhase2Pct ? ' + ' + ch.profitTargetPhase2Pct : ''}%</td>
              <td>${ch.dailyDrawdownPct ? ch.dailyDrawdownPct + '%' : 'Plan-specific'} / ${ch.overallDrawdownPct ? ch.overallDrawdownPct + '%' : '-'}</td>
              <td>${ch.timeLimitDaysPhase1 || 'None'} / ${ch.timeLimitDaysPhase2 || '-'}</td>
              <td>Up to ${ch.payoutSplitPct}%</td>
              <td><button class="btn btn-sm" data-buy="${ch.id}">Buy</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderOffers() {
    if (!offersEl) return;
    const offers = window.PR_DATA.offers.filter(o => o.firmId === firm.id);
    if (!offers.length) {
      offersEl.innerHTML = '<p class="section-subtitle">No active demo offers for this firm.</p>';
      return;
    }
    offersEl.innerHTML = offers.map(o => `
      <article class="section-card-soft">
        <h3 class="section-title" style="font-size:0.95rem;">${o.title}</h3>
        <p class="section-subtitle"><strong>Code:</strong> ${o.code} • <strong>Discount:</strong> ${o.discountPct}%</p>
        <p class="section-subtitle"><strong>Expires:</strong> ${o.expiresAt}</p>
      </article>
    `).join('');
  }

  function toggleFavorite() {
    const user = window.PR_Auth.getCurrentUser();
    if (!user) {
      alert('Sign in to save favorites.');
      return;
    }
    let all = window.PR_Storage.get('favorites', []);
    const existing = all.find(f => f.userId === user.id && f.firmId === firm.id);
    if (existing) {
      all = all.filter(f => !(f.userId === user.id && f.firmId === firm.id));
    } else {
      all.push({ userId: user.id, firmId: firm.id });
      window.PR_Analytics && window.PR_Analytics.log('favorite_add', { firmId: firm.id, source: 'firm-detail' });
    }
    window.PR_Storage.set('favorites', all);
    alert('Favorites updated in demo. Check your dashboard to see the list.');
  }

  function attachHandlers() {
    if (challengesEl) {
      challengesEl.addEventListener('click', function(e) {
        const buyBtn = e.target.closest('[data-buy]');
        if (!buyBtn) return;
        const chId = buyBtn.getAttribute('data-buy');
        const click = {
          id: 'clk_' + Date.now(),
          firmId: firm.id,
          challengeId: chId,
          ts: new Date().toISOString(),
          source: 'firm-detail'
        };
        window.PR_Storage.push('clicks', click);
        window.PR_Analytics && window.PR_Analytics.log('clickout', { firmId: firm.id, challengeId: chId, source: 'firm-detail' });
        alert('Simulated redirect with tracking id: ' + click.id);
      });
    }
    const favBtn = document.getElementById('firm-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', toggleFavorite);
    }
  }

  function init() {
    renderFirm();
    renderChallenges();
    renderOffers();
    attachHandlers();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
