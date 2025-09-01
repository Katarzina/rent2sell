'use client';

import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm lg:max-w-md">
      <Input
        type="search"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </form>
  );
}