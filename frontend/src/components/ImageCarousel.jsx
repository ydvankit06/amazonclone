import { useState } from 'react';

function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const current = images[index];

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-gray-200 rounded flex items-center justify-center h-80 bg-white">
        <img
          src={current}
          alt=""
          loading="lazy"
          className="max-h-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-16 w-16 border rounded flex items-center justify-center bg-white ${
                i === index ? 'border-amazon-yellow' : 'border-gray-200'
              }`}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                className="max-h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;

