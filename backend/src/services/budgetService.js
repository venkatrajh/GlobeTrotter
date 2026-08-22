const calculateBudgetSummary = (items) => {
  // Use integer arithmetic (multiplying by 100) to avoid common floating-point errors
  // since the schema uses Float, we assume max 2 decimal places precision for currency.

  let totalCents = 0;
  const breakdownCents = {
    transport: 0,
    stay: 0,
    activity: 0,
    meal: 0,
    other: 0,
  };

  items.forEach(item => {
    const amountCents = Math.round((item.amount || 0) * 100);
    totalCents += amountCents;

    const cat = item.category.toLowerCase();
    if (breakdownCents[cat] !== undefined) {
      breakdownCents[cat] += amountCents;
    } else {
      breakdownCents.other += amountCents;
    }
  });

  const breakdown = {};
  for (const [key, value] of Object.entries(breakdownCents)) {
    breakdown[key] = value / 100;
  }

  return {
    total: totalCents / 100,
    breakdown,
    itemCount: items.length,
  };
};

module.exports = {
  calculateBudgetSummary,
};
