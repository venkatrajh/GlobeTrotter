# AI Service API Documentation

This document describes the API contracts for the AI endpoints to be implemented by Member 3.

## Overview
The AI endpoints provide intelligent travel planning capabilities.
All endpoints are designed to accept JSON and return structured JSON conforming to defined schemas.

### Environment Setup
- `AI_MODE`: Determines if the real AI or mock fallback is used (`mock` or `gemini`).
- `GEMINI_API_KEY`: API key required if `AI_MODE=gemini`.

---

## Endpoints

### 1. Trip Generator
**Endpoint**: `POST /ai/trip-generator`
**Purpose**: Generates a structured, highly personalized multi-day travel itinerary.
**Authentication Expectation**: The backend should validate the user session before passing the request to this service.

**Request Schema**:
```json
{
  "destination": "Tokyo",
  "days": 5,
  "budget": 50000,
  "currency": "INR",
  "travel_style": "balanced",
  "interests": ["food", "culture"],
  "activity_preferences": [],
  "pace": "balanced",
  "constraints": []
}
```

**Response Schema**:
```json
{
  "trip_summary": "Summary string",
  "destination": "Tokyo",
  "days": [
    {
      "day": 1,
      "city": "Tokyo",
      "activities": [
        {
          "name": "Activity Name",
          "category": "Culture",
          "suggested_time": "10:00",
          "duration_minutes": 120,
          "estimated_cost": 2500,
          "location": "Optional address",
          "reason": "Optional reasoning"
        }
      ],
      "estimated_daily_cost": 2500,
      "daily_summary": "Summary string"
    }
  ],
  "estimated_total": 2500,
  "currency": "INR",
  "budget_status": "within_budget",
  "warnings": [],
  "assumptions": []
}
```

**Notes on Budget & Validation**:
- The `budget_status` and all total cost fields (`estimated_daily_cost`, `estimated_total`) are calculated deterministically by the backend using the sum of the individual activity costs. The model's arithmetic is overridden for safety.
- `warnings` will include schedule conflicts (overlapping times) and obvious duplicate activities detected by the backend.
- If `AI_MODE=mock` is active, this endpoint will return a deterministic dummy itinerary spanning exactly the requested number of days without calling Gemini.

**Errors**:
- `INVALID_INPUT`: Request validation failed (e.g., negative budget, missing destination).
- `AI_GENERATION_FAILED`: LLM generated malformed JSON or invalid number of days and failed its retry attempt.

### 2. Travel Copilot
**Endpoint**: `POST /ai/copilot`
**Purpose**: Conversational intelligence to modify/interact with the trip.

**Request Body (Draft)**:
```json
{
  "message": "Make Day 2 cheaper.",
  "trip_context": {...}
}
```

### 3. Budget Optimizer
**Endpoint**: `POST /ai/optimize-budget`
**Purpose**: Analyzes an itinerary and suggests actionable swaps or removals to meet a target budget.

**Request Schema**:
```json
{
  "budget": 50000,
  "currency": "INR",
  "itinerary": {
    "destination": "Tokyo",
    "days": [
      {
        "day": 1,
        "city": "Tokyo",
        "activities": [
          {
            "id": "a1",
            "name": "Premium Attraction",
            "category": "attraction",
            "estimated_cost": 5000,
            "duration_minutes": 180
          }
        ]
      }
    ]
  },
  "preferences": {
    "travel_style": "balanced",
    "interests": ["food"],
    "constraints": [],
    "must_keep_activity_ids": ["a2"]
  }
}
```

**Response Schema**:
```json
{
  "summary": "Your itinerary is ₹12,000 over budget. Here are suggestions.",
  "current_total": 62000,
  "target_budget": 50000,
  "over_budget_by": 12000,
  "potential_savings": 4000,
  "projected_total": 58000,
  "currency": "INR",
  "suggestions": [
    {
      "id": "mock-sug-1",
      "type": "activity_swap",
      "priority": "high",
      "reason": "This premium attraction is very expensive.",
      "current_activity_id": "a1",
      "current_activity_name": "Premium Attraction",
      "suggested_replacement": {
        "name": "Local Museum",
        "category": "attraction",
        "estimated_cost": 1000
      },
      "current_cost": 5000,
      "replacement_cost": 1000,
      "estimated_savings": 4000,
      "tradeoffs": [
        "Less premium experience"
      ]
    }
  ],
  "warnings": [],
  "assumptions": []
}
```

