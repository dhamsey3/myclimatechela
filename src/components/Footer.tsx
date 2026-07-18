import { Link } from 'react-router-dom';
import { ArrowUp, Globe, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { icon: Twitter, label: 'X / Twitter', url: 'https://x.com/cmdefinition' },
  { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/myclimatedefinition' },
  { icon: Globe, label: 'Medium', url: 'https://medium.com/@myclimatedefinition' },
];

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-lg">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/img/logo.png" alt="" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-editorial text-xl font-semibold">My Climate Definition</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Personal stories and practical perspectives that connect climate change to the choices, places, and systems of everyday life.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground hover:underline">Stories</Link>
            <Link to="/about" className="hover:text-foreground hover:underline">About</Link>
            <Link to="/contact" className="hover:text-foreground hover:underline">Contact</Link>
            <a href="https://medium.com/@myclimatedefinition" target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">
              Full archive on Medium
            </a>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Follow</h2>
          <div className="mt-4 flex gap-2">
            {socialLinks.map(({ icon: Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} My Climate Definition. Stories for a changing world.</p>
        <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top <ArrowUp className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </footer>
);

export default Footer;
