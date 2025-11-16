
(function() {
  const form = document.getElementById('quiz-form');
  const resultsEl = document.getElementById('quiz-results');
  const introEl = document.getElementById('quiz-results-intro');

  if (!form) return;

  // Simple profile-aware firm list.
  // Data is approximate and for demo only – always verify rules on the firm site or via PropFirmMatch.
  const firms = [
    {
      id: 'ftmo',
      name: 'FTMO',
      baseMatch: 0.9,
      styleFit: ['intraday', 'swing'],
      markets: ['forex', 'indices', 'crypto'],
      tags: ['2-step evaluation', 'Up to ~200k account size', 'Multi-asset'],
      desc: 'Well known 2-step evaluation for disciplined FX and indices traders with clear risk rules.'
    },
    {
      id: 'the5ers',
      name: 'The5ers',
      baseMatch: 0.88,
      styleFit: ['swing', 'intraday'],
      markets: ['forex'],
      tags: ['1-step & 2-step', 'Instant funding style programs', 'Scaling paths'],
      desc: 'Offers 1-step, 2-step and instant-style funding for traders who prefer progressive scaling.'
    },
    {
      id: 'fundednext',
      name: 'FundedNext',
      baseMatch: 0.86,
      styleFit: ['intraday', 'swing'],
      markets: ['forex', 'futures'],
      tags: ['1-step & 2-step', 'Instant programs', 'Global trader base'],
      desc: 'Multi-asset funding with different evaluation tracks and competitive payout splits.'
    },
    {
      id: 'e8',
      name: 'E8 Markets',
      baseMatch: 0.85,
      styleFit: ['intraday', 'swing'],
      markets: ['forex', 'futures'],
      tags: ['1-, 2-, 3-step', 'High max allocation', 'Active trader focus'],
      desc: 'Higher potential allocation with several challenge formats for active traders.'
    },
    {
      id: 'fundingpips',
      name: 'FundingPips',
      baseMatch: 0.84,
      styleFit: ['intraday'],
      markets: ['forex', 'crypto'],
      tags: ['2-step evaluation', 'Up to ~300k allocation', 'Rule-focused'],
      desc: 'Straightforward 2-step evaluations for FX and indices traders who like clear rules.'
    },
    {
      id: 'ftp',
      name: 'Funded Trading Plus',
      baseMatch: 0.83,
      styleFit: ['intraday', 'swing'],
      markets: ['forex'],
      tags: ['1-step, 2-step & instant', 'Various account sizes', 'Beginner-friendly'],
      desc: 'FX-focused prop with multiple evaluation paths including 1-step, 2-step and instant options.'
    },
    {
      id: 'apex',
      name: 'Apex Trader Funding',
      baseMatch: 0.82,
      styleFit: ['intraday'],
      markets: ['futures'],
      tags: ['1-step evaluation', 'Futures only', 'Frequent promos'],
      desc: 'Futures-only firm known for 1-step evaluations and aggressive promotional discounts.'
    },
    {
      id: 'topstep',
      name: 'Topstep',
      baseMatch: 0.81,
      styleFit: ['intraday'],
      markets: ['futures'],
      tags: ['1-step combine', 'Education-focused', 'Long-running brand'],
      desc: 'Legacy futures prop firm with a rules-heavy combine and emphasis on trader development.'
    },
    {
      id: 'myfundedfutures',
      name: 'MyFundedFutures',
      baseMatch: 0.8,
      styleFit: ['intraday'],
      markets: ['futures'],
      tags: ['1-step evaluation', 'High profit splits', 'Simple rule set'],
      desc: 'Futures prop firm with straightforward 1-step evaluations and competitive payout terms.'
    },
    {
      id: 'vortex',
      name: 'VortexCapital (demo)',
      baseMatch: 0.78,
      styleFit: ['swing', 'intraday'],
      markets: ['forex', 'indices', 'futures'],
      tags: ['Example firm', 'Demo-only listing'],
      desc: 'Placeholder firm used to show how custom/private firms could appear in your own directory.'
    }
  ];

  function computeScores(profile) {
    return firms.map(firm => {
      let score = firm.baseMatch;

      if (firm.markets.includes(profile.market)) score += 0.03;
      if (firm.styleFit.includes(profile.holding)) score += 0.03;

      if (profile.preference === 'flexibleRules') {
        if (['the5ers', 'fundednext', 'ftp'].includes(firm.id)) score += 0.02;
      }
      if (profile.preference === 'maxPayouts') {
        if (['fundednext', 'myfundedfutures', 'apex'].includes(firm.id)) score += 0.02;
      }

      if (profile.accountSize === 'large' && ['ftmo', 'e8', 'fundednext'].includes(firm.id)) {
        score += 0.02;
      }

      if (profile.experience === 'new' && ['ftp', 'the5ers'].includes(firm.id)) {
        score += 0.02;
      }

      if (profile.riskPerTrade === 'high' && ['apex', 'myfundedfutures'].includes(firm.id)) {
        score += 0.02;
      }
      if (profile.riskPerTrade === 'low' && ['ftmo', 'topstep'].includes(firm.id)) {
        score += 0.02;
      }

      score = Math.max(0, Math.min(0.99, score));
      return { firm, score };
    }).sort((a, b) => b.score - a.score);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = new FormData(form);
    const profile = {
      market: data.get('market'),
      holding: data.get('holding'),
      accountSize: data.get('accountSize'),
      riskPerTrade: data.get('riskPerTrade'),
      experience: data.get('experience'),
      preference: data.get('preference')
    };

    const scores = computeScores(profile);

    introEl.textContent =
      'Based on your answers, here are some example firms whose evaluation styles may align with your profile. Always double-check rules on each site or via PropFirmMatch.';

    resultsEl.innerHTML = scores.map(({ firm, score }) => {
      const pct = Math.round(score * 100);
      const riskText =
        pct >= 90 ? 'Excellent structural fit (on paper) – still manage risk.' :
        pct >= 85 ? 'Strong fit with some trade-offs to review in the rulebook.' :
        'Potential fit – dig into the daily/overall loss and payout rules before deciding.';

      return `
        <article class="section-card-soft" style="margin-bottom:0.75rem;">
          <div class="section-header" style="margin-bottom:0.35rem;">
            <h3 class="section-title" style="font-size:0.9rem;">${firm.name}</h3>
            <span class="badge badge-pill-soft">${pct}% match</span>
          </div>
          <p class="section-subtitle" style="margin-bottom:0.5rem;">${firm.desc}</p>
          <div class="chip-row">
            ${firm.tags.map(t => `<span class="chip">${t}</span>`).join('')}
          </div>
          <p class="section-subtitle" style="margin-top:0.6rem;">${riskText}</p>
        </article>
      `;
    }).join('');
  });
})();
