"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_z22yYF4SCyULcyBGVwpF4zsMNkCxxuox8qARBCkMM2xM";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export default function PostHogAnalyticsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        person_profiles: "identified_only",
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
