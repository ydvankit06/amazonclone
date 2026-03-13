const FOOTER_COLUMNS = [
  {
    title: 'Get to Know Us',
    links: ['About Amazon Clone', 'Careers', 'Press Releases', 'Amazon Science']
  },
  {
    title: 'Connect with Us',
    links: ['Facebook', 'Twitter', 'Instagram', 'YouTube']
  },
  {
    title: 'Make Money with Us',
    links: [
      'Sell on Amazon Clone',
      'Sell under Amazon Accelerator',
      'Protect and Build Your Brand',
      'Supply to Amazon Clone'
    ]
  },
  {
    title: 'Let Us Help You',
    links: ['Your Account', 'Returns Centre', 'Recalls and Product Safety Alerts', 'Help']
  }
];

const LEGAL_LINKS = [
  'Conditions of Use & Sale',
  'Privacy Notice',
  'Interest-Based Ads'
];

const SPECIAL_LINKS = {
  Instagram: 'https://www.instagram.com/ydvankit06/'
};

function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-10 text-white">
      <button
        type="button"
        onClick={handleBackToTop}
        className="w-full bg-[#37475a] py-4 text-sm font-medium hover:bg-[#485769]"
      >
        Back to top
      </button>

      <div className="bg-[#232f3e] px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 border-b border-[#3a4553] pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-base font-bold text-white">{column.title}</h3>
              <ul className="space-y-2 text-sm text-[#dddddd]">
                {column.links.map((link) => (
                  <li key={link}>
                    {SPECIAL_LINKS[link] ? (
                      <a
                        href={SPECIAL_LINKS[link]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-left hover:underline"
                      >
                        {link}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="text-left hover:underline"
                      >
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 pt-8 text-sm text-[#dddddd] md:flex-row">
          <div className="flex items-end gap-0.5 rounded-sm border border-[#848688] px-4 py-2">
            <div className="leading-none">
              <div className="text-[1.9rem] font-black tracking-[-0.06em] text-white">
                amazon
              </div>
              <div className="-mt-1 h-[10px] w-[68px] rounded-full border-[3px] border-[#f3a847] border-t-transparent border-l-transparent border-r-transparent" />
            </div>
            <span className="mb-1 text-sm font-bold text-white">.in</span>
          </div>
          <button type="button" className="rounded border border-[#848688] px-4 py-2">
            English
          </button>
          <button type="button" className="rounded border border-[#848688] px-4 py-2">
            India
          </button>
        </div>
      </div>

      <div className="bg-[#131a22] px-6 py-8 text-center text-xs text-[#dddddd]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
          {LEGAL_LINKS.map((link) => (
            <button key={link} type="button" className="hover:underline">
              {link}
            </button>
          ))}
        </div>
        <p className="mt-4">Amazon Clone © {new Date().getFullYear()}, inspired storefront experience.</p>
      </div>
    </footer>
  );
}

export default Footer;
