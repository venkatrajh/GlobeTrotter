import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { usePreferences } from '../../context/PreferencesContext';
import { Sparkles, ArrowRight, PieChart, Info } from 'lucide-react';

export const BudgetVisuals = ({
  totalBudget = 0,
  spentBudget = 0,
  breakdown = [],
  insights = [],
  destinationCountry = '',
  onApplyInsight
}) => {
  const { fmtCurrency } = usePreferences();

  const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((spentBudget / totalBudget) * 100)) : 0;
  const remainingBudget = Math.max(0, totalBudget - spentBudget);
  const predictedTotal = spentBudget > 0 ? Math.round(spentBudget + (totalBudget - spentBudget) * 0.95) : totalBudget;

  // Dynamic SVG donut segments calculation
  // Circumference of r=38 circle: 2 * Math.PI * 38 = 238.76
  const circumference = 238.76;
  const colors = ['#18181b', '#52525b', '#94a3b8', '#cbd5e1', '#64748b'];

  let accumulatedOffset = 0;
  const donutSegments = breakdown.map((cat, idx) => {
    const strokeDash = (cat.percentage / 100) * circumference;
    const strokeOffset = -accumulatedOffset;
    accumulatedOffset += strokeDash;
    return {
      ...cat,
      strokeDash: `${strokeDash} ${circumference}`,
      strokeOffset,
      strokeColor: colors[idx % colors.length]
    };
  });

  return (
    <div className="flex flex-col gap-8 text-left relative z-10">
      {/* Top Header & Large Visual Budget Progress with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-xl border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
              EXPENSE MONITOR
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-1 mt-1">
              {fmtCurrency(totalBudget, destinationCountry)}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">
              TOTAL PLANNED BUDGET
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-secondary px-4 py-2.5 rounded-2xl text-right border">
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">Remaining</span>
              <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                {fmtCurrency(remainingBudget, destinationCountry)}
              </span>
            </div>
            <div className="glass-secondary px-4 py-2.5 rounded-2xl text-right border">
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">Predicted Total</span>
              <span className="text-sm sm:text-base font-black text-zinc-950 dark:text-zinc-50">
                {fmtCurrency(predictedTotal, destinationCountry)}
              </span>
            </div>
          </div>
        </div>

        {/* Large Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <span>{fmtCurrency(spentBudget, destinationCountry)} USED ({percentageUsed}%)</span>
            <span>{fmtCurrency(remainingBudget, destinationCountry)} LEFT</span>
          </div>

          <div className="relative w-full h-4 bg-white/50 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-300/80 dark:border-zinc-700">
            <div
              className="h-full bg-zinc-950 dark:bg-zinc-100 rounded-full transition-all duration-700"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-600 dark:text-zinc-400 pt-1 font-semibold">
            <span>{fmtCurrency(0, destinationCountry)}</span>
            <span>{fmtCurrency(totalBudget / 2, destinationCountry)} (50%)</span>
            <span>{fmtCurrency(totalBudget, destinationCountry)} (100%)</span>
          </div>
        </div>
      </div>

      {/* Grid: Donut Chart / Graphic Left + Category Breakdown Right */}
      {breakdown && breakdown.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Donut Graphic Card with Liquid Glass */}
          <div className="lg:col-span-5 glass-secondary rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center shadow-lg border">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-400 self-start">
              SPENDING DISTRIBUTION
            </span>

            <div className="relative my-6 flex items-center justify-center">
              {/* SVG Donut Chart with Dynamic Segments */}
              <svg width="220" height="220" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="14"
                  className="text-zinc-200/80 dark:text-zinc-800"
                />
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.category}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={segment.strokeColor}
                    strokeWidth="14"
                    strokeDasharray={segment.strokeDash}
                    strokeDashoffset={segment.strokeOffset}
                  />
                ))}
              </svg>

              {/* Center Label */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
                  {percentageUsed}%
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">
                  Utilized
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full text-xs font-bold">
              {donutSegments.map((cat) => (
                <div key={cat.category} className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.strokeColor }} />
                  <span className="text-zinc-800 dark:text-zinc-200 truncate">
                    {cat.category} ({cat.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Category Breakdown Progress List */}
          <div className="lg:col-span-7 glass-secondary rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg border">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-400 block mb-6">
                CATEGORY BREAKDOWN
              </span>

              <div className="space-y-6">
                {breakdown.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="flex items-center gap-2 text-zinc-950 dark:text-zinc-50 truncate">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.category}</span>
                      </span>
                      <span className="text-zinc-950 dark:text-zinc-50 font-mono font-bold shrink-0">
                        {fmtCurrency(cat.spent, destinationCountry)} / {fmtCurrency(cat.planned, destinationCountry)}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-white/60 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/80 dark:border-zinc-700/60">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((cat.spent / (cat.planned || 1)) * 100))}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">
                      <span>{cat.percentage}% allocation</span>
                      <span>{Math.round((cat.spent / (cat.planned || 1)) * 100)}% consumed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-secondary rounded-3xl p-10 shadow-lg border text-center flex flex-col items-center justify-center gap-3">
          <PieChart className="w-10 h-10 text-zinc-400 animate-pulse-subtle" />
          <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50">No budget breakdown yet</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
            Categories will be calculated automatically once activities and transit reservations are added to this itinerary.
          </p>
        </div>
      )}

      {/* Smart Money Insights Section with Liquid Glass */}
      {insights && insights.length > 0 && (
        <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-xl border">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono uppercase font-bold tracking-widest mb-2">
            <Sparkles className="w-4 h-4" /> SMART MONEY INSIGHTS
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50 mb-6">
            AI Budget Optimization Recommendations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="p-5 rounded-2xl glass-secondary border flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-zinc-950 dark:text-zinc-100">
                      {ins.title}
                    </span>
                    <Badge variant="success" size="sm">
                      Save {fmtCurrency(ins.potentialSaving, destinationCountry)}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {ins.description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => onApplyInsight && onApplyInsight(ins)}
                  className="w-full justify-between text-xs font-bold"
                >
                  Explore Suggestions
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
