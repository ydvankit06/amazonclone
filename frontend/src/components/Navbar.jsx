import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import { useCart } from '../hooks/useCart.js';

const CATEGORY_OPTIONS = [
  { slug: 'all', label: 'All' },
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'clothing', label: 'Clothing' },
  { slug: 'books', label: 'Books' },
  { slug: 'home', label: 'Home' }
];

const SECONDARY_NAV_ITEMS = [
  { label: 'Best Sellers', section: 'best-sellers' },
  { label: 'Health, Household & Personal Care', category: 'home' },
  { label: 'Mobiles', section: 'mobiles', category: 'electronics' },
  { label: 'Books', category: 'books' }
];

function Navbar() {
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [langOpen, setLangOpen] = useState(false);

  const t = {
    deliverTo: 'Deliver to',
    india: 'India',
    helloSignIn: 'Hello, sign in',
    accountsLists: 'Accounts & Lists',
    returns: 'Returns',
    orders: '& Orders',
    cart: 'Cart'
  };

  const currentCategory = searchParams.get('category') ?? 'all';

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    next.set('page', '1');
    next.delete('section');
    navigate({ pathname: '/', search: next.toString() });
  };

  const handleNavSelection = ({ category = 'all', section } = {}) => {
    const next = new URLSearchParams(searchParams);

    if (category === 'all') {
      next.delete('category');
    } else {
      next.set('category', category);
    }

    if (section) {
      next.set('section', section);
    } else {
      next.delete('section');
    }

    next.delete('q');
    next.set('page', '1');
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <header className="relative z-20 text-white">
      <div className="bg-[#131921]">
        <div className="mx-auto flex h-[60px] max-w-[1900px] items-center gap-3 px-3 md:px-4">
          <Link
            to="/"
            className="flex items-end gap-0.5 rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white"
          >
            <div className="leading-none">
              <div className="text-[2rem] font-black tracking-[-0.06em] text-white">
                amazon
              </div>
              <div className="-mt-1 h-[10px] w-[68px] rounded-full border-[3px] border-[#f3a847] border-t-transparent border-l-transparent border-r-transparent" />
            </div>
            <span className="mb-1 text-sm font-bold text-white">.in</span>
          </Link>

          <button
            type="button"
            className="hidden min-w-[150px] items-center gap-1 rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white lg:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-[11px] text-[#cccccc]">{t.deliverTo}</span>
              <span className="text-[15px] font-bold leading-tight">{t.india}</span>
            </div>
          </button>

          <div className="flex flex-1 items-stretch">
            <div className="hidden md:flex">
              <select
                value={currentCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="h-10 rounded-l-md border-r border-[#cdcdcd] bg-[#e6e6e6] px-3 text-sm text-[#555] focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <SearchBar />
            </div>
          </div>

          <nav className="flex items-center gap-1 text-xs md:text-sm">
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                className="flex items-center gap-1 rounded-sm px-2 py-2 hover:outline hover:outline-1 hover:outline-white"
              >
                <span className="rounded-sm bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#131921]">
                  IN
                </span>
                <span className="text-sm font-bold">EN</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mt-[1px] h-3 w-3"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 z-30 mt-1 w-28 rounded bg-white py-1 text-xs text-black shadow-lg">
                  <button
                    type="button"
                    onClick={() => setLangOpen(false)}
                    className="w-full px-3 py-1 text-left hover:bg-gray-100"
                  >
                    English (EN)
                  </button>
                </div>
              )}
            </div>

            <div className="group relative hidden md:block">
              <Link
                to="/login"
                className="flex cursor-pointer flex-col rounded-sm px-2 py-2 leading-tight hover:outline hover:outline-1 hover:outline-white"
              >
                <span className="text-[12px] leading-tight text-white">
                  {t.helloSignIn}
                </span>
                <span className="flex items-center gap-0.5 text-[15px] font-bold text-white">
                  {t.accountsLists}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mt-[1px] h-3 w-3 transform transition-transform duration-200 group-hover:rotate-180"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </span>
              </Link>

              <div className="absolute right-[-20px] top-[40px] z-50 hidden w-[480px] cursor-default flex-col pt-4 group-hover:flex">
                <div className="relative rounded-sm border border-[#ccc] bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  <div className="absolute -top-2 right-[50px] h-4 w-4 origin-center rotate-45 border-l border-t border-[#ccc] bg-white z-40" />

                  <div className="relative z-50 flex items-center justify-between rounded-t-sm bg-[#e8f6f8] px-5 py-3">
                    <div className="text-[13px] text-gray-800">
                      Who is shopping? Select a profile.
                    </div>
                    <Link
                      to="/"
                      className="text-[13px] font-medium text-[#007185] hover:text-[#c45500] hover:underline"
                    >
                      Manage Profiles &gt;
                    </Link>
                  </div>

                  <div className="flex gap-6 p-5">
                    <div className="w-[180px] border-r border-[#eee] pr-4">
                      <h3 className="mb-3 text-sm font-bold text-black">Your Lists</h3>
                      <ul className="flex w-full flex-col items-start space-y-2 text-[13px] text-[#444]">
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Create a Wish List</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Wish from Any Website</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Baby Wishlist</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Discover Your Style</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Explore Showroom</Link></li>
                      </ul>
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-3 text-sm font-bold text-black">Your Account</h3>
                      <ul className="flex w-full flex-col items-start space-y-2 text-[13px] text-[#444]">
                        <li className="mb-2"><Link to="/login" className="inline-block w-full text-xs hover:text-[#c45500] hover:underline">Switch Accounts</Link></li>
                        <li className="mb-2"><Link to="/login" className="inline-block w-full text-xs hover:text-[#c45500] hover:underline">Sign Out</Link></li>
                        <div className="my-2 w-full border-t border-[#eee]" />
                        <li><Link to="/login" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Account</Link></li>
                        <li><Link to="/orders" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Orders</Link></li>
                        <li><Link to="/wishlist" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Wish List</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Keep shopping for</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Recommendations</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Recalls and Product Safety Alerts</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Prime Membership</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Prime Video</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Subscribe & Save Items</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Memberships & Subscriptions</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Your Seller Account</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Content Library</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Devices</Link></li>
                        <li><Link to="/" className="inline-block w-full hover:text-[#c45500] hover:underline">Register for a free Business Account</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/orders"
              className="hidden rounded-sm px-2 py-2 leading-tight hover:outline hover:outline-1 hover:outline-white md:flex"
            >
              <span className="text-[12px] text-white">{t.returns}</span>
              <span className="text-[15px] font-bold text-white">{t.orders}</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-end gap-1 rounded-sm px-2 py-2 text-white hover:outline hover:outline-1 hover:outline-white"
            >
              <div className="relative flex items-center">
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l2-7H6.4M7 13L5.4 5M7 13l-2 7m12-7l-2 7m-6 0a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </span>
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-[#febd69] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-black">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden text-[15px] font-bold text-white md:inline">
                {t.cart}
              </span>
            </Link>
          </nav>
        </div>

        <div className="hidden bg-[#232f3e] text-sm md:block">
          <div className="mx-auto flex h-10 max-w-[1900px] items-center gap-4 overflow-x-auto whitespace-nowrap px-4 hide-scrollbar">
            <button
              type="button"
              onClick={() => handleNavSelection({ category: 'all' })}
              className="flex items-center gap-1 rounded-sm px-2 py-1 font-bold hover:outline hover:outline-1 hover:outline-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              All
            </button>

            {SECONDARY_NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleNavSelection({
                    category: item.category ?? 'all',
                    section: item.section
                  })
                }
                className="rounded-sm px-1 py-1 text-[15px] text-white hover:outline hover:outline-1 hover:outline-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
