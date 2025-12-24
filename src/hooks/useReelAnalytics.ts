// src/hooks/useReelAnalytics.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface ReelAnalyticsData {
  vehicleId: string;
  viewDuration: number; // milliseconds
  isCompleteView: boolean; // viewed for at least 3 seconds
  interactionType?: "favorite" | "share" | "view_details" | "next" | "previous";
  timestamp: Date;
}

export interface ReelSessionAnalytics {
  sessionId: string;
  totalReelsViewed: number;
  totalTimeSpent: number;
  interactions: {
    favorites: number;
    shares: number;
    viewDetails: number;
  };
  reelViews: ReelAnalyticsData[];
}

const COMPLETE_VIEW_THRESHOLD = 3000; // 3 seconds

export const useReelAnalytics = (vehicleId: string, isActive: boolean) => {
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<ReelSessionAnalytics>(() => {
    // Try to restore session from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("reelAnalytics");
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return {
      sessionId: generateSessionId(),
      totalReelsViewed: 0,
      totalTimeSpent: 0,
      interactions: {
        favorites: 0,
        shares: 0,
        viewDetails: 0,
      },
      reelViews: [],
    };
  });

  const hasRecordedView = useRef(false);

  // Generate unique session ID
  function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start tracking when reel becomes active
  useEffect(() => {
    if (isActive && !viewStartTime) {
      setViewStartTime(Date.now());
      hasRecordedView.current = false;
    }
  }, [isActive, viewStartTime]);

  // Track view duration when reel becomes inactive
  useEffect(() => {
    return () => {
      if (viewStartTime && !hasRecordedView.current) {
        const duration = Date.now() - viewStartTime;
        recordView(duration);
        hasRecordedView.current = true;
      }
    };
  }, [viewStartTime, vehicleId]);

  // Record view to backend and session
  const recordView = useCallback(async (duration: number) => {
    const isComplete = duration >= COMPLETE_VIEW_THRESHOLD;
    
    const analyticsData: ReelAnalyticsData = {
      vehicleId,
      viewDuration: duration,
      isCompleteView: isComplete,
      timestamp: new Date(),
    };

    // Update session data
    setSessionData(prev => {
      const updated = {
        ...prev,
        totalReelsViewed: prev.totalReelsViewed + 1,
        totalTimeSpent: prev.totalTimeSpent + duration,
        reelViews: [...prev.reelViews, analyticsData],
      };

      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reelAnalytics", JSON.stringify(updated));
      }

      return updated;
    });

    // Send to backend
    try {
      await fetch("/api/analytics/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyticsData),
      });
    } catch (error) {
      console.error("Failed to record analytics:", error);
    }
  }, [vehicleId]);

  // Track interactions
  const trackInteraction = useCallback(async (
    type: "favorite" | "share" | "view_details"
  ) => {
    setSessionData(prev => {
      const updated = {
        ...prev,
        interactions: {
          ...prev.interactions,
          [type === "favorite" ? "favorites" : type === "share" ? "shares" : "viewDetails"]: 
            prev.interactions[type === "favorite" ? "favorites" : type === "share" ? "shares" : "viewDetails"] + 1,
        },
      };

      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reelAnalytics", JSON.stringify(updated));
      }

      return updated;
    });

    // Send to backend
    try {
      await fetch("/api/analytics/reels/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          interactionType: type,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  }, [vehicleId]);

  // Get session summary
  const getSessionSummary = useCallback(() => {
    const avgTimePerReel = sessionData.totalReelsViewed > 0
      ? sessionData.totalTimeSpent / sessionData.totalReelsViewed
      : 0;

    const engagementRate = sessionData.totalReelsViewed > 0
      ? ((sessionData.interactions.favorites + 
          sessionData.interactions.shares + 
          sessionData.interactions.viewDetails) / 
         sessionData.totalReelsViewed) * 100
      : 0;

    return {
      ...sessionData,
      avgTimePerReel: Math.round(avgTimePerReel),
      engagementRate: Math.round(engagementRate * 10) / 10,
    };
  }, [sessionData]);

  return {
    trackInteraction,
    sessionData,
    getSessionSummary,
  };
};

export default useReelAnalytics;