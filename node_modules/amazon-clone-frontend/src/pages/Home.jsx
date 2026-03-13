import ProductCard from '../components/ProductCard.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import CategoryWidget from '../components/CategoryWidget.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useSearchParams } from 'react-router-dom';

const CATEGORY_FILTERS = [
  { slug: 'all', label: 'All', apiId: undefined },
  { slug: 'electronics', label: 'Electronics', apiId: 1 },
  { slug: 'clothing', label: 'Clothing', apiId: 2 },
  { slug: 'books', label: 'Books', apiId: 3 },
  { slug: 'home', label: 'Home', apiId: 4 }
];

const SECTION_COPY = {
  fresh: {
    title: 'Fresh picks for your next order',
    description: 'Browse everyday essentials and quick finds curated from the store.'
  },
  'mx-player': {
    title: 'Streaming picks and featured launches',
    description: 'Browse storefront-style highlights inspired by Amazon video and media shelves.'
  },
  sell: {
    title: 'Seller tools and featured products',
    description: 'Explore storefront-ready products while we route you through the marketplace.'
  },
  'gift-cards': {
    title: 'Gift cards and gifting ideas',
    description: 'Quick gifting picks, bundles and shopper favorites for every occasion.'
  },
  'amazon-pay': {
    title: 'Amazon Pay offers',
    description: 'Bank offers, cashback promos and payment-friendly picks in one place.'
  },
  'buy-again': {
    title: 'Buy again',
    description: 'Frequently shopped products and easy re-order style suggestions.'
  },
  'best-sellers': {
    title: 'Best sellers',
    description: 'See the most popular picks shoppers are checking out right now.'
  },
  'todays-deals': {
    title: "Today's deals",
    description: 'Current featured offers and discounted products in one place.'
  },
  mobiles: {
    title: 'Mobile accessories and tech',
    description: 'A focused electronics view for phone-friendly shopping.'
  },
  history: {
    title: 'Browsing history',
    description: 'Continue exploring products with an Amazon-style browsing shelf.'
  }
};

const DISCOVERY_WIDGETS = [
  {
    title: 'Revamp your home in style',
    linkText: 'Explore all',
    linkUrl: '/?category=home',
    items: [
      {
        label: 'Cushion covers, bedsheets & more',
        image:
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Figurines, vases & more',
        image:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Home storage',
        image:
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Lighting solutions',
        image:
          'https://images.unsplash.com/photo-1513501062021-e0ac82e2dfde?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      }
    ]
  },
  {
    title: 'Bulk order discounts + up to 18% GST savings',
    linkText: 'Create a free account',
    linkUrl: '/',
    items: [
      {
        label: 'Up to 45% off | Laptops',
        image:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
        url: '/?category=electronics'
      },
      {
        label: 'Up to 60% off | Kitchen appliances',
        image:
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Min. 50% off | Office furniture',
        image:
          'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Register using GST, Udyam, FSSAI or BPAN',
        image:
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80',
        url: '/'
      }
    ]
  },
  {
    title: 'Appliances for your home | Up to 55% off',
    linkText: 'See more',
    linkUrl: '/?category=home',
    items: [
      {
        label: 'Air conditioners',
        image:
          'https://images.unsplash.com/photo-1581093458791-9d09dca9f0c3?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Refrigerators',
        image:
          'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Microwaves',
        image:
          'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      },
      {
        label: 'Washing machines',
        image:
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=500&q=80',
        url: '/?category=home'
      }
    ]
  },
  {
    title: 'Get wholesale prices on 15 Cr+ products',
    linkText: 'Register now',
    linkUrl: '/',
    items: [
      {
        label: 'Business supplies',
        image:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=700&q=80',
        url: '/'
      }
    ]
  }
];

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const categorySlug = searchParams.get('category') ?? 'all';
  const sectionSlug = searchParams.get('section') ?? '';
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const currentCategory =
    CATEGORY_FILTERS.find((c) => c.slug === categorySlug) ?? CATEGORY_FILTERS[0];

  const { products, loading, error, pagination } = useProducts({
    search: query,
    page: currentPage,
    pageSize: 20,
    categoryId: currentCategory.apiId
  });

  const isSearching = Boolean(query.trim());
  const currentSection = SECTION_COPY[sectionSlug];
  const showHero = query === '' && currentCategory.slug === 'all' && !currentSection;

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), pagination?.totalPages || 1);
    const next = new URLSearchParams(searchParams);
    next.set('page', String(safePage));
    setSearchParams(next);
  };

  const renderSkeletonGrid = () => {
    const items = Array.from({ length: 8 });

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-col gap-3 border border-gray-200 bg-white p-4 shadow-sm animate-pulse"
          >
            <div className="h-52 bg-gray-200" />
            <div className="h-4 w-3/4 bg-gray-200" />
            <div className="h-4 w-1/2 bg-gray-200" />
            <div className="mt-2 h-8 bg-gray-200" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-[#eaeded] pb-10">
      <div className="mx-auto max-w-[1900px]">
        <section className="w-full">
          {showHero && <HeroBanner />}

          <div
            className={`relative z-20 px-4 ${
              showHero ? '-mt-20 md:-mt-32 lg:-mt-56' : 'pt-6'
            }`}
          >
            {showHero && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {DISCOVERY_WIDGETS.map((widget, idx) => (
                  <CategoryWidget
                    key={idx}
                    title={widget.title}
                    items={widget.items}
                    linkText={widget.linkText}
                    linkUrl={widget.linkUrl}
                  />
                ))}
              </div>
            )}

            {(query || currentCategory.slug !== 'all' || currentSection) && (
              <div className="mb-4 border border-gray-200 bg-white p-5 text-sm text-gray-800 shadow-sm">
                {currentSection && (
                  <div className="mb-2">
                    <h1 className="text-2xl font-bold text-[#0f1111]">
                      {currentSection.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      {currentSection.description}
                    </p>
                  </div>
                )}
                {query && (
                  <p>
                    Showing results for{' '}
                    <span className="font-bold text-[#c45500]">"{query}"</span>
                  </p>
                )}
                {!query && currentCategory.slug !== 'all' && (
                  <p>
                    Category: <span className="font-bold">{currentCategory.label}</span>
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="mb-4 bg-white p-4 text-sm text-red-600 shadow-sm">
                Failed to load products. Please try again.
              </p>
            )}

            {loading ? (
              renderSkeletonGrid()
            ) : products.length === 0 ? (
              <p className="bg-white p-4 text-gray-700 shadow-sm">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isSearching && pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center text-sm">
                <div className="flex overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="border-r border-gray-300 px-4 py-3 font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    &lt; Previous
                  </button>
                  <div className="flex items-center px-6 py-3 font-medium text-gray-700">
                    {pagination.page} / {pagination.totalPages}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="border-l border-gray-300 px-4 py-3 font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
