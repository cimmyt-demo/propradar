
(function() {
  const form = document.getElementById('sim-form');
  const resultsEl = document.getElementById('sim-results');

  if (!form) return;

  function estimateRiskOfRuin(winRate, rr, riskPerTrade, overallLoss) {
    const p = winRate / 100;
    const q = 1 - p;
    const b = rr;
    const edge = p * b - q;
    if (edge <= 0) return 80;

    const kelly = edge / b;
    const f = (riskPerTrade / 100) || 0.01;
    const ruin = Math.min(95, Math.max(1, (overallLoss / 100) / (kelly * 4) * 100));
    return Math.round(ruin);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(form);

    const account = Number(data.get('account'));
    const dailyLoss = Number(data.get('dailyLoss'));
    const overallLoss = Number(data.get('overallLoss'));
    const profitTarget = Number(data.get('profitTarget'));
    const riskPerTrade = Number(data.get('riskPerTrade'));
    const winRate = Number(data.get('winRate'));
    const rr = Number(data.get('rr'));

    const dailyLossAmount = account * (dailyLoss / 100);
    const overallLossAmount = account * (overallLoss / 100);
    const targetAmount = account * (profitTarget / 100);
    const approxTradesToTarget = Math.round(profitTarget / (riskPerTrade * (winRate / 100 * rr - (1 - winRate / 100))));
    const riskOfRuin = estimateRiskOfRuin(winRate, rr, riskPerTrade, overallLoss);
    const suggestedRisk = Math.max(0.2, Math.min(1.5, (dailyLoss / 5)));

    resultsEl.innerHTML = `
      <div class="grid grid-2" style="margin-bottom:0.9rem;">
        <div>
          <div class="card-title">Daily loss limit</div>
          <div class="card-value">$${dailyLossAmount.toLocaleString()}</div>
          <div class="section-subtitle" style="margin-top:0.3rem;">${dailyLoss.toFixed(1)}% of account</div>
        </div>
        <div>
          <div class="card-title">Overall loss limit</div>
          <div class="card-value">$${overallLossAmount.toLocaleString()}</div>
          <div class="section-subtitle" style="margin-top:0.3rem;">${overallLoss.toFixed(1)}% of account</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:0.9rem;">
        <div>
          <div class="card-title">Profit target</div>
          <div class="card-value">$${targetAmount.toLocaleString()}</div>
          <div class="section-subtitle" style="margin-top:0.3rem;">${profitTarget.toFixed(1)}% of account</div>
        </div>
        <div>
          <div class="card-title">Risk of ruin (rough)</div>
          <div class="card-value" style="color:${riskOfRuin > 25 ? '#fecaca' : '#bbf7d0'};">${riskOfRuin}%</div>
          <div class="section-subtitle" style="margin-top:0.3rem;">
            Based on win rate ${winRate.toFixed(0)}% and R:R ${rr.toFixed(2)}.
          </div>
        </div>
      </div>

      <div class="section-card-soft" style="margin-bottom:0.8rem;">
        <h3 class="section-title" style="font-size:0.9rem;margin-bottom:0.4rem;">Risk per trade guidance</h3>
        <p class="section-subtitle" style="margin-bottom:0.4rem;">
          With a daily loss limit of ${dailyLoss.toFixed(1)}%, keeping risk per trade around
          <strong style="color:#e5e7eb;">${suggestedRisk.toFixed(2)}%</strong> helps avoid
          violating rules after just a small cluster of losing trades.
        </p>
        <p class="section-subtitle">
          If your current risk per trade of ${riskPerTrade.toFixed(2)}% is much higher than this,
          consider adjusting size or using a hard session stop.
        </p>
      </div>

      <div class="section-card-soft">
        <h3 class="section-title" style="font-size:0.9rem;margin-bottom:0.4rem;">Path to target</h3>
        <p class="section-subtitle">
          Very rough estimate of trades to reach the profit target assuming you respect all loss
          limits and maintain your stated edge:
        </p>
        <p class="section-subtitle" style="margin-top:0.4rem;">
          ~<strong style="color:#e5e7eb;">${!isFinite(approxTradesToTarget) || approxTradesToTarget < 0 ? 'N/A' : approxTradesToTarget}</strong> trades
          to reach ${profitTarget.toFixed(1)}% with your inputs.
        </p>
      </div>
    `;
  });
})();
