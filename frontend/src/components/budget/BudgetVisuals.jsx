import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { usePreferences } from '../../context/PreferencesContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const BudgetVisuals = ({
  totalBudget = 180000,
  spentBudget = 120000,
  breakdown = [],
  insights = [],
  destinationCountry = 'Japan',
  onApplyInsight
}) => {
  const { fmtCurrency } = usePreferences();

  const percentageUsed = Math.min(100, Math.round((spentBudget / totalBudget) * 100));
  const remainingBudget = Math.max(0, totalBudget - spentBudget);
  const predictedTotal = 174500;

  return (
    <div className="flex flex-col gap-8 text-left relative z-10">
      {/* Top Header & Large Visual Budget Progress with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-xl border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-400">
              EXPENSE MONITOR
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-1 mt-1">
              {fmtCurrency(totalBudget, destinationCountry)}
            </h2>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">
              TOTAL PLANNED BUDGET
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-secondary px-4 py-2.5 rounded-2xl text-right border">
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">Remaining</span>
              <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                {fmtCurrency(remainingBudget, destinationCountry)}
              </span>
            </div>
            <div className="glass-secondary px-4 py-2.5 rounded-2xl text-right border">
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">Predicted Total</span>
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
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 font-semibold">
            <span>{fmtCurrency(0, destinationCountry)}</span>
            <span>{fmtCurrency(totalBudget / 2, destinationCountry)} (50%)</span>
            <span>{fmtCurrency(totalBudget, destinationCountry)} (100%)</span>
          </div>
        </div>
      </div>

      {/* Grid: Donut Chart / Graphic Left + Category Breakdown Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Donut Graphic Card with Liquid Glass */}
        <div className="lg:col-span-5 glass-secondary rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center shadow-lg border">
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 self-start">
            SPENDING DISTRIBUTION
          </span>

          <div className="relative my-6 flex items-center justify-center">
            {/* SVG Donut Chart */}
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
              {/* Stay - 40% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#18181b"
                strokeWidth="14"
                strokeDasharray="95.5 238.7"
                strokeDashoffset="0"
              />
              {/* Transport - 25% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#52525b"
                strokeWidth="14"
                strokeDasharray="59.7 238.7"
                strokeDashoffset="-95.5"
              />
              {/* Activities - 20% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="14"
                strokeDasharray="47.7 238.7"
                strokeDashoffset="-155.2"
              />
              {/* Meals - 15% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#cbd5e1"
                strokeWidth="14"
                strokeDasharray="35.8 238.7"
                strokeDashoffset="-202.9"
              />
            </svg>

            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
                {percentageUsed}%
              </span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Utilized
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-zinc-950 dark:bg-zinc-100" />
              <span className="text-zinc-800 dark:text-zinc-200">Stay (40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-zinc-600" />
              <span className="text-zinc-800 dark:text-zinc-200">Transport (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-zinc-400" />
              <span className="text-zinc-800 dark:text-zinc-200">Activities (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-zinc-300" />
              <span className="text-zinc-800 dark:text-zinc-200">Meals (15%)</span>
            </div>
          </div>
        </div>

        {/* Right Category Breakdown Progress List */}
        <div className="lg:col-span-7 glass-secondary rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg border">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 block mb-6">
              CATEGORY BREAKDOWN
            </span>

            <div className="space-y-6">
              {breakdown.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
                      <span>{cat.icon}</span>
                      <span>{cat.category}</span>
                    </span>
                    <span className="text-zinc-950 dark:text-zinc-50 font-mono font-bold">
                      {fmtCurrency(cat.spent, destinationCountry)} / {fmtCurrency(cat.planned, destinationCountry)}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-white/60 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/80 dark:border-zinc-700/60">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
                      style={{ width: `${(cat.spent / cat.planned) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                    <span>{cat.percentage}% allocation</span>
                    <span>{Math.round((cat.spent / cat.planned) * 100)}% consumed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Money Insights Section with Liquid Glass */}
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
    </div>
  );
};
