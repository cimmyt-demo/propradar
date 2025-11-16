
(function() {
  const balanceEl = document.getElementById('loyalty-balance');
  const historyEl = document.getElementById('loyalty-history');
  const redeemSelect = document.getElementById('loyalty-redeem-select');
  const redeemButton = document.getElementById('loyalty-redeem-btn');
  const proofForm = document.getElementById('loyalty-proof-form');

  function currentUser() {
    return window.PR_Auth.getCurrentUser();
  }

  function getLedger() {
    return window.PR_Storage.get('points_ledger', []);
  }

  function setLedger(ledger) {
    window.PR_Storage.set('points_ledger', ledger);
  }

  function getUserEntries(userId) {
    return getLedger().filter(e => e.userId === userId);
  }

  function getUserBalance(userId) {
    return getUserEntries(userId).reduce((sum, e) => sum + e.delta, 0);
  }

  function addEntry(entry) {
    const ledger = getLedger();
    ledger.push(entry);
    setLedger(ledger);
  }

  function render() {
    const user = currentUser();
    if (!user) {
      if (balanceEl) balanceEl.textContent = 'Sign in to see your loyalty balance.';
      if (historyEl) historyEl.innerHTML = '';
      return;
    }
    const entries = getUserEntries(user.id);
    const balance = getUserBalance(user.id);
    if (balanceEl) balanceEl.textContent = balance + ' pts';
    if (historyEl) {
      if (!entries.length) {
        historyEl.innerHTML = '<p class="section-subtitle">No loyalty activity yet. Buy a challenge via a partner and upload proof to start earning.</p>';
      } else {
        historyEl.innerHTML = entries.slice().reverse().map(e => `
          <tr>
            <td>${new Date(e.ts).toLocaleDateString()}</td>
            <td>${e.type}</td>
            <td>${e.description || ''}</td>
            <td>${e.delta > 0 ? '+' : ''}${e.delta}</td>
          </tr>
        `).join('');
      }
    }
  }

  function initRedeemOptions() {
    if (!redeemSelect) return;
    redeemSelect.innerHTML = '<option value="">Select reward</option>' + window.PR_DATA.rewardTiers.map(t => `
      <option value="${t.points}">${t.label} (${t.points} pts)</option>
    `).join('');
  }

  function handleRedeem() {
    const user = currentUser();
    if (!user) {
      alert('Sign in to redeem rewards.');
      return;
    }
    const pointsStr = redeemSelect.value;
    if (!pointsStr) {
      alert('Select a reward to redeem.');
      return;
    }
    const cost = Number(pointsStr);
    const balance = getUserBalance(user.id);
    if (balance < cost) {
      alert('Not enough points.');
      return;
    }
    const tier = window.PR_DATA.rewardTiers.find(t => t.points === cost);
    addEntry({
      id: 'pts_' + Date.now(),
      userId: user.id,
      delta: -cost,
      type: 'Redemption',
      description: tier ? tier.label : 'Reward',
      ts: new Date().toISOString()
    });
    window.PR_Analytics && window.PR_Analytics.log('loyalty_redeem', { cost, label: tier && tier.label });
    alert('Redeemed: ' + (tier && tier.label) + '. In a production system this would issue a coupon or voucher.');
    render();
  }

  function handleProofSubmit(e) {
    e.preventDefault();
    const user = currentUser();
    if (!user) {
      alert('Sign in to submit proof.');
      return;
    }
    const data = new FormData(proofForm);
    const firmId = data.get('firmId');
    const price = Number(data.get('price'));
    const firm = window.PR_DATA.getFirmById(firmId);
    if (!firm || !price) {
      alert('Select a firm and enter price.');
      return;
    }
    // Very rough: compute base points from price buckets, auto-approve in this demo
    const bucket = window.PR_DATA.priceToPointsBuckets.find(b => price >= b.min && price <= b.max);
    const points = bucket ? bucket.points : 0;
    if (!points) {
      alert('Price out of demo buckets; no points credited.');
      return;
    }
    addEntry({
      id: 'pts_' + Date.now(),
      userId: user.id,
      delta: points,
      type: 'Purchase',
      description: 'Proof for ' + firm.name + ' (' + price.toFixed(2) + ')',
      ts: new Date().toISOString()
    });
    window.PR_Analytics && window.PR_Analytics.log('loyalty_earn', { firmId, price, points });
    alert('Demo: proof accepted and ' + points + ' pts credited.');
    proofForm.reset();
    render();
  }

  function init() {
    initRedeemOptions();
    render();
    if (redeemButton) redeemButton.addEventListener('click', handleRedeem);
    if (proofForm) proofForm.addEventListener('submit', handleProofSubmit);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
