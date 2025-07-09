
"use client";

import { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBirthdayConfig } from '@/hooks/use-birthday-config';
import { hexToHsl } from '@/lib/utils';

export default function DynamicThemeInjector() {
  const { config, isLoaded } = useBirthdayConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeStyles = useMemo(() => {
    if (!isLoaded) return null;
    
    const styles = [];
    const colorMappings: { [key: string]: string | undefined } = {
        '--primary': config.primaryColor,
        '--accent': config.accentColor,
        '--background': config.backgroundColor,
        '--foreground': config.foregroundColor,
        '--card': config.cardColor,
        '--border': config.borderColor,
    };

    for (const [property, hexValue] of Object.entries(colorMappings)) {
        if (hexValue) {
            const hslValue = hexToHsl(hexValue);
            if (hslValue) {
                styles.push(`${property}: ${hslValue};`);
            }
        }
    }
    
    if (styles.length === 0) return null;
    
    return `:root { ${styles.join(' ')} }`;
  }, [config, isLoaded]);

  if (!themeStyles || !mounted) {
    return null;
  }

  // Check if document.head exists before creating a portal
  if (typeof window === 'undefined' || !document.head) {
    return null;
  }

  return createPortal(
    <style id="dynamic-theme-styles">{themeStyles}</style>,
    document.head
  );
}
