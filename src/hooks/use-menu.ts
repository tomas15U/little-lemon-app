import { useEffect, useState } from 'react';

import { fetchMenuItems } from '@/services/menu-api';
import {
  filterMenuItems,
  getMenuCategories,
  initMenuTable,
  readMenuItems,
  writeMenuItems,
} from '@/services/menu-storage';
import { MenuItem } from '@/types/menu-item';

const SEARCH_DEBOUNCE_MS = 500;

type UseMenuResult = {
  menu: MenuItem[];
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  isLoading: boolean;
};

export function useMenu(): UseMenuResult {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      await initMenuTable();
      const stored = await readMenuItems();

      if (stored.length === 0) {
        const remote = await fetchMenuItems();
        await writeMenuItems(remote);
      }

      const allCategories = await getMenuCategories();
      if (isMounted) {
        setCategories(allCategories);
        setIsReady(true);
      }
    }

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchText(searchText), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    if (!isReady) return;
    let isMounted = true;

    filterMenuItems(selectedCategories, debouncedSearchText).then((items) => {
      if (isMounted) {
        setMenu(items);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isReady, selectedCategories, debouncedSearchText]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  return {
    menu,
    categories,
    selectedCategories,
    toggleCategory,
    searchText,
    setSearchText,
    isLoading,
  };
}
