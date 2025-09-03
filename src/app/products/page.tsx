'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(allProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchUpdate = (results: Product[]) => {
    setDisplayedProducts(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setDisplayedProducts(allProducts);
    setIsSearching(false);
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Find Your Perfect Fit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use our smart search to find the perfect gym tee. Just describe what you're looking for!
          </p>
        </section>

        <div className="flex justify-center">
          <SearchBar 
            onSearchUpdate={handleSearchUpdate} 
            onLoadingChange={setIsLoading}
            onClear={handleClearSearch}
          />
        </div>

        <div>
          {isSearching && !isLoading && (
            <p className="text-center mb-4 text-muted-foreground">
              Showing {displayedProducts.length} result(s) for your search.
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-64 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold">No products found</h3>
                  <p className="text-muted-foreground mt-2">
                    We couldn't find any products matching your search. Try a different query.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
