import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';


import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Login/LoginPage';
import { SignupPage } from './pages/Signup/SignupPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MyTripsPage } from './pages/MyTrips/MyTripsPage';
import { CreateTripPage } from './pages/CreateTrip/CreateTripPage';
import { TripOverviewPage } from './pages/TripOverview/TripOverviewPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilder/ItineraryBuilderPage';
import { ActivitiesPage } from './pages/Activities/ActivitiesPage';
import { TimelinePage } from './pages/Timeline/TimelinePage';
import { BudgetPage } from './pages/Budget/BudgetPage';
import { AIPlannerPage } from './pages/AIPlanner/AIPlannerPage';
import { AICopilotPage } from './pages/AICopilot/AICopilotPage';
import { AutoReplannerPage } from './pages/AutoReplanner/AutoReplannerPage';
import { RouteOptimizerPage } from './pages/RouteOptimizer/RouteOptimizerPage';
import { CollaborationPage } from './pages/Collaboration/CollaborationPage';
import { PublicTripPage } from './pages/PublicTrip/PublicTripPage';
import { CalendarPage } from './pages/Calendar/CalendarPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <AuthProvider>
          <TripProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/public/trips/:slug" element={<PublicTripPage />} />
                <Route path="/public/:slug" element={<PublicTripPage />} />
                <Route path="/share/:slug" element={<PublicTripPage />} />

                {/* Main App Layout Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/trips" element={<MyTripsPage />} />
                  <Route path="/create-trip" element={<CreateTripPage />} />
                  <Route path="/trips/:tripId" element={<TripOverviewPage />} />
                  <Route path="/trips/:tripId/builder" element={<ItineraryBuilderPage />} />
                  <Route path="/trips/:tripId/timeline" element={<TimelinePage />} />
                  <Route path="/trips/:tripId/budget" element={<BudgetPage />} />
                  <Route path="/trips/:tripId/copilot" element={<AICopilotPage />} />
                  <Route path="/trips/:tripId/replanner" element={<AutoReplannerPage />} />
                  <Route path="/trips/:tripId/optimizer" element={<RouteOptimizerPage />} />
                  <Route path="/trips/:tripId/collaborate" element={<CollaborationPage />} />
                  <Route path="/trips/:tripId/ticket" element={<PublicTripPage />} />
                  <Route path="/explore" element={<ActivitiesPage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/ai-planner" element={<AIPlannerPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </TripProvider>
        </AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}


export default App;
