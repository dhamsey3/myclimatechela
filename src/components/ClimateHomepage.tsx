import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from './Navigation';
import Footer from './Footer';
import BuyMeACoffee from './BuyMeACoffee';
import PageTransition from './PageTransition';
import SkeletonCard from './SkeletonCard';
import CarbonCalculator from './CarbonCalculator';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

import { ChevronLeft, ChevronRight, Twitter, Linkedin, Calendar, ArrowRight, Leaf, Wind, Droplets, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  preview: string;
  image: string;
  mediumLink: string;
}

interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

const ClimateHomepage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const postsAnimation = useScrollAnimation({ threshold: 0.1 });


  const carouselImages: CarouselImage[] = [
    {
      id: 1,
      url: './img/slide1.png',
      alt: 'Climate action slide 1',
    },
    {
      id: 2,
      url: './img/slide2.png',
      alt: 'Climate action slide 2',
    },
    {
      id: 3,
      url: './img/slide3.png',
      alt: 'Climate action slide 3',
    },
    {
      id: 4,
      url: './img/slide4.png',
      alt: 'Climate action slide 4',
    },
  ];

  // Fetch blog posts from your existing posts.json
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch blog posts from your Medium RSS or local JSON
    setIsLoading(true);
    fetch('./posts.json')
      .then(response => response.json())
      .then((posts: any[]) => {
        const transformedPosts: BlogPost[] = posts.slice(0, 6).map((post, index) => {
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return {
            id: index + 1,
            title: post.title,
            date: formattedDate,
            preview: post.summary || post.excerpt || 'Discover insights about climate action and sustainability.',
            image: post.image || `./img/slide${(index % 4) + 1}.png`, // Use your slide images as fallback
            mediumLink: post.external_url || post.permalink || post.url || '#'
          };
        });
        setBlogPosts(transformedPosts);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading posts:', error);
        // Fallback posts if fetch fails
        setBlogPosts([
          {
            id: 1,
            title: 'Understanding Carbon Footprints in Daily Life',
            date: 'March 15, 2024',
            preview: 'Explore how everyday choices impact our carbon footprint and discover practical ways to reduce environmental impact through conscious living.',
            image: './img/slide1.png',
            mediumLink: '/posts/sustainability-tips/',
          },
          {
            id: 2,
            title: 'Sustainable Living: Small Changes, Big Impact',
            date: 'March 10, 2024',
            preview: 'Learn about simple lifestyle adjustments that can make a significant difference in creating a more sustainable future for our planet.',
            image: './img/slide2.png',
            mediumLink: '/posts/welcome-to-my-climate-definition/',
          }
        ]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const shareOnTwitter = (post: BlogPost) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.origin + post.mediumLink)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = (post: BlogPost) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + post.mediumLink)}`;
    window.open(url, '_blank');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-50/20 dark:to-green-950/20">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-teal-500/10" />
          
          {/* Animated background orbs */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
            >
              <motion.div 
                className="flex justify-center gap-4 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <motion.div 
                  className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                </motion.div>
                <motion.div 
                  className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                >
                  <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <motion.div 
                  className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                >
                  <Droplets className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </motion.div>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                What Climate Means to Everyday Life
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Stories, definitions, and experiments in sustainability. 
                Exploring how our daily choices shape the future of our planet.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-6 text-lg group shadow-lg shadow-green-500/25"
                    onClick={() => document.querySelector('#posts')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Stories
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 px-8 py-6 text-lg hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => navigate('/about')}
                  >
                    About Us
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-[400px] md:h-[600px]">
              <AnimatePresence mode="wait">
                {carouselImages.map((image, index) => (
                  index === currentSlide && (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.7, ease: [0.2, 0.9, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
              aria-label="Previous slide"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
              aria-label="Next slide"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Support Banner */}
        <section className="container mx-auto px-4 py-12">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BuyMeACoffee variant="banner" />
          </motion.div>
        </section>

        {/* Carbon Calculator Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1">
                Calculate Your Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                What's Your Carbon Footprint?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover your environmental impact and get personalized tips to reduce your carbon emissions
              </p>
            </div>
            <CarbonCalculator />
          </motion.div>
        </section>

        {/* Latest Posts Section */}
        <section id="posts" className="container mx-auto px-4 py-16 pb-24" ref={postsAnimation.elementRef}>
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={postsAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1">
                Latest Insights
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Latest Posts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our latest articles on climate action, sustainability, and environmental innovation
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={postsAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="group overflow-hidden border-2 hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 h-full flex flex-col backdrop-blur-sm bg-card/50"
                    >
                      <CardHeader className="p-0">
                        <motion.div 
                          className="relative overflow-hidden h-64"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.4 }}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Hover overlay with read more */}
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            initial={false}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              initial={{ scale: 0.8, y: 20 }}
                              whileHover={{ scale: 1.1 }}
                              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl group-hover:scale-100 transition-transform duration-300"
                            >
                              <span className="font-semibold flex items-center gap-2">
                                Read Article
                                <ExternalLink className="w-4 h-4" />
                              </span>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </CardHeader>
                      
                      <CardContent className="p-6 space-y-4 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                          <span>{post.date}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {post.preview}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0 flex justify-between items-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            onClick={() => window.open(post.mediumLink, '_blank')}
                            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 group/btn"
                          >
                            Read More
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                        
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => shareOnTwitter(post)}
                              className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                              aria-label="Share on Twitter"
                            >
                              <Twitter className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => shareOnLinkedIn(post)}
                              className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                              aria-label="Share on LinkedIn"
                            >
                              <Linkedin className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ClimateHomepage;