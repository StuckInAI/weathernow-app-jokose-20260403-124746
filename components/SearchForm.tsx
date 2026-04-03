'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  onLocate: (lat: number, lon: number) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, onLocate, loading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocate(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      () => {
        alert('Unable to retrieve your location. Please check permissions.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search city (e.g. London, Tokyo, New York)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
        aria-label="City search"
      />
      <button
        type="submit"
        className="search-btn"
        disabled={loading || !query.trim()}
      >
        {loading ? '⏳ Loading...' : '🔍 Search'}
      </button>
      <button
        type="button"
        className="locate-btn"
        onClick={handleLocate}
        disabled={loading || locating}
        title="Use my location"
      >
        {locating ? '📡 Locating...' : '📍 My Location'}
      </button>
    </form>
  );
}
