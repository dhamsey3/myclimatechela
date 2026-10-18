import { useState } from 'react';
import { CheckCircle, Globe, Mail, Send, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from './Navigation';
import Footer from './Footer';
import PageTransition from './PageTransition';

const CONTACT_PHOTO_URL = 'https://www.pexels.com/photo/group-of-people-engaging-in-outdoor-conversation-37365032/';

const contactPaths = [
  {
    icon: Mail,
    label: 'Email',
    description: 'Questions, collaborations, and story ideas.',
    href: 'mailto:info@myclimatedefinition.org',
    action: 'info@myclimatedefinition.org',
  },
  {
    icon: Twitter,
    label: 'X / Twitter',
    description: 'Short updates and ongoing climate conversations.',
    href: 'https://x.com/cmdefinition',
    action: '@cmdefinition',
  },
  {
    icon: Globe,
    label: 'Medium',
    description: 'Read the complete collection of published stories.',
    href: 'https://medium.com/@myclimatedefinition',
    action: 'View the archive',
  },
];

const fieldClass = 'w-full rounded-sm border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-primary';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('https://formsubmit.co/info@myclimatedefinition.org', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });

      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitError('Your message could not be sent. Please try again, or email us directly at info@myclimatedefinition.org.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content">
          <section className="border-b">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
              <div className="min-w-0">
                <p className="editorial-kicker">Contact</p>
                <h1 className="mt-5 max-w-xl break-words font-editorial text-4xl font-semibold leading-[1.06] sm:text-5xl">
                  Every climate story starts with someone speaking and someone listening.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Send a question, share an idea, propose a collaboration, or tell us what climate change looks like where you live.
                </p>
              </div>

              <figure>
                <img
                  src="/img/editorial/contact-conversation.jpg"
                  alt="People gathered outdoors in a candid community conversation"
                  className="aspect-[16/10] w-full rounded-sm object-cover"
                />
                <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
                  Photo by{' '}
                  <a href={CONTACT_PHOTO_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
                    Atiek Arief on Pexels
                  </a>
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-24">
            <aside aria-labelledby="contact-paths-title">
              <p className="editorial-kicker">Other ways to connect</p>
              <h2 id="contact-paths-title" className="mt-3 font-editorial text-3xl font-semibold">Choose the path that suits the message.</h2>
              <div className="mt-8">
                {contactPaths.map(({ icon: Icon, label, description, href, action }) => (
                  <div key={label} className="grid grid-cols-[auto_1fr] gap-4 border-t border-foreground/20 py-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-muted text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{label}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        className="mt-2 inline-block break-all text-sm font-semibold text-primary hover:underline"
                      >
                        {action}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div id="contact-form">
              <p className="editorial-kicker">Send a message</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold">What would you like to talk about?</h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                We read every message. A clear subject helps us respond with the right context.
              </p>

              {isSubmitted ? (
                <div className="mt-10 border-l-2 border-primary py-2 pl-5" role="status">
                  <CheckCircle className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-editorial text-3xl font-semibold">Your message is on its way.</h3>
                  <p className="mt-3 text-muted-foreground">We will get back to you as soon as possible.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setIsSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                  <input type="hidden" name="_subject" value="New contact form submission from My Climate Definition" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your name</label>
                      <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required autoComplete="name" className={fieldClass} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email address</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required autoComplete="email" className={fieldClass} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className={fieldClass}>
                      <option value="">Choose a subject</option>
                      <option value="general">General question</option>
                      <option value="story">Share a climate story</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Feedback</option>
                      <option value="media">Media enquiry</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={7}
                      className={`${fieldClass} resize-y`}
                    />
                  </div>

                  {submitError && (
                    <div role="alert" className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" size="lg" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {isSubmitting ? 'Sending…' : 'Send message'}
                    {!isSubmitting && <Send className="ml-2 h-4 w-4" aria-hidden="true" />}
                  </Button>
                </form>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
