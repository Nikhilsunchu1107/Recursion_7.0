import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const AnalysisContext = createContext(null);

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within <AnalysisProvider>');
  return ctx;
}

export function AnalysisProvider({ children }) {
  const [channelUrl, setChannelUrl] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [strategy, setStrategy] = useState(null);

  const [loadingStage, setLoadingStage] = useState(null); // 'channel' | 'competitors' | 'patterns' | 'strategy' | null
  const [error, setError] = useState(null);

  const resetAll = useCallback(() => {
    setChannelUrl('');
    setChannelData(null);
    setCompetitors(null);
    setPatterns(null);
    setStrategy(null);
    setLoadingStage(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      channelUrl,
      channelData,
      competitors,
      patterns,
      strategy,
      loadingStage,
      error,
      setChannelUrl,
      setChannelData,
      setCompetitors,
      setPatterns,
      setStrategy,
      setLoadingStage,
      setError,
      resetAll,
    }),
    [channelUrl, channelData, competitors, patterns, strategy, loadingStage, error, resetAll],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}
