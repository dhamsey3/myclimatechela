import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Loader2, Sparkles } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Option 1: Use a form service like Formspree, Basin, or Getform
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Option 2: Use Netlify Forms (if deploying to Netlify)
      // const formData = new FormData();
      // formData.append('email', email);
      // const response = await fetch('/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   body: new URLSearchParams(formData as any).toString()
      // });

      // Option 3: Direct integration with email service API
      // For Mailchimp, ConvertKit, EmailOctopus, etc.
      // Example for EmailOctopus:
      // const response = await fetch('https://emailoctopus.com/api/1.6/lists/YOUR_LIST_ID/contacts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     api_key: 'YOUR_API_KEY',
      //     email_address: email
      //   })
      // });

      // Temporary simulation for demo - REPLACE WITH REAL SERVICE
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Choose and implement one of the options above
      // Uncomment the option you prefer and add your credentials
      
      // For quick setup, I recommend:
      // 1. Formspree (free tier: 50 submissions/month) - easiest
      // 2. Netlify Forms (if on Netlify) - built-in
      // 3. EmailOctopus (affordable & reliable)

      setStatus('success');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Card className="w-full border-2 overflow-hidden bg-gradient-to-br from-background via-background to-green-50/30 dark:to-green-950/20">
      <CardHeader className="border-b bg-gradient-to-r from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Stay Updated</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Sparkles className="w-3 h-3 mr-1" />
                Free
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get the latest climate insights and sustainability tips delivered to your inbox
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">You're Subscribed! 🎉</h3>
            <p className="text-muted-foreground">
              Check your inbox for a confirmation email. We'll send you our best climate stories every week.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="your.email@example.com"
                  disabled={status === 'loading'}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                    status === 'error' ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              
              {status === 'error' && errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {errorMessage}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              size="lg"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe to Newsletter
                  <Mail className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Join 1,000+ climate-conscious readers. Unsubscribe anytime. We respect your privacy.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-400 border-2 border-background flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">1,000+</span> readers
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
