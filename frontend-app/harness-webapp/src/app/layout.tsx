// src/app/layout.tsx
"use client";

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/createEmotionCache';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/app/styles/theme';
import Sidebar from '@/app/components/Sidebar';

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      </head>
      <body style={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <CacheProvider value={clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Sidebar />
            {children}
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}