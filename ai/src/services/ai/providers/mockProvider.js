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
    if (prompt.includes('generate-trip') || prompt.includes('multi-day itinerary')) {
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

    if (prompt.includes('replan-trip') || prompt.includes('Auto-Replanner')) {
      return {
        status: "replanned",
        summary: "Tokyo Tower became unavailable, so the afternoon activity was replaced with a nearby cultural experience.",
        original_total: 12000,
        replanned_total: 10500,
        cost_difference: -1500,
        changes: [
          {
            type: "replacement",
            day: 1,
            original_activity_id: "a2",
            original_activity_name: "Tokyo Tower",
            replacement_activity: {
              id: "replacement-1",
              name: "Mori Art Museum",
              category: "culture",
              suggested_time: "13:30",
              duration_minutes: 120,
              estimated_cost: 1500,
              location: "Roppongi"
            },
            reason: "The original activity was unavailable and this alternative fits the available afternoon window.",
            tradeoffs: ["Different type of experience"]
          }
        ],
        preserved_activity_ids: ["a1", "a3"],
        warnings: [],
        assumptions: [],
        itinerary: {
          destination: "Tokyo",
          days: [
            {
              day: 1,
              city: "Tokyo",
              activities: [
                {
                  id: "a1",
                  name: "Meiji Shrine",
                  category: "culture",
                  suggested_time: "09:00",
                  duration_minutes: 120,
                  estimated_cost: 0,
                  location: "Shibuya"
                },
                {
                  id: "replacement-1",
                  name: "Mori Art Museum",
                  category: "culture",
                  suggested_time: "13:30",
                  duration_minutes: 120,
                  estimated_cost: 1500,
                  location: "Roppongi"
                },
                {
                  id: "a3",
                  name: "Shibuya Crossing",
                  category: "attraction",
                  suggested_time: "16:00",
                  duration_minutes: 60,
                  estimated_cost: 0,
                  location: "Shibuya"
                }
              ]
            }
          ]
        }
      };
    }

    if (prompt.includes('optimize-route') || prompt.includes('Route Optimizer')) {
      return {
        status: "optimized",
        changes: [
          {
            day: 1,
            original_order: ["a1", "a2", "a3"],
            optimized_order: ["a1", "a3", "a2"],
            reason: "Logical geographic routing"
          }
        ],
        warnings: [],
        itinerary: {
          destination: "Tokyo",
          days: [
            {
              day: 1,
              city: "Tokyo",
              activities: [
                { id: 'a1', name: 'Act 1', category: 'attraction', suggested_time: '09:00', duration_minutes: 60, estimated_cost: 0 },
                { id: 'a3', name: 'Act 3', category: 'attraction', suggested_time: '11:00', duration_minutes: 60, estimated_cost: 0 },
                { id: 'a2', name: 'Act 2', category: 'attraction', suggested_time: '13:00', duration_minutes: 60, estimated_cost: 0 }
              ]
            }
          ]
        }
      };
    }

    if (prompt.includes('copilot') || prompt.includes('Travel Copilot')) {
      return {
        message: "You can explore the nearby Yoyogi Park or grab a coffee in Harajuku after visiting Meiji Shrine.",
        intent: "activity_recommendation",
        suggestions: [
          {
            name: "Yoyogi Park",
            category: "park",
            suggested_time: "11:30",
            duration_minutes: 60,
            estimated_cost: 0
          }
        ],
        related_activity_ids: ["a1"],
        actions: [
          {
            type: "suggest_route_optimization",
            reason: "Adding this activity might affect your daily route."
          }
        ],
        warnings: []
      };
    }

    if (prompt.includes('what-if') || prompt.includes('What-If')) {
      return {
        scenario: "remove_activity",
        summary: "Removing Tokyo Tower saves 3000 INR.",
        original_total: 5000,
        projected_total: 2000,
        cost_difference: -3000,
        changes: [
          {
            type: "removal",
            day: 1,
            original_activity_id: "a2",
            original_activity_name: "Tokyo Tower",
            reason: "User requested removal"
          }
        ],
        warnings: [],
        itinerary: {
          destination: "Tokyo",
          days: [
            {
              day: 1,
              city: "Tokyo",
              activities: [
                { id: 'a1', name: 'Act 1', category: 'attraction', suggested_time: '09:00', duration_minutes: 60, estimated_cost: 2000 }
              ]
            }
          ]
        }
      };
    }

    if (prompt.includes('packing') || prompt.includes('Packing Assistant')) {
      return {
        categories: [
          {
            name: "Clothing",
            items: [
              { name: "T-shirts", quantity: 7, reason: "One for each day" },
              { name: "Light jacket", quantity: 1, reason: "For cooler evenings" }
            ]
          }
        ],
        essentials: ["Passport", "Wallet", "Phone charger"],
        activity_specific: ["Hiking Boots"],
        optional_items: ["Camera"],
        warnings: ["Weather context was unavailable, packing list is approximate."]
      };
    }

    if (prompt.includes('group-preferences') || prompt.includes('Group Preference')) {
      return {
        consensus: {
          interests: ["culture", "food"],
          pace: "balanced",
          budget: 30000
        },
        member_satisfaction: [
          { member_id: "u1", satisfaction_level: "high", compromises: ["Agreed to a slightly faster pace than relaxed."] },
          { member_id: "u2", satisfaction_level: "medium", compromises: ["Budget restricted to 30000", "Pace slowed to balanced"] }
        ],
        conflicts: [
          { topic: "pace", description: "u1 wants relaxed, u2 wants fast", resolution: "Compromised on a balanced pace." },
          { topic: "budget", description: "u1 has a lower budget limit", resolution: "Capped total budget at u1's limit." }
        ],
        recommendations: ["Ensure enough food stops to keep u2 happy while maintaining u1's budget limit."],
        warnings: []
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
