"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import type { MandiSearchField } from "@/lib/mandiSearch";

type MandiSearchOutcome = "match" | "no_match";

interface MandiSearchResultAnalyticsProps {
  outcome: MandiSearchOutcome;
  matchType: MandiSearchField | "none";
}

export default function MandiSearchResultAnalytics({
  outcome,
  matchType,
}: MandiSearchResultAnalyticsProps) {
  const posthog = usePostHog();
  const capturedResult = useRef("");

  useEffect(() => {
    const captureKey = `${outcome}:${matchType}`;
    if (capturedResult.current === captureKey) return;

    capturedResult.current = captureKey;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("source");
    window.history.replaceState(
      window.history.state,
      "",
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
    );

    posthog.capture("mandi_search_result", {
      source: "homepage",
      outcome,
      match_type: matchType,
      $current_url: `${window.location.origin}/mandi-bhav`,
    });
  }, [matchType, outcome, posthog]);

  return null;
}
