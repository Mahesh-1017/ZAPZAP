'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { semanticProductSearch } from '@/ai/flows/semantic-product-search';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';

interface SearchBarProps {
  onSearchUpdate: (results: Product[]) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearchUpdate, onLoadingChange, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    onLoadingChange(true);
    try {
      const productInput = allProducts.map(p => ({name: p.name, description: p.description}));
      const results = await semanticProductSearch({ query, products: productInput });
      
      const matchedProducts = results.map(result => {
        return allProducts.find(p => p.name === result.name);
      }).filter((p): p is Product => p !== undefined);

      onSearchUpdate(matchedProducts);
    } catch (error) {
      console.error('Semantic search failed:', error);
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: 'Could not perform search. Please try again later.',
      });
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g., 'a shirt for running' or 'something breathable'"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Search'
        )}
      </Button>
      {query && <Button type="button" variant="outline" onClick={handleClear}>Clear</Button>}
    </form>
  );
}
