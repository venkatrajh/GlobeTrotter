import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { BudgetVisuals } from '../../components/budget/BudgetVisuals';
import { aiApi } from '../../api/services';
import { ArrowLeft } from 'lucide-react';

export const BudgetPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip, showNotification } = useTrips();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [dynamicInsights, setDynamicInsights] = React.useState(currentTrip?.smartInsights || []);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const fetchedTripIdRef = React.useRef(null);

  React.useEffect(() => {
    if (currentTrip && currentTrip.id && fetchedTripIdRef.current !== currentTrip.id) {
      fetchedTripIdRef.current = currentTrip.id;
      const fetchOptimization = async () => {
        try {
          setIsOptimizing(true);
          const insights = await aiApi.optimizeBudget(currentTrip);
          if (insights && insights.length > 0) {
            setDynamicInsights(insights);
          }
        } catch (e) {
          console.error("Budget optimization failed", e);
        } finally {
          setIsOptimizing(false);
        }
      };
      fetchOptimization();
    }
  }, [currentTrip?.id]);

  const handleApplyInsight = (insight) => {
    showNotification(`Insight applied! Saved an estimated ₹${insight.potentialSaving.toLocaleString()}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      <button
        type="button"
        onClick={() => navigate(`/trips/${currentTrip.id}`)}
        className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentTrip.title}
      </button>

      {isOptimizing && (
        <div className="p-4 rounded-xl glass-secondary border text-sm font-bold animate-pulse text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2">
          Generating AI Budget Optimization...
        </div>
      )}

      <BudgetVisuals
        totalBudget={currentTrip?.totalBudget || 0}
        spentBudget={currentTrip?.spentBudget || 0}
        breakdown={currentTrip?.budgetBreakdown || []}
        insights={dynamicInsights}
        destinationCountry={currentTrip?.destination}
        onApplyInsight={handleApplyInsight}
      />
    </div>
  );
};
