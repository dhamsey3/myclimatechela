import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { FALLBACK_POSTS, getPostsOrFallback, type BlogPost } from '@/lib/posts';
import Navigation from './Navigation';
import Footer from './Footer';
import BuyMeACoffee from './BuyMeACoffee';
import PageTransition from './PageTransition';
import SkeletonCard from './SkeletonCard';
import CarbonCalculator from './CarbonCalculator';

const articleTarget = (url: string) => url.startsWith('http') ? '_blank' : undefined;

const ArticleMeta = ({ date }: { date: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <CalendarDays className="h-4 w-4" aria-hidden="true" />
    <time>{date}</time>
  </div>
);

const StoryCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="group flex h-full flex-col border-t border-foreground/20 pt-4"
  >
    <a
      href={post.mediumLink}
      target={articleTarget(post.mediumLink)}
      rel={articleTarget(post.mediumLink) ? 'noreferrer' : undefined}
      className="block overflow-hidden rounded-sm bg-muted"
    >
      <img
        src={post.image}
        alt={post.title}
        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        onError={(event) => { event.currentTarget.src = '/img/slide1.png'; }}
      />
    </a>
    <div className="flex flex-1 flex-col pt-5">
      <ArticleMeta date={post.date} />
      <h3 className="mt-3 font-editorial text-2xl font-semibold leading-tight sm:text-[1.7rem]">
        <a
          href={post.mediumLink}
          target={articleTarget(post.mediumLink)}
          rel={articleTarget(post.mediumLink) ? 'noreferrer' : undefined}
          className="decoration-primary/60 underline-offset-4 hover:underline"
        >
          {post.title}
        </a>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.preview}</p>
      <a
        href={post.mediumLink}
        target={articleTarget(post.mediumLink)}
        rel={articleTarget(post.mediumLink) ? 'noreferrer' : undefined}
        className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
      >
        Read story <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  </motion.article>
);

const ClimateHomepage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch('./posts.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((rawPosts) => {
        if (isMounted) setPosts(getPostsOrFallback(rawPosts));
      })
      .catch(() => {
        if (isMounted) setPosts(FALLBACK_POSTS);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const featuredPost = posts[0] ?? FALLBACK_POSTS[0];
  const latestPosts = posts.slice(1);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content">
          <section className="border-b">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-20">
              <motion.div className="min-w-0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <p className="editorial-kicker">Independent climate publication</p>
                <h1 className="mt-5 max-w-2xl break-words font-editorial text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                  Climate is personal before it is abstract.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Stories, definitions, and practical experiments that reveal how a changing climate meets ordinary life.
                </p>

                <div className="mt-10 border-l-2 border-primary pl-5">
                  <p className="editorial-kicker">Featured story</p>
                  <h2 className="mt-3 break-words font-editorial text-2xl font-semibold leading-tight sm:text-3xl">{featuredPost.title}</h2>
                  <div className="mt-3"><ArticleMeta date={featuredPost.date} /></div>
                  <a
                    href={featuredPost.mediumLink}
                    target={articleTarget(featuredPost.mediumLink)}
                    rel={articleTarget(featuredPost.mediumLink) ? 'noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Read featured story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>

              <motion.a
                href={featuredPost.mediumLink}
                target={articleTarget(featuredPost.mediumLink)}
                rel={articleTarget(featuredPost.mediumLink) ? 'noreferrer' : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="group relative block overflow-hidden rounded-sm bg-muted"
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                  onError={(event) => { event.currentTarget.src = '/img/slide1.png'; }}
                />
                <span className="absolute bottom-0 left-0 bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                  Read the feature
                </span>
              </motion.a>
            </div>
          </section>

          <section aria-labelledby="latest-stories-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-5 border-b border-foreground/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="editorial-kicker">From the publication</p>
                <h2 id="latest-stories-title" className="mt-3 font-editorial text-4xl font-semibold sm:text-5xl">Latest stories</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Reporting and reflection on the choices, communities, and systems shaping a liveable future.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading latest stories">
                {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post, index) => <StoryCard key={post.id} post={post} index={index} />)}
              </div>
            ) : (
              <div className="mt-10 border-l-2 border-primary pl-5">
                <p className="font-editorial text-2xl font-semibold">More stories are on the way.</p>
                <p className="mt-2 text-sm text-muted-foreground">For now, begin with the featured story above.</p>
              </div>
            )}
          </section>

          <section className="border-y bg-card">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[0.7fr_1.3fr] md:py-20 lg:px-8">
              <p className="editorial-kicker">Our point of view</p>
              <div>
                <h2 className="max-w-3xl font-editorial text-3xl font-semibold leading-tight sm:text-4xl">
                  The climate story is also a story about home, work, food, movement, fairness, and hope.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                  We use lived experience and practical inquiry to make climate change tangible—without reducing a complex challenge to slogans or perfect individual choices.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="calculator-title" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mb-9 max-w-2xl">
              <p className="editorial-kicker">A quick estimate</p>
              <h2 id="calculator-title" className="mt-3 font-editorial text-4xl font-semibold sm:text-5xl">Explore your carbon footprint</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Use broad averages to see where everyday emissions may come from. Treat the result as a starting point for reflection, not a precise audit.
              </p>
            </div>
            <CarbonCalculator />
          </section>

          <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
            <BuyMeACoffee variant="banner" />
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ClimateHomepage;