**Notes on Budget Optimizer**:
- The backend/frontend MUST NOT apply these suggestions directly to the DB without user consent. These are *proposed* changes.
- `potential_savings`, `projected_total`, and `over_budget_by` are always re-calculated deterministically. The LLM's arithmetic is overridden for accuracy.
- Any suggestions affecting an activity listed in `must_keep_activity_ids` are automatically stripped out.

**Errors**:
- `INVALID_INPUT`: Request validation failed (e.g., negative budget).
- `AI_RESPONSE_INVALID`: LLM generated malformed output or failed validation constraints and could not be repaired.

### 4. Auto-Replanner
**Endpoint**: `POST /ai/replan-trip`
**Purpose**: Intelligently modifies an existing itinerary to accommodate a disruption (e.g., delay, activity unavailable) with minimal changes.

**Request Schema**:
```json
{
  "itinerary": {
    "destination": "Tokyo",
    "days": [
      {
        "day": 1,
        "city": "Tokyo",
        "activities": [
          {
            "id": "a1",
            "name": "Meiji Shrine",
            "category": "culture",
            "suggested_time": "09:00",
            "duration_minutes": 120,
            "estimated_cost": 0,
            "location": "Shibuya"
          },
          {
            "id": "a2",
            "name": "Tokyo Tower",
            "category": "attraction",
            "suggested_time": "13:00",
            "duration_minutes": 120,
            "estimated_cost": 3000,
            "location": "Minato"
          }
        ]
      }
    ]
  },
  "disruption": {
    "type": "activity_unavailable",
    "description": "Tokyo Tower is unavailable today.",
    "affected_activity_id": "a2",
    "affected_day": 1
  },
  "preferences": {
    "travel_style": "balanced",
    "interests": ["culture"],
    "constraints": [],
    "must_keep_activity_ids": ["a1"]
  },
  "budget": 50000,
  "currency": "INR"
}
```

**Response Schema**:
```json
{
  "status": "replanned",
  "summary": "Tokyo Tower became unavailable, so the afternoon activity was replaced with a nearby cultural experience.",
  "original_total": 12000,
  "replanned_total": 10500,
  "cost_difference": -1500,
  "changes": [
    {
      "type": "replacement",
      "day": 1,
      "original_activity_id": "a2",
      "original_activity_name": "Tokyo Tower",
      "replacement_activity": {
        "id": "replacement-1",
        "name": "Mori Art Museum",
        "category": "culture",
        "suggested_time": "13:30",
        "duration_minutes": 120,
        "estimated_cost": 1500,
        "location": "Roppongi"
      },
      "reason": "The original activity was unavailable and this alternative fits the available afternoon window.",
      "tradeoffs": [
        "Different type of experience"
      ]
    }
  ],
  "preserved_activity_ids": [
    "a1"
  ],
  "warnings": [],
  "assumptions": [],
  "itinerary": {
    "destination": "Tokyo",
    "days": [
      {
        "day": 1,
        "city": "Tokyo",
        "activities": [
          {
            "id": "a1",
            "name": "Meiji Shrine",
            "category": "culture",
            "suggested_time": "09:00",
            "duration_minutes": 120,
            "estimated_cost": 0,
            "location": "Shibuya"
          },
          {
            "id": "replacement-1",
            "name": "Mori Art Museum",
            "category": "culture",
            "suggested_time": "13:30",
            "duration_minutes": 120,
            "estimated_cost": 1500,
            "location": "Roppongi"
          }
        ]
      }
    ]
  }
}
```

**Notes on Auto-Replanner**:
- Valid Disruption Types: `activity_unavailable`, `delay`, `cancellation`, `user_change`, `late_arrival`, `time_constraint`, `weather_issue`, `custom`.
- The system employs a "Minimal-Change" architecture. `preserved_activity_ids` explicitly tracks unaffected portions of the trip.
- If the disruption necessitates modifying an activity strictly listed in `must_keep_activity_ids`, the system will abort the replan and return `"status": "constraint_conflict"`.

