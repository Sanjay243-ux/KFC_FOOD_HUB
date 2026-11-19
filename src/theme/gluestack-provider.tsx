import React from 'react';
import { GluestackUIProvider as BaseGluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

interface GluestackProviderProps {
  children: React.ReactNode;
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  return (
    <BaseGluestackUIProvider config={config}>
      {children}
    </BaseGluestackUIProvider>
  );
}
