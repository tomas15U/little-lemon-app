import { useEffect, useState } from 'react';

import { fetchMenuItems } from '@/services/menu-api';
import { initMenuTable, readMenuItems, writeMenuItems } from '@/services/menu-storage';
import { MenuItem } from '@/types/menu-item';

type UseMenuResult = {
  menu: MenuItem[];
  isLoading: boolean;
};

export function useMenu(): UseMenuResult {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      await initMenuTable();
      const stored = await readMenuItems();

      if (stored.length > 0) {
        if (isMounted) {
          setMenu(stored);
          setIsLoading(false);
        }
        return;
      }

      const remote = await fetchMenuItems();
      await writeMenuItems(remote);
      if (isMounted) {
        setMenu(remote);
        setIsLoading(false);
      }
    }

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  return { menu, isLoading };
}
