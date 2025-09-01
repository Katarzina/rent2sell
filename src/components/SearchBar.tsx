'use client';

import React from 'react';
import { Input } from './ui/input';
import { Search } from "lucide-react";
import { Button } from './ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { useSetRecoilState } from 'recoil';
import { searchQueryState } from '@/atoms/searchAtom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useLocale();
  const [localSearchQuery, setLocalSearchQuery] = React.useState('');
  const setGlobalSearchQuery = useSetRecoilState(searchQueryState);

  const handleSearch = (value: string) => {
    setLocalSearchQuery(value);
    setGlobalSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={t.hero.searchPlaceholder}
        className="pl-10 h-12 text-base pr-32"
        value={localSearchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch(localSearchQuery)}
      />
      <Button 
        size="lg" 
        className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
        onClick={() => handleSearch(localSearchQuery)}
      >
        {t.hero.searchButton}
      </Button>
    </div>
  );
}