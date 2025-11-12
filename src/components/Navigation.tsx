import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/img/logo.png" 
              alt="My Climate Definition" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-foreground">My Climate Definition</span>
          </div>
          <nav className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className={isActive('/') ? 'text-green-600 dark:text-green-400' : ''}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/about')}
              className={isActive('/about') ? 'text-green-600 dark:text-green-400' : ''}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/contact')}
              className={isActive('/contact') ? 'text-green-600 dark:text-green-400' : ''}
            >
              Contact
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;