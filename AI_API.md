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
**Purpose**: Generates a structured multi-day travel itinerary based on inputs.

**Request Body (Draft)**:
```json
{
  "destination": "Tokyo",
  "days": 5,
  "budget": 50000,
  "currency": "INR",
  "travel_style": "balanced",
  "interests": ["food", "culture"],
  "activity_preferences": [],
  "pace": "balanced"
}
```

**Response (Draft)**:
```json
{
  "trip_summary": "...",
  "estimated_total": 47000,
  "days": [...],
  "warnings": []
}
```

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
