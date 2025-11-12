import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from './Navigation';
import { ArrowRight, Mail, MessageCircle, Send, Twitter, Globe, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual FormSubmit or your preferred service)
    try {
      const response = await fetch('https://formsubmit.co/info@myclimatedefinition.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Twitter className="w-6 h-6 text-blue-500" />,
      title: "Follow us on X",
      description: "Stay updated with our latest thoughts and conversations",
      link: "https://x.com/cmdefinition",
      linkText: "@cmdefinition"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      title: "Read on Medium",
      description: "Explore our full collection of climate stories and insights",
      link: "https://medium.com/@myclimatedefinition",
      linkText: "Medium Blog"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Join the Conversation",
      description: "Share your climate story and connect with our community",
      link: "#contact-form",
      linkText: "Send us a message"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-50/20 dark:to-green-950/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-teal-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1">
                  Contact Us
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Let's Start a Conversation
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Questions, ideas, or feedback? Send us a note — we read every message and believe every voice matters in the climate conversation.
                </p>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 px-8 py-6 text-lg"
                  onClick={() => navigate('/about')}
                >
                  Learn About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
                    alt="People connecting and collaborating"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-full shadow-lg">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ways to Connect</h2>
            <p className="text-lg text-muted-foreground">
              Choose the platform that works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform">
                      {method.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (method.link.startsWith('#')) {
                        document.querySelector(method.link)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.open(method.link, '_blank');
                      }
                    }}
                  >
                    {method.linkText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="container mx-auto px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 hover:border-green-500/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Send us a Message</CardTitle>
              <p className="text-center text-muted-foreground">
                We'd love to hear from you. Tell us about your climate story, ask questions, or share your ideas.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors bg-background"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors bg-background"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors bg-background"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="story">Share My Climate Story</option>
                      <option value="collaboration">Collaboration Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="media">Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors bg-background resize-vertical"
                      placeholder="Tell us what's on your mind. We'd love to hear about your climate experiences, questions, or ideas..."
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-6 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center mt-4">
                    By submitting this form, you agree to our privacy policy. We'll never share your information.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;