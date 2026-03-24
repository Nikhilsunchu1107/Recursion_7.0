import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { analyzeChannel, discoverCompetitors, generateStrategy, runFullAnalysis } from '../lib/api';

const STORAGE_KEY = 'spyglass.analysis.v1';

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

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed.channelUrl) {
        setChannelUrl(parsed.channelUrl);
      }
      setChannelData(parsed.channelData || null);
      setCompetitors(parsed.competitors || null);
      setPatterns(parsed.patterns || null);
      setStrategy(parsed.strategy || null);
    } catch {
      // Ignore hydration issues and start clean.
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          channelUrl,
          channelData,
          competitors,
          patterns,
          strategy,
          updatedAt: Date.now(),
        }),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [channelUrl, channelData, competitors, patterns, strategy]);

  const resetAll = useCallback(() => {
    setChannelUrl('');
    setChannelData(null);
    setCompetitors(null);
    setPatterns(null);
    setStrategy(null);
    setLoadingStage(null);
    setError(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const runCorePipeline = useCallback(
    async (rawChannelUrl, options = {}) => {
      const normalized = rawChannelUrl.trim();
      const { force = false } = options;

      if (!normalized) {
        throw new Error('Please enter a YouTube channel URL.');
      }

      const isSameChannel = normalized === channelUrl;
      const hasCoreData = Boolean(channelData && competitors);

      if (!force && isSameChannel && hasCoreData) {
        return { channelData, competitors };
      }

      setError(null);
      setChannelUrl(normalized);

      if (!isSameChannel) {
        setChannelData(null);
        setCompetitors(null);
        setPatterns(null);
        setStrategy(null);
      }

      try {
        setLoadingStage('channel');
        const nextChannelData = await analyzeChannel(normalized);
        setChannelData(nextChannelData);

        setLoadingStage('competitors');
        const nextCompetitors = await discoverCompetitors(normalized);
        setCompetitors(nextCompetitors);

        return {
          channelData: nextChannelData,
          competitors: nextCompetitors,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to analyze channel.';
        setError(message);
        throw err;
      } finally {
        setLoadingStage(null);
      }
    },
    [channelUrl, channelData, competitors],
  );

  const runAnalysisPipeline = useCallback(
    async (rawChannelUrl, options = {}) => {
      const normalized = rawChannelUrl.trim();
      const {
        force = false,
        includePatterns = true,
        includeStrategy = true,
      } = options;

      await runCorePipeline(normalized, { force });

      try {
        if (includePatterns && (force || !patterns || normalized !== channelUrl)) {
          setLoadingStage('patterns');
          const nextPatterns = await runFullAnalysis(normalized);
          setPatterns(nextPatterns);
        }

        if (includeStrategy && (force || !strategy || normalized !== channelUrl)) {
          setLoadingStage('strategy');
          const nextStrategy = await generateStrategy(normalized);
          setStrategy(nextStrategy);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete analysis.';
        setError(message);
        throw err;
      } finally {
        setLoadingStage(null);
      }
    },
    [channelUrl, patterns, runCorePipeline, strategy],
  );

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
      runCorePipeline,
      runAnalysisPipeline,
    }),
    [
      channelUrl,
      channelData,
      competitors,
      patterns,
      strategy,
      loadingStage,
      error,
      resetAll,
      runCorePipeline,
      runAnalysisPipeline,
    ],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}
