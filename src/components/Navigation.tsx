import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';

const navigationItems = [
  { path: '/', label: 'Stories' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if ((event.key === '/' && !isTyping) || ((event.metaKey || event.ctrlKey) && event.key === 'k')) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => (
    `relative rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`
  );

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-1 px-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="My Climate Definition home">
            <img src="/img/logo.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-9 sm:w-9" />
            <span className="truncate font-editorial text-base font-semibold sm:text-xl">My Climate Definition</span>
          </NavLink>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Search stories">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </nav>

          <div className="flex shrink-0 items-center md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)} aria-label="Search stories">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t bg-background md:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={navLinkClass}
                    end={item.path === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navigation;
