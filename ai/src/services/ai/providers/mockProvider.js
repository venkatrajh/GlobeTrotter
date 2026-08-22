const AIProvider = require('./aiProvider');

/**
 * Deterministic Mock Provider for Fallback/Demo mode.
 */
class MockProvider extends AIProvider {
  init() {
    this.isInitialized = true;
    console.log('[MockProvider] Initialized successfully.');
  }

  async generateStructuredResponse(prompt, schema) {
    if (!this.isInitialized) {
      throw new Error('[MockProvider] Provider not initialized.');
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Basic deterministic routing based on prompt keywords.
    // In Phase 2, this will be expanded to return realistic mock data.
    if (prompt.includes('generate-trip') || prompt.includes('Destination:')) {
      // Create dynamic mock response based on prompt requested days (defaults to 3 if not found)
      const daysMatch = prompt.match(/Number of Days: (\d+)/);
      const requestedDays = daysMatch ? parseInt(daysMatch[1], 10) : 3;
      const currencyMatch = prompt.match(/Budget: \d+ ([A-Z]{3})/);
      const currency = currencyMatch ? currencyMatch[1] : 'INR';

      const days = [];
      for (let i = 1; i <= requestedDays; i++) {
        days.push({
          day: i,
          city: "Tokyo",
          activities: [
            {
              name: `Morning Mock Activity ${i}`,
              category: "Sightseeing",
              suggested_time: "09:00",
              duration_minutes: 120,
              estimated_cost: 2000
            },
            {
              name: `Afternoon Mock Activity ${i}`,
              category: "Culture",
              suggested_time: "14:00",
              duration_minutes: 180,
              estimated_cost: 3000
            }
          ],
          estimated_daily_cost: 5000,
          daily_summary: `A lovely day ${i} in Tokyo.`
        });
      }

      return {
        trip_summary: `A wonderful ${requestedDays}-day mock trip to Tokyo.`,
        destination: "Tokyo",
        estimated_total: requestedDays * 5000,
        currency: currency,
        days: days,
        budget_status: "budget_unknown",
        warnings: ["This is a mock response."],
        assumptions: ["Prices are simulated for mock purposes."]
      };
    }

    if (prompt.includes('generate-budget-optimization') || prompt.includes('budget optimizer')) {
      const currentTotalMatch = prompt.match(/"estimated_cost":\s*(\d+)/g);
      let simulatedCurrentTotal = 62000; // default mock overage
      let targetBudgetMatch = prompt.match(/Target Budget: (\d+)/);
      let targetBudget = targetBudgetMatch ? parseInt(targetBudgetMatch[1], 10) : 50000;

      return {
        summary: "This is a mock budget optimization. Your itinerary is over budget.",
        current_total: simulatedCurrentTotal,
        target_budget: targetBudget,
        over_budget_by: Math.max(0, simulatedCurrentTotal - targetBudget),
        potential_savings: 4000,
        projected_total: simulatedCurrentTotal - 4000,
        currency: "INR",
        suggestions: [
          {
            id: "mock-sug-1",
            type: "activity_swap",
            priority: "high",
            reason: "This premium attraction is very expensive.",
            current_activity_id: "a1",
            current_activity_name: "Premium Attraction",
            suggested_replacement: {
              name: "Local Museum",
              category: "attraction",
              estimated_cost: 1000
            },
            current_cost: 5000,
            replacement_cost: 1000,
            estimated_savings: 4000,
            tradeoffs: ["Less premium experience"]
          }
        ],
        warnings: ["Mock response."],
        assumptions: ["Costs are simulated."]
      };
    }

    if (prompt.includes('copilot')) {
      return {
        message: "Mock copilot acknowledges your request.",
        actions: []
      };
    }

    // Default mock fallback
    return {
      status: "success",
      mock_data: true,
      message: "This is a deterministic mock response from MockProvider."
    };
  }
}

module.exports = MockProvider;
