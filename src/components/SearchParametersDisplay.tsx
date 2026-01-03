'use client';

import { useState, useEffect } from 'react';
import { getSearchSessionId, getSearchFilters } from '@/utils/searchSession';
import { getPropertyTypeDisplayLabel } from '@/utils/propertyTypes';
import { X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { generateSearchSessionId, setSearchSession } from '@/utils/searchSession';

// Helper to format region name
const formatRegion = (region?: string): string => {
  if (!region) return '';
  return region.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper to format ward name
const formatWard = (ward?: string): string => {
  if (!ward) return '';
  return ward.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper to format price
const formatPrice = (price?: number): string => {
  if (!price) return '';
  return price.toLocaleString('en-US');
};

type SearchFilters = {
  propertyType?: string;
  profile?: string;
  status?: string;
  region?: string;
  ward?: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function SearchParametersDisplay() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Parse filters from URL params
  const parseFiltersFromURL = (): SearchFilters | null => {
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

    return hasFilters ? filters : null;
  };

  // Check for active search session and update filters
  useEffect(() => {
    const checkSearchSession = () => {
      const searchSessionId = getSearchSessionId();
      const sessionFilters = getSearchFilters();
      const urlFilters = parseFiltersFromURL();
      
      // If search session exists, use session filters, otherwise use URL filters
      if (searchSessionId) {
        setIsSearchActive(true);
        // Prefer session filters, fallback to URL filters
        setSearchFilters(sessionFilters || urlFilters);
      } else {
        // No active session - check if URL has filters (bookmark/external link)
        if (urlFilters) {
          setIsSearchActive(true);
          setSearchFilters(urlFilters);
        } else {
          setIsSearchActive(false);
          setSearchFilters(null);
        }
      }
    };

    // Check immediately
    checkSearchSession();

    // Poll periodically to catch changes
    const interval = setInterval(checkSearchSession, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Don't render if search is not active
  if (!isSearchActive || !searchFilters) {
    return null;
  }

  const handleClearSearch = () => {
    // Clear search session
    setSearchSession(generateSearchSessionId(), null);
    
    // Navigate to homepage without search params
    const allowedPages = ['/', '/bookmarks', '/my-properties', '/recently-removed-bookmarks'];
    const isAllowedPage = allowedPages.includes(pathname);

    if (!isAllowedPage) {
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const parameters: Array<{ label: string; value: string }> = [];

  if (searchFilters.propertyType) {
    const displayLabel = getPropertyTypeDisplayLabel(searchFilters.propertyType);
    parameters.push({ label: 'Type', value: displayLabel });
  }

  if (searchFilters.profile) {
    const displayLabel = getPropertyTypeDisplayLabel(searchFilters.profile);
    parameters.push({ label: 'Profile', value: displayLabel });
  }

  if (searchFilters.status) {
    parameters.push({ 
      label: 'Status', 
      value: searchFilters.status === 'available' ? 'Available' : 'Occupied' 
    });
  }

  if (searchFilters.region) {
    parameters.push({ label: 'Region', value: formatRegion(searchFilters.region) });
  }

  if (searchFilters.ward) {
    parameters.push({ label: 'Ward', value: formatWard(searchFilters.ward) });
  }

  if (searchFilters.minPrice || searchFilters.maxPrice) {
    if (searchFilters.minPrice && searchFilters.maxPrice) {
      parameters.push({ 
        label: 'Price', 
        value: `Tsh ${formatPrice(searchFilters.minPrice)} - ${formatPrice(searchFilters.maxPrice)}` 
      });
    } else if (searchFilters.minPrice) {
      parameters.push({ 
        label: 'Min Price', 
        value: `Tsh ${formatPrice(searchFilters.minPrice)}+` 
      });
    } else if (searchFilters.maxPrice) {
      parameters.push({ 
        label: 'Max Price', 
        value: `Tsh ${formatPrice(searchFilters.maxPrice)}` 
      });
    }
  }

  if (parameters.length === 0) {
    return null;
  }

  return (
    <>
      {/* Fixed search parameters bar */}
      <div className="fixed top-14 left-0 right-0 bg-green-50 border-b border-green-200 px-2 sm:px-4 py-2 z-20 xl:left-64 xl:right-80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-green-800">Search:</span>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {parameters.map((param, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs sm:text-sm font-medium border border-green-300"
              >
                <span className="font-semibold">{param.label}:</span>
                <span>{param.value}</span>
              </span>
            ))}
          </div>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-200 rounded-md transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <div className="h-[calc(2rem+4px)] xl:h-[calc(2rem+4px)]" />
    </>
  );
}