**Errors**:
- `INVALID_INPUT`: Validation failed.
- `AI_RESPONSE_INVALID`: The AI returned structurally flawed output that could not be repaired.

### 5. Smart Route Optimizer
**Endpoint**: `POST /ai/optimize-route`
**Purpose**: Reorders an itinerary's daily activities to minimize travel time/distance without moving activities across days.

**Request Schema**:
```json
{
  "itinerary": {
    "destination": "Tokyo",
    "days": [...]
  },
  "preferences": {
    "must_keep_activity_ids": [],
    "fixed_time_activity_ids": []
  },
  "travel_metadata": [
    {
      "from_activity_id": "a1",
      "to_activity_id": "a2",
      "estimated_minutes": 20
    }
  ]
}
```

**Response Schema**:
```json
{
  "status": "optimized",
  "changes": [
    {
      "day": 1,
      "original_order": ["a1", "a2"],
      "optimized_order": ["a2", "a1"],
      "reason": "Saves 10 minutes of travel time."
    }
  ],
  "estimated_travel_minutes_before": 30,
  "estimated_travel_minutes_after": 20,
  "estimated_savings_minutes": 10,
  "itinerary": {...},
  "warnings": []
}
```

### 6. Travel Copilot
**Endpoint**: `POST /ai/copilot`
**Purpose**: Conversational travel assistant. Returns structured intents and actions.

**Response Example**:
```json
{
  "message": "You can explore Yoyogi Park...",
  "intent": "activity_recommendation",
  "suggestions": [...],
  "related_activity_ids": ["a1"],
  "actions": [
    {
      "type": "suggest_route_optimization",
      "reason": "Adding this activity affects routing."
    }
  ],
  "warnings": []
}
```

### 7. What-If Simulator
**Endpoint**: `POST /ai/what-if`
**Purpose**: Allows users to simulate changes to an itinerary (e.g. `budget_change`, `add_day`) without mutating the original.

**Response Example**:
```json
{
  "scenario": "remove_activity",
  "summary": "Removing Tokyo Tower saves 3000 INR.",
  "original_total": 5000,
  "projected_total": 2000,
  "cost_difference": -3000,
  "changes": [...],
  "itinerary": {...},
  "warnings": []
}
```

### 8. Packing Assistant
**Endpoint**: `POST /ai/packing-assistant`
**Purpose**: Generate a contextual packing list.

**Response Example**:
```json
{
  "categories": [
    {
      "name": "Clothing",
      "items": [{"name": "T-shirts", "quantity": 7}]
    }
  ],
  "essentials": ["Passport"],
  "activity_specific": ["Hiking Boots"],
  "optional_items": ["Camera"],
  "warnings": ["Weather context unavailable."]
}
```

### 9. Group Preference Engine
**Endpoint**: `POST /ai/group-preferences`
**Purpose**: Resolve competing preferences in group trips.

**Response Example**:
```json
{
  "consensus": {
    "interests": ["culture", "food"],
    "pace": "balanced",
    "budget": 30000
  },
  "member_satisfaction": [...],
  "conflicts": [...],
  "recommendations": [...],
  "warnings": []
}
```

---

## Unified AI Error Model

If any service encounters an error, it returns a standard format:
```json
{
  "error": {
    "code": "AI_VALIDATION_ERROR",
    "message": "The AI response did not match the required structure.",
    "retryable": false,
    "details": {}
  }
}
```

**Common Error Codes**:
- `AI_PROVIDER_ERROR`: LLM backend failure.
- `AI_VALIDATION_ERROR`: Zod schema validation failed after AI output.
- `AI_INVALID_INPUT`: The client sent malformed input.
- `AI_CONSTRAINT_CONFLICT`: A strictly enforced constraint (e.g. `must-keep`) was violated by the LLM.
- `AI_REPAIR_FAILED`: The system attempted a repair loop but failed.

---
*Note: The AI service does NOT persist data. The backend owns persistence.*
