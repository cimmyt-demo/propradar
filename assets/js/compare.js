
(function() {
  const tableBody = document.getElementById('compare-tbody');
  if (!tableBody || !window.PR_DATA) return;

  const allFirms = window.PR_DATA.firms;
  const allChallenges = window.PR_DATA.challenges;

  function getSelectedFirmIds() {
    const params = new URLSearchParams(window.location.search);
    const add = params.getAll('add');
    const idsParam = params.get('firms');
    const ids = new Set();
    add.forEach(id => ids.add(id));
    if (idsParam) {
      idsParam.split(',').forEach(id => ids.add(id));
    }
    if (ids.size === 0) {
      // default: pick a few major firms
      ['ftmo', 'the5ers', 'fundednext'].forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }

  function getPrimaryChallengeForFirm(firmId) {
    const challenge = allChallenges.find(c => c.firmId === firmId);
    return challenge || null;
  }

  function render() {
    const firmIds = getSelectedFirmIds();
    const rowsHtml = firmIds.map(id => {
      const firm = allFirms.find(f => f.id === id);
      if (!firm) return '';
      const ch = getPrimaryChallengeForFirm(id);
      if (!ch) return '';
      return `
        <tr>
          <td>${firm.name}</td>
          <td>${ch.name}</td>
          <td>${ch.phaseCount === 1 ? '1-step' : ch.phaseCount === 2 ? '2-step' : ch.phaseCount + '-step'}</td>
          <td>$${ch.accountSize.toLocaleString()}</td>
          <td>${ch.profitTargetPhase1Pct}${ch.profitTargetPhase2Pct ? ' + ' + ch.profitTargetPhase2Pct : ''}%</td>
          <td>${ch.dailyDrawdownPct ? ch.dailyDrawdownPct + '%' : 'Plan-specific'}</td>
          <td>${ch.overallDrawdownPct ? ch.overallDrawdownPct + '%' : 'Plan-specific'}</td>
          <td>${ch.timeLimitDaysPhase1 || 'None'} / ${ch.timeLimitDaysPhase2 || '-'} days</td>
          <td>Up to ${ch.payoutSplitPct}%</td>
          <td>
            <button class="btn btn-sm" data-buy="${firm.id}">Buy via ${firm.name}</button>
          </td>
        </tr>
      `;
    }).join('');
    tableBody.innerHTML = rowsHtml || '<tr><td colspan="10">No firms selected.</td></tr>';
  }

  function attachHandlers() {
    tableBody.addEventListener('click', function(e) {
      const buyBtn = e.target.closest('[data-buy]');
      if (!buyBtn) return;
      const firmId = buyBtn.getAttribute('data-buy');
      const click = {
        id: 'clk_' + Date.now(),
        firmId,
        ts: new Date().toISOString(),
        source: 'compare'
      };
      window.PR_Storage.push('clicks', click);
      window.PR_Analytics && window.PR_Analytics.log('clickout', { firmId, source: 'compare' });
      alert('Simulated redirect to firm with tracking id: ' + click.id);
    });
  }

  function init() {
    render();
    attachHandlers();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
