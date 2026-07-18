import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Lightbulb, Shield, Users } from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';
import BuyMeACoffee from './BuyMeACoffee';
import PageTransition from './PageTransition';

const ABOUT_PHOTO_URL = 'https://www.pexels.com/photo/group-of-people-doing-a-demonstration-on-global-climate-and-environmental-issues-12111230/';

const values = [
  {
    icon: Users,
    number: '01',
    title: 'Community',
    description: 'Change begins with people coming together, learning from each other, and supporting collective action.',
  },
  {
    icon: Heart,
    number: '02',
    title: 'Sustainability',
    description: 'Our words and actions are guided by the need to protect the planet and build systems that nurture rather than harm.',
  },
  {
    icon: Shield,
    number: '03',
    title: 'Justice',
    description: 'We stand for equity, recognizing that climate change affects communities differently, and that solutions must be fair and inclusive.',
  },
  {
    icon: Lightbulb,
    number: '04',
    title: 'Hope & Action',
    description: 'We share stories to raise awareness and inspire courage, creativity, and action toward a better future.',
  },
];

const AboutPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content">
        <section className="border-b">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div className="min-w-0">
              <p className="editorial-kicker">About us</p>
              <h1 className="mt-5 max-w-2xl break-words font-editorial text-5xl font-semibold leading-[1.02] sm:text-6xl">
                Our voices. Our planet. Our future.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                We believe climate change is part of our daily lives, shaping how we live, work, and connect with one another.
              </p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <figure>
              <img
                src="/img/editorial/about-climate-action.jpg"
                alt="A diverse crowd at a climate demonstration lifting a large globe together"
                className="aspect-[16/10] w-full rounded-sm object-cover"
              />
              <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
                Photo by{' '}
                <a href={ABOUT_PHOTO_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
                  skigh_tv on Pexels
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 md:grid-cols-[0.45fr_1.55fr]">
            <p className="editorial-kicker">Why we exist</p>
            <div className="space-y-6 text-lg leading-8">
              <p>
                <strong>My Climate Definition</strong> is a space for stories and conversations about climate change through the lens of our lived experiences. We believe that climate change is part of our daily lives, shaping the way we live, work, and connect with one another.
              </p>
              <p>
                Here, we share how our values, choices, and everyday actions, along with the systems we create, impact our planet and, in turn, our communities. We hope to make climate change personal, relatable, and urgent by telling our stories.
              </p>
              <p>
                This platform is about learning together, inspiring change, and reimagining what's possible for our future. We want to spark conversations that empower individuals and communities to see their role in shaping a more sustainable, just, and resilient world for today and for generations to come.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <div className="border-t border-foreground/20 pt-5">
              <p className="editorial-kicker">Our vision</p>
              <h2 className="mt-4 font-editorial text-3xl font-semibold">Vision</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                A world where personal stories and collective experiences inspire action that builds sustainable, resilient, and just communities for present and future generations.
              </p>
            </div>
            <div className="border-t border-foreground/20 pt-5">
              <p className="editorial-kicker">Our mission</p>
              <h2 className="mt-4 font-editorial text-3xl font-semibold">Mission</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                To create a platform that connects daily human choices to global climate impacts and inspires people to reimagine and act toward a more sustainable and resilient future.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="editorial-kicker">What guides us</p>
              <h2 className="mt-3 font-editorial text-4xl font-semibold sm:text-5xl">Our Core Values</h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {values.map(({ icon: Icon, number, title, description }) => (
              <article key={title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-foreground/20 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{number}</p>
                  <h3 className="mt-2 font-editorial text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid gap-8 border-y border-foreground/20 py-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="editorial-kicker">Join the conversation</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold">Ready to Join the Conversation?</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">Whether you have questions, ideas, or want to share your climate story, we'd love to hear from you.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-lg px-4 pb-20 sm:px-6 lg:pb-28">
          <BuyMeACoffee variant="card" />
        </section>
      </main>
      <Footer />
    </div>
  </PageTransition>
);

export default AboutPage;
