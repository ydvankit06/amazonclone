import { Link } from 'react-router-dom';

export default function CategoryWidget({ title, items, linkText, linkUrl }) {
  const isGrid = items && items.length > 1;

  return (
    <div className="z-20 flex h-full flex-col bg-white p-6 pb-5 shadow-[0_1px_3px_rgba(15,17,17,0.12)]">
      <h2 className="mb-4 text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#0F1111] md:text-[1.1rem]">
        {title}
      </h2>

      <div className="flex-1 flex flex-col justify-end">
        {isGrid ? (
          <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-4">
            {items.map((item, idx) => (
              <Link to={item.url || linkUrl} key={idx} className="group flex cursor-pointer flex-col">
                <div className="mb-2 flex aspect-square w-full items-center justify-center overflow-hidden bg-[#f7f8f8]">
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <span className="text-[13px] leading-5 text-[#0F1111]">{item.label}</span>
              </Link>
            ))}
          </div>
        ) : (
          <Link to={linkUrl} className="group mb-4 flex h-full max-h-[250px] cursor-pointer items-center justify-center overflow-hidden bg-[#F7F7F7]">
            <img src={items[0].image} alt={items[0].label || title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </Link>
        )}

        <div className="mt-auto">
          <Link to={linkUrl} className="text-[13px] font-medium text-[#2162a1] hover:text-[#c7511f] hover:underline">
            {linkText || 'See more'}
          </Link>
        </div>
      </div>
    </div>
  );
}
