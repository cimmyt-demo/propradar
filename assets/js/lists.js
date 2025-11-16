
(function() {
  if (!window.PR_DATA) return;
  const firms = window.PR_DATA.firms;

  function renderList(containerId, filterFn) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const filtered = firms.filter(filterFn);
    el.innerHTML = filtered.map(firm => `
      <article class="section-card">
        <h3 class="section-title" style="font-size:0.95rem;">
          <a href="firm.html?id=${firm.id}">${firm.name}</a>
        </h3>
        <p class="section-subtitle">${firm.summary}</p>
        <p class="section-subtitle">
          Rating: ${firm.rating.toFixed(1)} / 5 • ${firm.reviewsCount}+ reviews<br>
          Max allocation: ≈ $${firm.maxAllocation.toLocaleString()}<br>
          Assets: ${firm.assets.join(', ')}
        </p>
      </article>
    `).join('');
  }

  function init() {
    renderList('list-futures', f => f.assets.includes('futures'));
    renderList('list-crypto', f => f.assets.includes('crypto'));
    renderList('list-toprated', f => f.rating >= 4.5);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
