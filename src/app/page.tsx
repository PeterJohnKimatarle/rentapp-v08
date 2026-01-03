'use client';

import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { getAllProperties } from '@/utils/propertyUtils';
import { parsePropertyType } from '@/utils/propertyTypes';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type SearchFilters = {
  propertyType?: string;
  profile?: string; // Sub-type within selected property type
  status?: string;
  region?: string;
  ward?: string;
  minPrice?: number; // Minimum price filter
  maxPrice?: number; // Maximum price filter
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState(getAllProperties());
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);
  const hasInitializedRef = useRef(false);

  // Update properties when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setProperties(getAllProperties());
    };

    const handlePropertyAdded = () => {
      setProperties(getAllProperties());
    };

    const handlePropertyUpdated = () => {
      setProperties(getAllProperties());
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom property added event
    window.addEventListener('propertyAdded', handlePropertyAdded);
    
    // Listen for property updated event
    window.addEventListener('propertyUpdated', handlePropertyUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertyAdded', handlePropertyAdded);
      window.removeEventListener('propertyUpdated', handlePropertyUpdated);
    };
  }, []);

  const applyFilters = useCallback(
    (items: ReturnType<typeof getAllProperties>, filters: SearchFilters | null) => {
      if (!filters) return items;

      const normalise = (value?: string) => value?.toLowerCase().trim();

      return items.filter((property) => {
        const matchesPropertyType = filters.propertyType ? (() => {
          const parsed = parsePropertyType(property.propertyType || '');
          // Match if the selected category matches the parent category
          return parsed?.parent === filters.propertyType;
        })() : true;

        const matchesProfile = filters.profile ? (() => {
          const parsed = parsePropertyType(property.propertyType || '');
          // Match if the selected profile matches the child sub-type
          return parsed?.child === filters.profile;
        })() : true;

        const matchesMinPrice = filters.minPrice
          ? property.price >= filters.minPrice
          : true;

        const matchesMaxPrice = filters.maxPrice
          ? property.price <= filters.maxPrice
          : true;

        const matchesStatus = filters.status ? property.status === filters.status : true;

        const matchesRegion = filters.region
          ? normalise(property.region) === normalise(filters.region)
          : true;

        const matchesWard = filters.ward ? normalise(property.ward) === normalise(filters.ward) : true;

        return matchesPropertyType && matchesStatus && matchesRegion && matchesWard && matchesProfile && matchesMinPrice && matchesMaxPrice;
      });
    },
    []
  );

  const filteredProperties = useMemo(
    () => applyFilters(properties, activeFilters),
    [properties, activeFilters, applyFilters]
  );

  // Restore search state from URL params, but only on client-side navigation (not page refresh)
  useEffect(() => {
    // Only run initialization logic once on mount
    if (hasInitializedRef.current) {
      // Subsequent updates (e.g., URL changes from navigation) - restore from URL
      const filters: SearchFilters = {};
      let hasFilters = false;

      const propertyType = searchParams.get('propertyType');
      const profile = searchParams.get('profile');
      const status = searchParams.get('status');
      const region = searchParams.get('region');
      const ward = searchParams.get('ward');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');

      if (propertyType) {
        filters.propertyType = propertyType;
        hasFilters = true;
      }
      if (profile) {
        filters.profile = profile;
        hasFilters = true;
      }
      if (status) {
        filters.status = status;
        hasFilters = true;
      }
      if (region) {
        filters.region = region;
        hasFilters = true;
      }
      if (ward) {
        filters.ward = ward;
        hasFilters = true;
      }
      if (minPrice) {
        const parsed = parseInt(minPrice, 10);
        if (!isNaN(parsed)) {
          filters.minPrice = parsed;
          hasFilters = true;
        }
      }
      if (maxPrice) {
        const parsed = parseInt(maxPrice, 10);
        if (!isNaN(parsed)) {
          filters.maxPrice = parsed;
          hasFilters = true;
        }
      }

      setActiveFilters(hasFilters ? filters : null);
      return;
    }

    // First mount - detect navigation type
    hasInitializedRef.current = true;

    // Detect if this is a page reload vs client-side navigation
    let isPageReload = false;
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const navigationType = navigationEntries[0].type;
          // 'reload' means page refresh, 'navigate' or 'back_forward' means client-side navigation
          isPageReload = navigationType === 'reload';
        }
      } catch (e) {
        // Fallback: if Performance API is not available, assume it's not a reload
        // This preserves existing behavior for older browsers
        isPageReload = false;
      }
    }

    if (isPageReload) {
      // Page refresh - ignore URL params and reset to default state
      // Don't clear URL params here - they're needed for back navigation history
      setActiveFilters(null);
    } else {
      // Client-side navigation (including back/forward) - restore from URL
      const filters: SearchFilters = {};
      let hasFilters = false;

      const propertyType = searchParams.get('propertyType');
      const profile = searchParams.get('profile');
      const status = searchParams.get('status');
      const region = searchParams.get('region');
      const ward = searchParams.get('ward');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');

      if (propertyType) {
        filters.propertyType = propertyType;
        hasFilters = true;
      }
      if (profile) {
        filters.profile = profile;
        hasFilters = true;
      }
      if (status) {
        filters.status = status;
        hasFilters = true;
      }
      if (region) {
        filters.region = region;
        hasFilters = true;
      }
      if (ward) {
        filters.ward = ward;
        hasFilters = true;
      }
      if (minPrice) {
        const parsed = parseInt(minPrice, 10);
        if (!isNaN(parsed)) {
          filters.minPrice = parsed;
          hasFilters = true;
        }
      }
      if (maxPrice) {
        const parsed = parseInt(maxPrice, 10);
        if (!isNaN(parsed)) {
          filters.maxPrice = parsed;
          hasFilters = true;
        }
      }

      setActiveFilters(hasFilters ? filters : null);
    }
  }, [searchParams, router]);

  const hasActiveFilters = activeFilters !== null;

  return (
    <Layout
      totalCount={properties.length}
      filteredCount={filteredProperties.length}
      hasActiveFilters={hasActiveFilters}
    >
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-2 lg:px-4 pt-1 sm:pt-2 lg:pt-3">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} showBookmarkConfirmation={false} />
            ))
          ) : (
            <div className="text-center py-8">
              {properties.length === 0 && !hasActiveFilters ? (
                <>
                  <p className="text-gray-500 text-xl">No properties available for now.</p>
                  <p className="text-gray-400 text-base mt-1">Check back later or contact us for further assistance.</p>
                </>
              ) : (
                <>
              <p className="text-gray-500 text-xl">No properties available for now.</p>
                  <p className="text-gray-400 text-base mt-1">Check back later or adjust your filters.</p>
                </>
              )}
            </div>
          )}
        </div>
    </div>
    </Layout>
  );
}
