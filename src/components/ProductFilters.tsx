import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types';

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  categories,
  totalResults,
  onResetFilters,
}) => {
  const gradesList = [
    'All Grades',
    'Nursery - Prep (Ages 3-5)',
    'KG - Class 1',
    'Class 1 - 3',
    'Class 3 - 5',
    'Class 1 - Class 5',
    'Middle School (6-8)',
  ];

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category !== 'all' ||
    filters.grade !== 'all' ||
    filters.audience !== 'all' ||
    filters.productType !== 'all'
  );

  return (
    <div className="bg-white rounded-xl border border-[#E8E5DD] p-4 sm:p-5 shadow-2xs mb-8">
      {/* Top Row: Search Input & Sort Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-stone-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by title, subject, grade, or keywords..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-stone-200 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs sm:text-sm text-stone-900 bg-[#FAFAF7] placeholder-stone-400 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap hidden lg:inline">
            Sort by:
          </span>
          <div className="relative w-full sm:w-48">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))
              }
              aria-label="Sort products by"
              className="w-full py-2.5 px-3 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-800 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="title">Title: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle Row: Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
            filters.category === 'all'
              ? 'bg-[#0B132B] text-white shadow-2xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
              filters.category === cat
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bottom Row: Grade, Audience & Product Type Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade Selector */}
          <select
            value={filters.grade}
            onChange={(e) => setFilters((prev) => ({ ...prev, grade: e.target.value }))}
            aria-label="Filter by grade"
            className="py-1.5 px-2.5 rounded-md border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:border-stone-400"
          >
            <option value="all">All Grades / Classes</option>
            {gradesList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Audience Filter */}
          <select
            value={filters.audience}
            onChange={(e) => setFilters((prev) => ({ ...prev, audience: e.target.value }))}
            aria-label="Filter by audience"
            className="py-1.5 px-2.5 rounded-md border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:border-stone-400"
          >
            <option value="all">Audience: All</option>
            <option value="schools">For Schools Only</option>
            <option value="parents">For Parents / Home</option>
          </select>

          {/* Product Type Filter */}
          <select
            value={filters.productType}
            onChange={(e) => setFilters((prev) => ({ ...prev, productType: e.target.value }))}
            aria-label="Filter by product type"
            className="py-1.5 px-2.5 rounded-md border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:border-stone-400"
          >
            <option value="all">Type: All Products</option>
            <option value="package">School Packages Only</option>
            <option value="individual">Individual Books</option>
          </select>
        </div>

        {/* Results count & Clear filters button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{totalResults}</strong> publications
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-stone-600 hover:text-stone-900 underline text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
