import Reveal from '../components/Reveal';
import PageHero from '../components/PageHero';
import CallToAction from '../components/CallToAction';
import FaqList from '../components/FaqList';
import aboutImage from '../assets/extras/about-us-index-image.webp'
import aboutHero from '../assets/extras/about-us-hero.webp'
import ctaImage from '../assets/cta/cta-image.webp'

const FAQ_ITEMS = [
  {
    question: 'What types of games do you create?',
    answer:
      'We create horror, action, survival, simulation, and shooter games. From open-world crime and tactical shooting to doppelganger horror, supermarket simulation and zombie survival, our current range has it all.',
  },
  {
    question: 'Do you develop both 2D and 3D games?',
    answer:
      'Yes. We work in both formats and pick the one that works best for the game. Some projects go with retro 2D visuals, others with immersive 3D environments and action.',
  },
  {
    question: 'How do you approach a new game project?',
    answer:
      'We start with the core player experience and design mechanics, controls, pacing, visuals and progression around that. The genre and central gameplay idea guide the direction of each project.',
  },
  {
    question: 'What makes each game feel different?',
    answer:
      'We don’t use the same formula for every title. Each project has its own gameplay loop, its own visual direction, its own pacing, its own setting, its own challenge, to establish its own identity.',
  },
];

export default function About() {
const metrics = [
  { number: '9+',  label: 'Gaming Experience' },
  { number: '5', label: 'Featured Releases' },
  { number: '2D+3D',   label: 'Game Development' },
  { number: '261K+', label: 'Combined Downloads' },
];
// Define outside the component so it isn't recreated on every render
const features = [
  {
    title: 'Gameplay Comes First',
    description:
      'Every project starts with the play experience. We shape mechanics, pacing, controls, and progression around what makes every title rewarding to replay.',
  },
  {
    title: 'Original Game Worlds',
    description:
      'Our portfolio spans horror, action, survival, simulation, and shooters, letting each game establish its world, tone, and challenge that feels distinct.',
  },
  {
    title: '2D and 3D Game Craft',
    description:
      "We develop 2D and 3D experiences, choosing the format that best supports each game's mechanics, atmosphere, visual direction, and intended player feel.",
  },
  {
    title: 'Built for Each Genre',
    description:
      'We avoid forcing one template across every title. From concept to refinement, each game gets shaped around its own genre, audience, and gameplay goals.',
  },
];
  return (
    <div className="bg-white text-gray-900 dark:bg-black dark:text-white">
      <PageHero
        imagePath={aboutHero}
        pageName="About Us"
        heading={<>Creating Games Players <br /> Want to Return To</>}
        description="Waywe Gaming is a game development studio with 9+ years of experience creating original 2D and 3D games across horror, action, survival, simulation, and shooter genres for modern players."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pt-20 pb-20 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:px-12">
        <Reveal>
          <div>
            <h2 className="font-gaming text-3xl text-gray-900 dark:text-white sm:text-5xl">
              Who <span className="text-primary-dark">We Are</span>
            </h2>
            <p className="mt-3 lg:max-w-xl text-[16px] leading-relaxed text-gray-600 dark:text-gray-100">
              Waywe Gaming brings together developers, designers, artists, and creative thinkers who turn strong game ideas into experiences people can enjoy. With 9+ years of experience, our work spans 2D and 3D development across horror, action, survival, simulation, and shooter games. Our portfolio includes Grand Mafia Gangster City Game, Agent For Hire: Suit Shooter, Doppelganger or Neighbor Game, Midnight Shift: Doppelganger, and Last Survivor Left: Zombie War. Each project lets us explore a different world, gameplay loop, visual direction, and player challenge while keeping the experience clear, engaging, and built for play with care.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
                <Reveal key={`${metric.label}-${index}`} delay={index * 80}>
                <div
                    className="about-glow-card flex min-h-28 flex-col items-center justify-center rounded-xl p-4 text-center"
                >
                    <strong className="about-glow-badge flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold">{metric.number}</strong>
                    <span className="mt-3 text-[15px] font-semibold">{metric.label}</span>
                </div>
                </Reveal>
            ))}
            </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10 pb-20 sm:px-10 lg:px-12">
        <Reveal>
          <h2 className="font-gaming text-3xl text-gray-900 dark:text-white sm:text-5xl">
            Our <span className="text-primary-dark">Mission</span>
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-gray-600 dark:text-gray-100">
            Our mission is to build games that give players a clear reason to keep exploring, improving, and coming back. We focus on gameplay first, then shape the world, art direction, pacing, controls, and challenges around that experience. From a tense 2D horror inspection game to 3D open-world action, tactical shooting, supermarket horror, and zombie survival, we approach each title on its own terms. We want every project to feel purposeful rather than copied from the last one. That means testing ideas, refining mechanics, learning from player behaviour, and making decisions that support the game we are actually building from day one.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10 pb-20 sm:px-10 lg:px-12">
        <Reveal>
          <div className="text-center">
            <h2 className="font-gaming text-3xl text-gray-900 dark:text-white sm:text-5xl">
              What Makes Us <span className="text-primary-dark">Different</span>
            </h2>
            <p className="mx-auto mt-3 max-w-4xl text-md leading-relaxed text-gray-600 dark:text-gray-400">
              We do not build every title from the same formula. Each Waywe Gaming project starts with its own player experience, genre, mechanics, visual direction, and challenge, giving our team room to create games with their own identity.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <img
              src={aboutImage}
              alt="Game characters in a futuristic scene"
              className="h-full min-h-80 w-full rounded-xl border border-primary object-cover"
            />
          </Reveal>

          <div className="space-y-4">
            {features.map(({ title, description }, index) => {
              const [firstWord, ...restWords] = title.split(' ');

              return (
                <Reveal key={title} delay={index * 80}>
                  <div className="about-glow-card rounded-xl p-4">
                    <h3 className="font-gaming text-md text-gray-900 dark:text-white">
                      <span className="mr-3 text-primary-dark">✓</span>
                      {firstWord} <span className="text-primary-dark">{restWords.join(' ')}</span>
                    </h3>
                    <p className="mt-2 pl-7 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                      {description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pt-10 pb-20 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:px-12">
        <Reveal>
          <div>
            <h2 className="lg:max-w-lg font-gaming text-3xl leading-tight text-gray-900 dark:text-white sm:text-5xl">
              How We Build Games  <span className="text-primary-dark">That Stand Out</span>
            </h2>
            <p className="mt-4 lg:max-w-xl text-md leading-relaxed text-gray-900 dark:text-gray-100">
              A good game is more than a good idea. Our process links concept, mechanics, art direction, testing and player feedback so that every title develops with intention. These principles are our guide in how we take an idea to a playable experience that feels focused and complete.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {['Gameplay Leads the Build', 'Distinct Genre Direction', '2D and 3D With a Purpose', 'Mechanics Made to Matter', 'Testing Shapes the Build', 'Players Remain the Focus'].map(
            (label, index) => (
              <Reveal key={`${label}-${index}`} delay={index * 60}>
                <div className="about-glow-card flex items-center gap-3 rounded-lg px-3 py-3 text-sm">
                  <span className="about-glow-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                    {index+1}
                  </span>
                  {label}
                </div>
              </Reveal>
            ),
          )}
        </div>
      </section>

      <CallToAction
        imagePath={ctaImage}
        heading={<>Ready to Play <span className="text-primary-dark">What's Next? </span></>}
        description="Explore worlds, challenges, and gameplay across horror, action, survival, simulation, and shooter games. Choose what you want to play next up."
        buttonLabel="Browse Our Games"
        buttonHref="/contact"
      />

      <FaqList items={FAQ_ITEMS} />
    </div>
  );
}

