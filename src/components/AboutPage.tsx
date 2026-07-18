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
    description: 'Change begins with people learning from one another and turning shared understanding into collective action.',
  },
  {
    icon: Heart,
    number: '02',
    title: 'Sustainability',
    description: 'Our stories examine choices and systems that nurture people and the places on which they depend.',
  },
  {
    icon: Shield,
    number: '03',
    title: 'Justice',
    description: 'Climate change is unequal. The responses we explore must be fair, inclusive, and grounded in lived realities.',
  },
  {
    icon: Lightbulb,
    number: '04',
    title: 'Hope in action',
    description: 'Hope matters most when it helps people imagine practical alternatives and take the next honest step.',
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
              <p className="editorial-kicker">About the publication</p>
              <h1 className="mt-5 max-w-2xl break-words font-editorial text-5xl font-semibold leading-[1.02] sm:text-6xl">
                Climate stories begin with the lives people already lead.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                My Climate Definition makes climate change personal, relatable, and urgent by connecting it to our homes, work, relationships, choices, and communities.
              </p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
            <div className="space-y-6 font-editorial text-2xl leading-relaxed sm:text-3xl">
              <p>
                Climate change can feel distant when it appears only as data, policy, or disaster. Yet it is already shaping how people live, work, move, eat, build, and care for one another.
              </p>
              <p className="text-muted-foreground">
                We publish stories and practical perspectives that connect those everyday experiences to the larger systems influencing our future. The aim is not perfection. It is clearer understanding, more honest conversation, and action rooted in reality.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <div className="border-t border-foreground/20 pt-5">
              <p className="editorial-kicker">Our vision</p>
              <h2 className="mt-4 font-editorial text-3xl font-semibold">A future people can imagine themselves inside.</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                A world where personal stories and collective experience inspire sustainable, resilient, and just communities for present and future generations.
              </p>
            </div>
            <div className="border-t border-foreground/20 pt-5">
              <p className="editorial-kicker">Our mission</p>
              <h2 className="mt-4 font-editorial text-3xl font-semibold">Make the global personal—and the personal useful.</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                To connect daily human choices to wider climate impacts and help people reimagine what a more sustainable and resilient future could look like.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="editorial-kicker">What guides us</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold sm:text-5xl">Values that shape the work.</h2>
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
              <p className="editorial-kicker">Add your perspective</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold">What does climate mean in your everyday life?</h2>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Share your story <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
