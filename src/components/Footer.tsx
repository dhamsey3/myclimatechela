import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Heart, Twitter, Linkedin, Globe, ArrowUp } from 'lucide-react';

interface FooterLink {
  label: string;
  url: string;
  type: 'internal' | 'external';
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      icon: <Twitter className="w-5 h-5" />,
      label: 'Twitter',
      url: 'https://twitter.com/myclimatedef',
      color: 'hover:text-blue-400'
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn', 
      url: 'https://linkedin.com/company/myclimatedefinition',
      color: 'hover:text-blue-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Medium',
      url: 'https://medium.com/@myclimatedefinition',
      color: 'hover:text-green-500'
    }
  ];

  const footerLinks: FooterSection[] = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', url: '/', type: 'internal' },
        { label: 'About Us', url: '/about', type: 'internal' },
        { label: 'Contact', url: '/contact', type: 'internal' },
        { label: 'All Posts', url: './posts.html', type: 'external' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Climate Stories', url: './posts.html', type: 'external' },
        { label: 'Sustainability Tips', url: './posts/sustainability-tips/', type: 'external' },
        { label: 'Climate Definition', url: './posts/welcome-to-my-climate-definition/', type: 'external' },
        { label: 'Medium Blog', url: 'https://medium.com/@myclimatedefinition', type: 'external' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-green-50 via-blue-50 to-teal-50 dark:from-green-950 dark:via-blue-950 dark:to-teal-950 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="./img/logo.png" 
                alt="My Climate Definition" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">
                My Climate Definition
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Exploring what climate means to everyday life through stories, definitions, 
              and experiments in sustainability. Join our community working toward a 
              more sustainable future.
            </p>
            
            {/* Support Button */}
            <Button
              onClick={() => window.open('https://www.buymeacoffee.com/korirjpatr1', '_blank')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 mb-4"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Support Our Work
              <Heart className="w-4 h-4 ml-2" />
            </Button>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(social.url, '_blank')}
                  className={`text-muted-foreground ${social.color} transition-colors`}
                  aria-label={social.label}
                >
                  {social.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link: FooterLink) => (
                  <li key={link.label}>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400 justify-start p-0 h-auto font-normal"
                      onClick={() => {
                        if (link.type === 'internal') {
                          navigate(link.url);
                        } else if (link.url.startsWith('http')) {
                          window.open(link.url, '_blank');
                        } else {
                          window.open(link.url, '_self');
                        }
                      }}
                    >
                      {link.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            <p>
              © {currentYear} My Climate Definition. Made with{' '}
              <Heart className="w-4 h-4 inline text-red-500" /> for the planet.
            </p>
            <p className="mt-1">
              Building awareness, one story at a time.
            </p>
          </div>
          
          {/* Scroll to Top Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;