import { useEffect, useState } from 'react';

const HERO_SLIDES = [
  {
    id: 1,
    bgClass: 'bg-[#ff6a00]',
    title: 'Starting Rs.199',
    subtitle: 'Deals on fashion, beauty and everyday styles',
    badge: 'Unlimited 5% cashback with Amazon Pay ICICI Bank credit card',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Fashion accessories'
  },
  {
    id: 2,
    bgClass: 'bg-[#c6e7ff]',
    title: 'Up to 60% off',
    subtitle: 'Smart furniture for every room',
    badge: 'Extra savings on home upgrades and workspace must-haves',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Living room furniture'
  },
  {
    id: 3,
    bgClass: 'bg-[#fde7c7]',
    title: 'Lowest prices',
    subtitle: 'On top tech, audio and daily essentials',
    badge: 'Buy more, save more across the Amazon Clone store',
    image:
      'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Tech accessories'
  }
];

function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((current) =>
      current === 0 ? HERO_SLIDES.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="group relative z-0 h-[260px] w-full max-w-full overflow-hidden sm:h-[340px] lg:h-[430px]">
      <div
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`relative flex h-full w-full flex-shrink-0 cursor-pointer ${slide.bgClass}`}
          >
            <div className="mx-auto flex h-full w-full max-w-[1900px] items-start justify-between px-10 pt-10 sm:px-16 lg:px-24">
              <div className="z-10 flex max-w-[540px] flex-1 flex-col pt-4 text-white lg:pl-64">
                <h2 className="mb-1 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  {slide.title}
                </h2>
                <p className="mb-8 text-xl font-medium text-white sm:text-2xl lg:text-3xl">
                  {slide.subtitle}
                </p>
                <div className="inline-flex w-fit items-center gap-3 rounded-[2px] bg-white px-3 py-2 text-[#0f1111] shadow-sm">
                  <span className="bg-[#131921] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    amazon pay
                  </span>
                  <span className="max-w-[250px] text-xs font-bold sm:text-sm">
                    {slide.badge}
                  </span>
                </div>
              </div>

              <div className="relative hidden h-full w-[360px] overflow-hidden bg-white/80 shadow-sm md:block lg:w-[420px]">
                <img src={slide.image} alt={slide.imgAlt} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-0 top-[18%] z-30 flex h-24 w-12 items-center justify-center bg-transparent opacity-0 transition-opacity focus:outline-none focus:shadow-[inset_0_0_0_2px_#008296] group-hover:opacity-100 sm:h-32 lg:top-[22%] lg:h-40 lg:w-16"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="#111111"
          className="h-10 w-10 stroke-[1.2] sm:h-12 sm:w-12"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-0 top-[18%] z-30 flex h-24 w-12 items-center justify-center bg-transparent opacity-0 transition-opacity focus:outline-none focus:shadow-[inset_0_0_0_2px_#008296] group-hover:opacity-100 sm:h-32 lg:top-[22%] lg:h-40 lg:w-16"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="#111111"
          className="h-10 w-10 stroke-[1.2] sm:h-12 sm:w-12"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent sm:h-40 lg:h-52" />
    </div>
  );
}

export default HeroBanner;
