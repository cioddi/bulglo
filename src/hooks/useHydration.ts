import { useEffect, useState } from 'react';
import { useProgressStore } from '../stores/useProgressStore';

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Check initial hydration status
    const checkInitialHydration = () => {
      if (useProgressStore.persist?.hasHydrated?.()) {
        setHydrated(true);
        return;
      }
      setHydrated(false);
    };

    // Listen for hydration completion
    const unsubHydrate = useProgressStore.persist?.onHydrate?.(() => {
      setHydrated(false);
    });
    
    const unsubFinishHydration = useProgressStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    checkInitialHydration();
    
    // Also check periodically until hydrated
    const interval = setInterval(() => {
      if (!hydrated && useProgressStore.persist?.hasHydrated?.()) {
        setHydrated(true);
      }
    }, 100);
    
    return () => {
      unsubHydrate?.();
      unsubFinishHydration?.();
      clearInterval(interval);
    };
  }, [hydrated]);

  return hydrated;
};