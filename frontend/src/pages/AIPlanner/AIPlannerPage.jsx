import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { aiApi } from '../../api/ai';
import {
  AIGeneratorSentenceForm,
  AIProgressVisualizer,
  AIResultView
} from '../../components/ai/AIGeneratorComponents';

export const AIPlannerPage = () => {
  const navigate = useNavigate();
  const { createTrip, showNotification } = useTrips();
  const [plannerState, setPlannerState] = useState('form'); // 'form', 'generating', 'result'
  const [generatedTripData, setGeneratedTripData] = useState(null);
  const [userPromptPayload, setUserPromptPayload] = useState(null);

  const handleStartGenerate = (payload) => {
    setUserPromptPayload(payload);
    setPlannerState('generating');
  };

  const handleGenerationComplete = async () => {
    try {
      const result = await aiApi.generateTrip(userPromptPayload);
      setGeneratedTripData(result);
      setPlannerState('result');
    } catch (err) {
      console.error(err);
      setPlannerState('form');
    }
  };

  const handleAcceptJourney = async () => {
    const newTrip = await createTrip({
      title: `${userPromptPayload?.destination || 'Japan'} AI Odyssey`,
      destination: userPromptPayload?.destination || 'Japan',
      startDate: '2026-04-12',
      endDate: '2026-04-24',
      durationDays: Number(userPromptPayload?.days) || 12,
      totalBudget: Number(userPromptPayload?.budget?.replace(/,/g, '')) || 174500,
      travelStyle: userPromptPayload?.pace || 'Balanced',
      interests: userPromptPayload?.interests || ['Food', 'Culture'],
      stops: [
        { cityId: 'tokyo', cityName: 'Tokyo', code: 'NRT', nights: 4, transportToNext: { mode: 'flight', icon: '✈', duration: '2h 15m' } },
        { cityId: 'kyoto', cityName: 'Kyoto', code: 'KYO', nights: 4, transportToNext: { mode: 'train', icon: '🚅', duration: '45m' } },
        { cityId: 'osaka', cityName: 'Osaka', code: 'OSA', nights: 4, transportToNext: null }
      ]
    });
    showNotification('AI Journey Accepted & Saved to My Trips!', 'success');
    navigate(`/trips/${newTrip.id}`);
  };

  const handleCustomize = () => {
    navigate('/create-trip');
  };

  const handleRegenerate = () => {
    setPlannerState('generating');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {plannerState === 'form' && (
        <AIGeneratorSentenceForm onGenerate={handleStartGenerate} />
      )}

      {plannerState === 'generating' && (
        <AIProgressVisualizer onComplete={handleGenerationComplete} />
      )}

      {plannerState === 'result' && (
        <AIResultView
          generatedTrip={generatedTripData}
          onAccept={handleAcceptJourney}
          onCustomize={handleCustomize}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};
