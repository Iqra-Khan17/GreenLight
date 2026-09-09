import React, { useState } from 'react';
import { ScreenState, IdeaInput, IdeaVerdict } from './types';
import { analyzeIdeas } from './api';
import { Grain } from './components/Grain';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Room } from './components/Room';
import { Running } from './components/Running';
import { Verdict } from './components/Verdict';
import { MethodModal } from './components/MethodModal';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('hero');
  const [activeIdeas, setActiveIdeas] = useState<IdeaInput[]>([]);
  const [verdicts, setVerdicts] = useState<IdeaVerdict[]>([]);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);

  // Method / Evidence Modal
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [methodTab, setMethodTab] = useState<'method' | 'evidence'>('method');

  const handleNavigate = (screen: ScreenState) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMethod = (tab: 'method' | 'evidence' = 'method') => {
    setMethodTab(tab);
    setMethodModalOpen(true);
  };

  const handleRunGreenlight = async (ideas: IdeaInput[]) => {
    setActiveIdeas(ideas);
    setIsAnalysisReady(false);
    setCurrentScreen('running');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const results = await analyzeIdeas(ideas);
      setVerdicts(results);
      setIsAnalysisReady(true);
    } catch (err) {
      console.error('Analysis pipeline error:', err);
      // Fallback guarantees user never gets stuck
      setIsAnalysisReady(true);
    }
  };

  const handleRunningComplete = () => {
    setCurrentScreen('verdict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChallengeAgain = (verdict: IdeaVerdict) => {
    setActiveIdeas([verdict.originalIdea]);
    setCurrentScreen('room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewPitch = () => {
    setCurrentScreen('room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#C6F400] selection:text-black font-body overflow-x-hidden">
      {/* Studio Opening Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 35mm Film Grain & Subtle Atmospheric Vignette on Every Screen */}
      <Grain />

      {/* Floating Pill Studio Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenMethod={handleOpenMethod}
      />

      {/* Screen State Machine */}
      <main className="relative z-10 w-full min-h-screen flex flex-col">
        {currentScreen === 'hero' && (
          <Hero
            onEnterRoom={() => handleNavigate('room')}
            onExploreMethod={() => handleOpenMethod('method')}
          />
        )}

        {currentScreen === 'room' && (
          <Room
            onRunGreenlight={handleRunGreenlight}
            onBackToOverview={() => handleNavigate('hero')}
          />
        )}

        {currentScreen === 'running' && (
          <Running
            ideas={activeIdeas}
            isAnalysisReady={isAnalysisReady}
            onComplete={handleRunningComplete}
          />
        )}

        {currentScreen === 'verdict' && (
          <Verdict
            verdicts={verdicts}
            onNewPitch={handleNewPitch}
            onChallengeAgain={handleChallengeAgain}
          />
        )}
      </main>

      {/* Studio Method & Evidence Protocol Modal */}
      <MethodModal
        isOpen={methodModalOpen}
        activeTab={methodTab}
        onClose={() => setMethodModalOpen(false)}
        onSelectTab={(tab) => setMethodTab(tab)}
      />
    </div>
  );
}
