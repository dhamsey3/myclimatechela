import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Heart } from 'lucide-react';

interface BuyMeACoffeeProps {
  variant?: 'card' | 'button' | 'banner';
  className?: string;
}

const BuyMeACoffee = ({ variant = 'card', className = '' }: BuyMeACoffeeProps) => {
  const buyMeCoffeeUrl = "https://www.buymeacoffee.com/korirjpatr1";

  const handleClick = () => {
    window.open(buyMeCoffeeUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'button') {
    return (
      <Button
        onClick={handleClick}
        className={`bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${className}`}
      >
        <Coffee className="w-4 h-4 mr-2" />
        Buy Me a Coffee
      </Button>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h4 className="font-semibold text-foreground">Support Our Work</h4>
              <p className="text-sm text-muted-foreground">Help us create more climate content</p>
            </div>
          </div>
          <Button
            onClick={handleClick}
            size="sm"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
          >
            <Heart className="w-4 h-4 mr-1" />
            Support
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={`bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          <Coffee className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h4 className="font-semibold text-foreground mb-2">Support Our Mission</h4>
        <p className="text-sm text-muted-foreground mb-4">
          If our climate content helps you, consider supporting us with a coffee. Every contribution helps us create more valuable resources for the climate community.
        </p>
        <Button
          onClick={handleClick}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full"
        >
          <Coffee className="w-4 h-4 mr-2" />
          Buy Me a Coffee
          <Heart className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyMeACoffee;