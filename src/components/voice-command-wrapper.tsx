'use client';

import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { VoiceCommandManager } from './voice-command-manager';

export function VoiceCommandWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <VoiceCommandManager />;
}
