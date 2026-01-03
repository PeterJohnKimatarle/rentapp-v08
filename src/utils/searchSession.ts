/**
 * In-memory search session store
 * Stores searchSessionId that persists only during the current page session
 * Cleared on page refresh (not persisted to localStorage/sessionStorage)
 */

let searchSessionId: string | undefined = undefined;
let searchFilters: {
  propertyType?: string;
  profile?: string;
  status?: string;
  region?: string;
  ward?: string;
  minPrice?: number;
  maxPrice?: number;
} | null = null;

/**
 * Generate a unique search session ID
 */
export const generateSearchSessionId = (): string => {
  return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Set the active search session
 */
export const setSearchSession = (
  sessionId: string,
  filters: {
    propertyType?: string;
    profile?: string;
    status?: string;
    region?: string;
    ward?: string;
    minPrice?: number;
    maxPrice?: number;
  } | null
) => {
  searchSessionId = sessionId;
  searchFilters = filters;
};

/**
 * Get the current search session ID
 */
export const getSearchSessionId = (): string | undefined => {
  return searchSessionId;
};

/**
 * Get the current search filters
 */
export const getSearchFilters = (): typeof searchFilters => {
  return searchFilters;
};

/**
 * Clear the search session (called on page refresh)
 */
export const clearSearchSession = () => {
  searchSessionId = undefined;
  searchFilters = null;
};

