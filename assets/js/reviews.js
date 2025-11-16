
(function() {
  const listEl = document.getElementById('reviews-list');
  const form = document.getElementById('review-form');
  const filterSelect = document.getElementById('review-filter');
  if (!listEl) return;

  function getCurrentUser() {
    return window.PR_Auth.getCurrentUser();
  }

  function getReviews() {
    return window.PR_Storage.get('reviews', []);
  }

  function setReviews(reviews) {
    window.PR_Storage.set('reviews', reviews);
  }

  function render(filter) {
    const reviews = getReviews();
    const filtered = reviews.filter(r => {
      if (filter === 'verified') return r.verified;
      if (filter === 'unverified') return !r.verified;
      return true;
    });
    if (!filtered.length) {
      listEl.innerHTML = '<p class="section-subtitle">No reviews yet in this demo store your own locally.</p>';
      return;
    }
    listEl.innerHTML = filtered.map(r => {
      const stars = '★★★★★'.slice(0, r.rating) + '☆☆☆☆☆'.slice(r.rating);
      return `
        <article class="section-card-soft">
          <div class="rating-row">
            <span class="rating-stars">${stars}</span>
            <span>${r.rating.toFixed(1)} / 5 – ${r.firmName}</span>
            ${r.verified ? '<span class="label-pill loyalty">Verified purchase</span>' : ''}
          </div>
          <p class="section-subtitle" style="margin-top:0.4rem;">${r.text}</p>
          <p class="section-subtitle" style="margin-top:0.4rem;">– ${r.userEmail || 'Anonymous'} • ${new Date(r.ts).toLocaleDateString()}</p>
        </article>
      `;
    }).join('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(form);
    const firmId = data.get('firmId');
    const firm = window.PR_DATA.getFirmById(firmId);
    const rating = Number(data.get('rating'));
    const text = String(data.get('text') || '').trim();
    if (!firm || !rating || text.length < 30) {
      alert('Please select a firm, rating and write at least 30 characters.');
      return;
    }
    const user = getCurrentUser();
    const reviews = getReviews();
    reviews.push({
      id: 'rev_' + Date.now(),
      firmId,
      firmName: firm.name,
      rating,
      text,
      verified: false, // demo: could be updated via admin tools
      userId: user ? user.id : null,
      userEmail: user ? user.email : null,
      ts: new Date().toISOString()
    });
    setReviews(reviews);
    window.PR_Analytics && window.PR_Analytics.log('review_submit', { firmId, rating });
    form.reset();
    render(filterSelect ? filterSelect.value : 'all');
  }

  function initFirmOptions() {
    const select = document.getElementById('review-firm-select');
    if (!select || !window.PR_DATA) return;
    select.innerHTML = '<option value="">Select firm</option>' + window.PR_DATA.firms.map(f => `
      <option value="${f.id}">${f.name}</option>
    `).join('');
  }

  function init() {
    initFirmOptions();
    render('all');
    if (form) form.addEventListener('submit', handleSubmit);
    if (filterSelect) {
      filterSelect.addEventListener('change', function() {
        render(filterSelect.value);
      });
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
