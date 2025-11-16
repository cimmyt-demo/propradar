
(function() {
  const analyticsEl = document.getElementById('admin-analytics');
  const reviewsEl = document.getElementById('admin-reviews');
  const clicksEl = document.getElementById('admin-clicks');

  function render() {
    if (analyticsEl) {
      const events = window.PR_Analytics.getAll();
      analyticsEl.innerHTML = events.slice().reverse().slice(0, 50).map(e => `
        <tr>
          <td>${new Date(e.ts).toLocaleString()}</td>
          <td>${e.type}</td>
          <td>${JSON.stringify(e.payload || {})}</td>
        </tr>
      `).join('') || '<tr><td colspan="3">No analytics events yet.</td></tr>';
    }
    if (reviewsEl) {
      const reviews = window.PR_Storage.get('reviews', []);
      reviewsEl.innerHTML = reviews.slice().reverse().map(r => `
        <tr>
          <td>${r.firmName}</td>
          <td>${r.rating}</td>
          <td>${(r.userEmail || 'Anonymous')}</td>
          <td>${new Date(r.ts).toLocaleDateString()}</td>
          <td>${r.verified ? 'Yes' : 'No'}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No reviews.</td></tr>';
    }
    if (clicksEl) {
      const clicks = window.PR_Storage.get('clicks', []);
      clicksEl.innerHTML = clicks.slice().reverse().map(c => `
        <tr>
          <td>${new Date(c.ts).toLocaleString()}</td>
          <td>${c.firmId}</td>
          <td>${c.id}</td>
          <td>${c.source || 'unknown'}</td>
        </tr>
      `).join('') || '<tr><td colspan="4">No clickouts.</td></tr>';
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
