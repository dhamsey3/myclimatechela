import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { src: '/img/slide1.png', alt: 'People joining together around a shared climate future' },
  { src: '/img/slide2.png', alt: 'A perspective on sustainable choices in everyday life' },
  { src: '/img/slide3.png', alt: 'Climate action connected to communities and places' },
  { src: '/img/slide4.png', alt: 'Ideas for a more resilient and sustainable future' },
];

const StoryCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion]);

  const selectSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide((index + slides.length) % slides.length);
  };

  return (
    <section id="visual-stories" aria-labelledby="carousel-title" className="scroll-mt-16 border-y bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div>
            <p className="editorial-kicker">Climate in view</p>
            <h2 id="carousel-title" className="mt-3 font-editorial text-4xl font-semibold sm:text-5xl">Four ways of seeing a shared future.</h2>
          </div>
          <p className="max-w-xl leading-7 text-muted-foreground md:justify-self-end">
            A visual pause between the stories: community, responsibility, possibility, and the everyday choices that connect them.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-sm border bg-background">
          <figure className="relative">
            <div className="relative aspect-[16/9] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={slides[currentSlide].src}
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <figcaption className="text-sm text-muted-foreground">
                Image {currentSlide + 1} of {slides.length}
              </figcaption>

              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <div className="flex items-center gap-2" aria-label="Choose an image">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => selectSlide(index)}
                      className={`h-2.5 rounded-full transition-[width,background-color] ${index === currentSlide ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground'}`}
                      aria-label={`Show image ${index + 1}`}
                      aria-current={index === currentSlide ? 'true' : undefined}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => selectSlide(currentSlide - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-sm border text-foreground hover:bg-muted"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectSlide(currentSlide + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-sm border text-foreground hover:bg-muted"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default StoryCarousel;
