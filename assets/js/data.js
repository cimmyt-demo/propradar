
// Central data model for Prop Radar demo (firms, challenges, offers, rewards)
window.PR_DATA = (function() {
  const firms = [
    {
      id: 'ftmo',
      name: 'FTMO',
      slug: 'ftmo',
      country: 'EU',
      yearsActive: '2015+',
      rating: 4.7,
      reviewsCount: 2000,
      maxAllocation: 400000,
      assets: ['forex', 'indices', 'crypto'],
      evaluationModels: ['2step'],
      platforms: ['mt4', 'mt5'],
      tags: ['Established', '2-step', 'Multi-asset'],
      summary: 'Popular 2-step evaluation prop firm with disciplined rules for FX, indices and crypto.',
      warningFlag: null // or 'warning', 'new'
    },
    {
      id: 'the5ers',
      name: 'The5ers',
      slug: 'the5ers',
      country: 'EU',
      yearsActive: '2016+',
      rating: 4.6,
      reviewsCount: 1200,
      maxAllocation: 500000,
      assets: ['forex'],
      evaluationModels: ['1step', '2step', 'instant'],
      platforms: ['mt4', 'mt5'],
      tags: ['Scaling', 'Instant funding', 'Forex-first'],
      summary: 'Offers 1-step, 2-step and instant-style funding with progressive scaling.',
      warningFlag: null
    },
    {
      id: 'fundednext',
      name: 'FundedNext',
      slug: 'fundednext',
      country: 'Global',
      yearsActive: 'Newer',
      rating: 4.5,
      reviewsCount: 900,
      maxAllocation: 200000,
      assets: ['forex', 'futures', 'crypto'],
      evaluationModels: ['1step', '2step', 'instant'],
      platforms: ['mt4', 'mt5'],
      tags: ['Multi-asset', 'Flexible models'],
      summary: 'Multi-asset prop firm with 1-step, 2-step and instant funding-style options.',
      warningFlag: null
    },
    {
      id: 'e8',
      name: 'E8 Markets',
      slug: 'e8-markets',
      country: 'Global',
      yearsActive: 'Newer',
      rating: 4.4,
      reviewsCount: 600,
      maxAllocation: 1000000,
      assets: ['forex', 'futures'],
      evaluationModels: ['1step', '2step', '3step'],
      platforms: ['mt4', 'mt5'],
      tags: ['High allocation', 'Active traders'],
      summary: 'High potential allocation with a range of 1-, 2- and 3-step challenges.',
      warningFlag: null
    },
    {
      id: 'fundingpips',
      name: 'FundingPips',
      slug: 'fundingpips',
      country: 'Global',
      yearsActive: 'Newer',
      rating: 4.4,
      reviewsCount: 500,
      maxAllocation: 300000,
      assets: ['forex', 'crypto'],
      evaluationModels: ['2step'],
      platforms: ['mt4', 'mt5'],
      tags: ['2-step', 'Crypto-friendly'],
      summary: 'Straightforward 2-step evaluations for FX and indices traders with crypto exposure.',
      warningFlag: null
    },
    {
      id: 'ftp',
      name: 'Funded Trading Plus',
      slug: 'funded-trading-plus',
      country: 'UK',
      yearsActive: 'Newer',
      rating: 4.5,
      reviewsCount: 700,
      maxAllocation: 200000,
      assets: ['forex'],
      evaluationModels: ['1step', '2step', 'instant'],
      platforms: ['mt4', 'mt5'],
      tags: ['FX-focused', 'Beginner-friendly'],
      summary: 'Forex-oriented prop firm with several evaluation paths including instant funding style.',
      warningFlag: null
    },
    {
      id: 'apex',
      name: 'Apex Trader Funding',
      slug: 'apex-trader-funding',
      country: 'US',
      yearsActive: '2010s+',
      rating: 4.3,
      reviewsCount: 1500,
      maxAllocation: 300000,
      assets: ['futures'],
      evaluationModels: ['1step'],
      platforms: ['futures'],
      tags: ['Futures-only', 'Promos'],
      summary: 'Futures-only 1-step evaluations with frequent promotions and aggressive pricing.',
      warningFlag: null
    },
    {
      id: 'topstep',
      name: 'Topstep',
      slug: 'topstep',
      country: 'US',
      yearsActive: '2010s+',
      rating: 4.2,
      reviewsCount: 1800,
      maxAllocation: 150000,
      assets: ['futures'],
      evaluationModels: ['1step'],
      platforms: ['futures'],
      tags: ['Legacy brand', 'Education'],
      summary: 'Long-running futures prop firm with an education-heavy trading combine.',
      warningFlag: null
    },
    {
      id: 'myfundedfutures',
      name: 'MyFundedFutures',
      slug: 'myfundedfutures',
      country: 'US',
      yearsActive: 'Newer',
      rating: 4.3,
      reviewsCount: 400,
      maxAllocation: 150000,
      assets: ['futures'],
      evaluationModels: ['1step'],
      platforms: ['futures'],
      tags: ['Straightforward', 'High payouts'],
      summary: 'Straightforward futures evaluations with competitive payout splits.',
      warningFlag: null
    }
  ];

  // Minimal challenge catalog for comparison table / firm detail
  const challenges = [
    {
      id: 'ftmo-100k-2step',
      firmId: 'ftmo',
      name: 'FTMO Challenge 100K',
      accountSize: 100000,
      price: 540,
      phaseCount: 2,
      profitTargetPhase1Pct: 10,
      profitTargetPhase2Pct: 5,
      dailyDrawdownPct: 5,
      overallDrawdownPct: 10,
      timeLimitDaysPhase1: 30,
      timeLimitDaysPhase2: 60,
      minTradingDays: 10,
      payoutSplitPct: 80,
      payoutFirstAfterDays: 30,
      payoutFrequencyDays: 14,
      refundOnFirstPayout: true,
      notes: 'Classic 2-phase evaluation, time limited.'
    },
    {
      id: 'the5ers-40k-instant',
      firmId: 'the5ers',
      name: 'The5ers Instant Funding 40K',
      accountSize: 40000,
      price: 600,
      phaseCount: 1,
      profitTargetPhase1Pct: 6,
      profitTargetPhase2Pct: null,
      dailyDrawdownPct: 4,
      overallDrawdownPct: 8,
      timeLimitDaysPhase1: null,
      timeLimitDaysPhase2: null,
      minTradingDays: 0,
      payoutSplitPct: 50,
      payoutFirstAfterDays: 30,
      payoutFrequencyDays: 30,
      refundOnFirstPayout: false,
      notes: 'Instant funding style with scaling plan; no hard time limit.'
    },
    {
      id: 'fundednext-50k-1step',
      firmId: 'fundednext',
      name: 'FundedNext 50K 1-Step',
      accountSize: 50000,
      price: 350,
      phaseCount: 1,
      profitTargetPhase1Pct: 10,
      profitTargetPhase2Pct: null,
      dailyDrawdownPct: 5,
      overallDrawdownPct: 10,
      timeLimitDaysPhase1: 30,
      timeLimitDaysPhase2: null,
      minTradingDays: 5,
      payoutSplitPct: 80,
      payoutFirstAfterDays: 30,
      payoutFrequencyDays: 14,
      refundOnFirstPayout: false,
      notes: 'Single-phase evaluation with immediate funded transition.'
    },
    {
      id: 'apex-50k-futures',
      firmId: 'apex',
      name: 'Apex 50K Futures',
      accountSize: 50000,
      price: 167,
      phaseCount: 1,
      profitTargetPhase1Pct: 6,
      profitTargetPhase2Pct: null,
      dailyDrawdownPct: null,
      overallDrawdownPct: 6,
      timeLimitDaysPhase1: null,
      timeLimitDaysPhase2: null,
      minTradingDays: 0,
      payoutSplitPct: 90,
      payoutFirstAfterDays: 30,
      payoutFrequencyDays: 7,
      refundOnFirstPayout: false,
      notes: 'Trailing drawdown, no fixed time limit, frequent promos.'
    }
  ];

  const offers = [
    {
      id: 'offer-ftmo-10',
      firmId: 'ftmo',
      title: 'FTMO 10% off challenge fee',
      code: 'FTMODEMO10',
      discountPct: 10,
      appliesToAccountSizes: [10000, 25000, 50000, 100000, 200000],
      expiresAt: '2025-12-31',
      loyaltyMultiplier: 1.0
    },
    {
      id: 'offer-apex-promo',
      firmId: 'apex',
      title: 'Apex futures promo',
      code: 'APEXFUTURES',
      discountPct: 50,
      appliesToAccountSizes: [25000, 50000, 75000, 100000],
      expiresAt: '2025-08-31',
      loyaltyMultiplier: 2.0
    },
    {
      id: 'offer-the5ers-extra',
      firmId: 'the5ers',
      title: 'The5ers extra account perk',
      code: '5ERSBONUS',
      discountPct: 0,
      appliesToAccountSizes: [20000, 40000],
      expiresAt: '2025-10-31',
      loyaltyMultiplier: 1.5
    }
  ];

  const rewardTiers = [
    { points: 2000, label: 'Free $5K challenge' },
    { points: 5000, label: '50% off $25K challenge' },
    { points: 10000, label: 'Free $25K challenge' },
    { points: 25000, label: 'Free $100K challenge' },
    { points: 80000, label: 'Free $500K evaluation' }
  ];

  const priceToPointsBuckets = [
    { min: 100, max: 199, points: 400 },
    { min: 200, max: 399, points: 800 },
    { min: 400, max: 699, points: 1600 },
    { min: 700, max: Infinity, points: 3000 }
  ];

  function getFirmById(id) {
    return firms.find(f => f.id === id) || null;
  }

  function getChallengesByFirmId(firmId) {
    return challenges.filter(c => c.firmId === firmId);
  }

  return {
    firms,
    challenges,
    offers,
    rewardTiers,
    priceToPointsBuckets,
    getFirmById,
    getChallengesByFirmId
  };
})();
