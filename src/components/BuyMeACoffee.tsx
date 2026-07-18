import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BuyMeACoffeeProps {
  variant?: 'card' | 'button' | 'banner';
  className?: string;
}

const SUPPORT_URL = 'https://www.buymeacoffee.com/korirjpatr1';

const SupportButton = ({ className = '' }: { className?: string }) => (
  <Button asChild className={`bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}>
    <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
      <Coffee className="mr-2 h-4 w-4" aria-hidden="true" />
      Support the journal
    </a>
  </Button>
);

const BuyMeACoffee = ({ variant = 'card', className = '' }: BuyMeACoffeeProps) => {
  if (variant === 'button') return <SupportButton className={className} />;

  if (variant === 'banner') {
    return (
      <div className={`flex flex-col gap-6 border-y border-foreground/20 py-8 sm:flex-row sm:items-center sm:justify-between ${className}`}>
        <div className="max-w-2xl">
          <p className="editorial-kicker">Keep independent stories moving</p>
          <h2 className="mt-3 font-editorial text-2xl font-semibold sm:text-3xl">Help fund thoughtful climate publishing.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Contributions support the research, writing, and tools behind My Climate Definition.
          </p>
        </div>
        <SupportButton className="shrink-0" />
      </div>
    );
  }

  return (
    <Card className={`border bg-card shadow-none ${className}`}>
      <CardContent className="p-6">
        <p className="editorial-kicker">Support the work</p>
        <h2 className="mt-3 font-editorial text-2xl font-semibold">Independent climate stories take care and time.</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your contribution helps fund the research, writing, and practical resources published here.
        </p>
        <SupportButton className="mt-5" />
      </CardContent>
    </Card>
  );
};

export default BuyMeACoffee;
