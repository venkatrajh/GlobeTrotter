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

### 3. Auto-Replanner
**Endpoint**: `POST /ai/replan`
**Purpose**: Intelligently modify an itinerary when something changes (e.g., weather).

### 4. Route Optimization
**Endpoint**: `POST /ai/optimize-route`
**Purpose**: Reduce unnecessary travel between activities.

### 5. Budget Optimizer
**Endpoint**: `POST /ai/optimize-budget`
**Purpose**: Identify concrete ways to reduce costs when over budget.

### 6. What-If Simulator
**Endpoint**: `POST /ai/what-if`
**Purpose**: Simulate changes without modifying the real trip.

### 7. Packing Assistant
**Endpoint**: `POST /ai/packing-list`
**Purpose**: Generate a personalized packing list based on destination, dates, and weather.

---
*Note: This is a living document and schemas will be detailed out as implementation progresses.*
