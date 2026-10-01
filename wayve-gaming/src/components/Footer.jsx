import { useEffect, useState } from 'react';
import Logo from './Logo';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Games', href: '/games' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'fa-facebook-f', href: 'https://www.facebook.com/waywegaming' },
  { name: 'YouTube', icon: 'fa-youtube', href: 'https://www.youtube.com/@waywegaming/videos' },
  {
    name: 'LinkedIn',
    icon: 'fa-linkedin-in',
    href: 'https://www.linkedin.com/company/waywegaming/home/',
  },
];

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t bg-white dark:bg-black dark:border-gray-800 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-7 border-b border-gray-800 py-5 md:flex-row">
          <Logo size={48} variant="footer" />

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  link.active
                    ? 'font-semibold text-primary'
                    : 'font-medium text-gray-400 transition hover:text-primary'
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ name, icon, href }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-primary"
              >
                <i className={`fab ${icon} text-[11px]`} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} WayWe Gaming, All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="transition hover:text-primary">Privacy Policy / Term & Conditions</a>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className={`fixed bottom-8 right-8 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-primary text-primary shadow-lg shadow-orange-500/10 transition hover:bg-primary hover:text-white ${
            showTop ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <i className="fas fa-arrow-up text-xs" />
        </button>
      </div>
    </footer>
  );
}