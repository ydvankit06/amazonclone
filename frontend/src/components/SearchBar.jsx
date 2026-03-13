import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SearchBar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate('/');
    } else {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex h-10">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands and more"
        className="flex-1 border-0 px-4 text-[16px] text-[#111111] focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex w-12 items-center justify-center rounded-r-md bg-[#febd69] text-[#111111] hover:bg-[#f3a847] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l4 4" />
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;

