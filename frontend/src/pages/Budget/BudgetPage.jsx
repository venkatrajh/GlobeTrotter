import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { BudgetVisuals } from '../../components/budget/BudgetVisuals';
import { ArrowLeft } from 'lucide-react';

export const BudgetPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip, showNotification } = useTrips();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const breakdownData = [
    { category: 'Hotels & Ryokans', planned: 72000, spent: 65000, percentage: 40, icon: '🏨' },
    { category: 'Shinkansen & Flights', planned: 45000, spent: 32000, percentage: 25, icon: '🚅' },
    { category: 'Experiences & Entry', planned: 36000, spent: 15000, percentage: 20, icon: '🎟️' },
    { category: 'Culinary & Dining', planned: 27000, spent: 8000, percentage: 15, icon: '🍜' }
  ];

  const smartInsights = [
    {
      id: 'ins-1',
      title: 'JR Rail Pass Recommendation',
      description: 'Switching 3 individual Shinkansen tickets to a 7-day National Rail Pass saves on Kyoto & Osaka legs.',
      potentialSaving: 8400
    },
    {
      id: 'ins-2',
      title: 'Off-Peak Tokyo Skytree Booking',
      description: 'Booking twilight entry slots 4 days ahead unlocks combo discounts for group members.',
      potentialSaving: 2100
    }
  ];

  const handleApplyInsight = (insight) => {
    showNotification(`Insight applied! Saved an estimated ₹${insight.potentialSaving.toLocaleString()}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      <button
        type="button"
        onClick={() => navigate(`/trips/${currentTrip.id}`)}
        className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentTrip.title}
      </button>

      <BudgetVisuals
        totalBudget={currentTrip?.totalBudget || 180000}
        spentBudget={120000}
        breakdown={breakdownData}
        insights={smartInsights}
        destinationCountry={currentTrip?.destination}
        onApplyInsight={handleApplyInsight}
      />
    </div>
  );
};
