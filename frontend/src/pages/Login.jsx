import { Link } from 'react-router-dom';

const ACCOUNT_CARDS = [
  {
    title: 'Your Orders',
    description: 'Track, return, or buy things again',
    accent: 'bg-[#f7e3c5]',
    icon: '📦',
    to: '/orders'
  },
  {
    title: 'Login & security',
    description: 'Edit login, name, and mobile number',
    accent: 'bg-[#ececec]',
    icon: '🔒',
    to: '/login'
  },
  {
    title: 'Prime',
    description: 'View benefits and payment settings',
    accent: 'bg-[#d9f1ff]',
    icon: '📦',
    to: '/'
  },
  {
    title: 'Your Addresses',
    description: 'Edit addresses for orders and gifts',
    accent: 'bg-[#fff1da]',
    icon: '📍',
    to: '/login'
  },
  {
    title: 'Your business account',
    description: 'Sign up for free to save up to 18% with GST invoice and bulk discounts',
    accent: 'bg-[#e4dcff]',
    icon: '🏢',
    to: '/'
  },
  {
    title: 'Payment options',
    description: 'Edit or add payment methods',
    accent: 'bg-[#dff4ff]',
    icon: '💳',
    to: '/checkout'
  },
  {
    title: 'Amazon Pay balance',
    description: 'Add money to your balance',
    accent: 'bg-[#fff1da]',
    icon: '💳',
    to: '/'
  },
  {
    title: 'Contact Us',
    description: 'Contact our customer service via phone or chat',
    accent: 'bg-[#dbf1f2]',
    icon: '🎧',
    to: '/'
  }
];

const ACCOUNT_GROUPS = [
  {
    title: 'Digital content and devices',
    links: ['Apps and more', 'Content Library', 'Devices', "Digital gifts you've received", 'Digital and device forum']
  },
  {
    title: 'Email alerts, messages, and ads',
    links: ['Advertising preferences', 'Communication preferences', 'SMS alert preferences', 'Message Centre', 'Alexa shopping notifications']
  },
  {
    title: 'More ways to pay',
    links: ['Default Purchase Settings', 'Amazon Pay', 'Coupons']
  },
  {
    title: 'Ordering and shopping preferences',
    links: ['Leave packaging feedback', 'Lists', 'Subscribe & Save', 'Manage Your Profiles']
  },
  {
    title: 'Other accounts',
    links: ['Amazon Business registration', 'Seller account', 'Amazon Web Services', 'Kindle Direct Publishing']
  },
  {
    title: 'Shopping programs and rentals',
    links: ['Gift Cards', 'Reload Your Balance', 'Amazon Family', 'Home Services']
  }
];

function Login() {
  return (
    <div className="bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-[1250px]">
        <h1 className="mb-6 text-[2.8rem] font-bold tracking-[-0.03em] text-[#0f1111]">
          Your Account
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ACCOUNT_CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="flex min-h-[174px] items-start gap-5 rounded-xl border border-[#d5d9d9] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(15,17,17,0.08)] transition hover:shadow-[0_2px_8px_rgba(15,17,17,0.12)]"
            >
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-[2.2rem] ${card.accent}`}
              >
                {card.icon}
              </div>
              <div className="pt-1">
                <h2 className="text-[1.05rem] font-semibold text-[#0f1111]">
                  {card.title}
                </h2>
                <p className="mt-2 text-[0.98rem] leading-7 text-[#565959]">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-[#d5d9d9] pt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ACCOUNT_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-[#d5d9d9] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(15,17,17,0.08)]"
              >
                <h3 className="mb-5 text-[1.05rem] font-bold text-[#0f1111]">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.links.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block text-left text-[0.98rem] text-[#2162a1] hover:text-[#c7511f] hover:underline"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
