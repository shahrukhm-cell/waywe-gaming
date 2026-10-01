import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import ContactSection from '../components/ContactSection';
import catalog from '../data/games.json';
import androidIcon from '../assets/extras/android.png';
import midnightShiftVideo from '../assets/extras/videos/Midnight Shift Doppelganger Game _ Gameplay Trailer Video 01 _ Landscape _ Google Play Store.mp4';
import grandMafiaVideo from '../assets/extras/videos/Grand Mafia Gangster City Game _ Trailer Video 01 _ Google Play Store.mp4';
import eddieImage from '../assets/team/eddie.webp';
import ayeshaImage from '../assets/team/ayesha.webp';
import ahadImage from '../assets/team/ahad.webp';
import nomanImage from '../assets/team/noman.webp';
import { resolveGameAsset } from '../utils/gameAssets';
import ctaImage from '../assets/cta/cta-image.webp';
import agentForHireLogo from '../assets/games/agent-for-hire-logo/agent-for-hire-logo.webp';
import grandMafiaLogo from '../assets/games/agent-for-hire-logo/grand-mafia-logo.webp';
import midnightShiftLogo from '../assets/games/agent-for-hire-logo/mid-night-shift-logo.webp';

const FEATURES = [
  { icon: 'fa-gamepad', lines: ['Game', 'Development'] },
  { icon: 'fa-gamepad', lines: ['2D & 3D', 'Experiences'] },
  { icon: 'fa-users', lines: ['Mobile Game', 'Publishing'] },
  { icon: 'fa-server', lines: ['Player-First ', 'Design'] },
];

function Hero() {
  const stackRef = useRef(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;

    const panels = Array.from(stack.querySelectorAll('.panel'));
    const videos = Array.from(stack.querySelectorAll('.panel__video'));
    const scrollButton = stack.querySelector('.scroll-btn');
    const revealSteps = Array.from(stack.querySelectorAll('.panel-3 .reveal-step'));
    const navHeight = 80;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let ticking = false;

    const documentTop = (element) => {
      let top = 0;
      while (element) {
        top += element.offsetTop;
        element = element.offsetParent;
      }
      return top;
    };

    const panelScrollY = (index) => Math.max(0, documentTop(panels[index]) - navHeight);

    const tryPlay = (video) => {
      video.muted = true;
      video.play().catch(() => { });
    };

    const update = () => {
      ticking = false;
      const viewportHeight = window.innerHeight;
      const panelHeight = viewportHeight - navHeight;

      for (let index = 0; index < panels.length - 1; index += 1) {
        const nextRect = panels[index + 1].getBoundingClientRect();
        const coverage = clamp(1 - (nextRect.top - navHeight) / panelHeight, 0, 1);
        panels[index].style.setProperty('--dim', (coverage * 0.9).toFixed(3));
        panels[index].style.setProperty('--blur', `${(coverage * 8).toFixed(2)}px`);
      }

      const stackEnd = documentTop(stack) + stack.offsetHeight - navHeight;
      scrollButton?.classList.toggle('is-hidden', window.scrollY >= stackEnd - 3);

      videos.forEach((video) => {
        const panelRect = video.closest('.panel').getBoundingClientRect();
        const isVisible = panelRect.bottom > 0 && panelRect.top < viewportHeight;
        if (isVisible && video.paused) tryPlay(video);
        if (!isVisible && !video.paused) video.pause();
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    videos.forEach((video) => tryPlay(video));
    const revealTimers = revealSteps.map((element, index) => (
      window.setTimeout(() => {
        element.classList.add('is-revealed');
      }, index * 180)
    ));
    const onInteraction = () => videos.forEach((video) => tryPlay(video));
    document.addEventListener('click', onInteraction, { once: true });
    document.addEventListener('touchstart', onInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const stackEnd = documentTop(stack) + stack.offsetHeight - navHeight;
    const waypoints = [...panels.map((_, index) => panelScrollY(index)), stackEnd];

    const onScrollButtonClick = () => {
      const nextWaypoint = waypoints.find((waypoint) => waypoint > window.scrollY + 20);
      window.scrollTo({ top: nextWaypoint ?? stackEnd, behavior: 'smooth' });
    };

    scrollButton?.addEventListener('click', onScrollButtonClick);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('touchstart', onInteraction);
      scrollButton?.removeEventListener('click', onScrollButtonClick);
      revealTimers.forEach((timer) => window.clearTimeout(timer));
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <section id="home" ref={stackRef} className="stack-container">
      <section className="panel panel-3">
        <div className="panel__bg" />
        <div className="panel__dim" />
        <div className="hero-content">
          <div className="hero-text">
            <div className="reveal-step" data-step="0">
              <span className="eyebrow">- PREMIUM GAMES. DISTINCT WORLDS.</span>
              <h1>
                Game Studio Creating Original {' '}
                <span className="highlight"> 2D and 3D Games</span>
              </h1>
            </div>
            <div className="reveal-step" data-step="1">
              <p className="text-white">
                Waywe Gaming is a game development studio creating 2D and 3D horror, action, survival, simulation, and shooter games for players.
              </p>
            </div>
            <div className="reveal-step" data-step="2">
              <div className="buttons">
                <a href="/games" className="btn-primary px-3 py-2">Explore Our Games</a>
                <a href="/contact" className="btn-secondary px-3 py-2 text-white">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="hero-sidebar reveal-step" data-step="3">
            {FEATURES.map((feature) => (
              <div className="sidebar-item" key={feature.icon}>
                <i className={`fas ${feature.icon}`} />
                <span>{feature.lines[0]} {feature.lines[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel panel-video panel-1">
        <div className="panel__bg">
          <video className="panel__video" autoPlay muted loop playsInline preload="auto" poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80">
            <source src={midnightShiftVideo} type="video/mp4" />
          </video>
        </div>
        <div className="panel__dim" />
      </section>

      <section className="panel panel-video panel-2">
        <div className="panel__bg">
          <video className="panel__video" autoPlay muted loop playsInline preload="auto" poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80">
            <source src={grandMafiaVideo} type="video/mp4" />
          </video>
        </div>
        <div className="panel__dim" />
      </section>

      <button className="scroll-btn" type="button" aria-label="Scroll down" />
    </section>
  );
}

const AVATARS = [
  agentForHireLogo,
  grandMafiaLogo,
  midnightShiftLogo,
];

const STATS = [
  { icon: 'fa-briefcase', value: '5', label: 'Featured Games' },
  { icon: 'fa-globe', value: '261K+', label: 'Combined Downloads' },
  { icon: 'fa-headset', value: '2D+3D', label: 'Game Development' },
  { icon: 'fa-users', value: '5', label: 'Game Genres' },
];

function Stats() {
  return (
    <section className=" relative mt-20 z-20 px-4 sm:px-6 lg:px-8 md:-mt-10 "  >
      <div className="mx-auto max-w-7xl bg-dark">
        <div className="stats-card rounded-3xl bg-white p-7 shadow-xl dark:bg-black md:p-6">
          <div className="grid items-start gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 dark:lg:border-gray-700">
              <div className="mb-2 h-1 w-16 bg-primary" />
              <h3 className="mb-2 text-2xl font-bold leading-tight">
                BUILT FOR PLAYERS
                <br />
                <span className="text-primary">DESIGNED TO LAST.</span>
              </h3>
              <p className="mb-2 text-md leading-relaxed text-gray-600 dark:text-white">
                Creating games built to engage players around the world.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {AVATARS.map((src, index) => (
                    <img key={src} src={src} alt={`Client ${index + 1}`} className="avatar-ring h-10 w-10 rounded-full" />
                  ))}
                  <div className="avatar-ring flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <i className="fas fa-plus text-xs text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">9+</span>
                  <p className="text-xs text-gray-600 dark:text-gray-100">Years of Experience</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 lg:col-span-3 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-start">
                  <div className="stat-icon-bg mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                    <i className={`fas ${stat.icon} text-lg `} />
                  </div>
                  <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-100">{stat.label}</p>
                  <div className="stat-underline" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURED_GAMES = catalog.games.slice(0, 4);

function FeaturedGames() {
  return (
    <section id="games" className="bg-white py-10 dark:bg-black md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex w-full items-center gap-4 sm:gap-5">
              <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">Our Games</p>
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <h2 className="font-gaming text-4xl font-black leading-none text-gray-900 dark:text-white sm:text-5xl">
              <span className="text-primary-dark">Featured</span>{' '}<span>Games</span>
            </h2>
            <a href="/games" className="btn-primary inline-flex w-full shrink-0 items-center justify-center rounded-lg px-5 py-3 text-xs font-semibold text-white sm:w-auto">
              View Games
            </a>
          </div>

        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_GAMES.map((game, index) => (
            <Reveal key={game.slug} delay={index * 100}>
              <article className="group flex h-full min-h-[300px] overflow-hidden rounded-xl border border-primary bg-white text-gray-950 shadow-[0_0_0_1px_rgba(255,126,0,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.35)] dark:bg-black dark:text-white dark:hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.85)]">
                <div className="flex w-full flex-col">
                  <div className="relative h-44 overflow-hidden border-b border-primary sm:h-48">
                    <img src={resolveGameAsset(game.image)} alt={game.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex min-h-[124px] flex-1 flex-col bg-white p-4 dark:bg-black">
                    <div>
                      <h3 className="text-xl font-semibold leading-tight text-gray-950 dark:text-white">{game.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {game.tags.map((tag, tagIndex) => (
                          <span key={tag} className="inline-flex items-center gap-1.5">
                            {tag}
                            {tagIndex < game.tags.length - 1 && <span className="text-primary">|</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <a href={`/games/${game.slug}`} className="inline-flex items-center gap-2 btn-secondary px-3 py-2  text-xs">
                        View Details <i className="fas fa-arrow-right text-[9px]" />
                      </a>
                      <div className="flex items-center gap-2 text-2xl text-gray-800 dark:text-white">
                        <a
                          href={game.androidUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Search Google Play for ${game.title}`}
                          title={`Search Google Play for ${game.title}`}
                          className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          {/* <i className="fab fa-android" aria-hidden="true" /> */}
                          <img
                            src={androidIcon}
                            alt=""
                            className="invert dark:invert-0"
                          />
                        </a>
                        {/* <span className="h-4 w-px bg-gray-400 dark:bg-white/45" />
                        <a
                          href={game.iosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Search the App Store for ${game.title}`}
                          title={`Search the App Store for ${game.title}`}
                          className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <i className="fab fa-apple" aria-hidden="true" />
                        </a> */}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurMission() {
  return (
    <section id="games" className="bg-white py-10 dark:bg-black md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex w-full items-center gap-4 sm:gap-5">
              <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">Our Story / Our Mission</p>
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
          <h2 className="mb-3 font-gaming text-4xl font-black leading-none text-gray-900 dark:text-white sm:text-5xl">
            <span>From </span> <span className="text-primary-dark">Game Ideas to Launch,</span>{' '}<span>One Studio.</span>
          </h2>
        </Reveal>
        <div className="">
          <p>Waywe Gaming is a game development studio built around one simple idea: every game should give players a clear reason to keep playing. With 9+ years of experience, our team works across 2D and 3D development, creating horror, action, survival, simulation, and shooter experiences with their own identity. Our current lineup includes Grand Mafia Gangster City Game, Agent For Hire: Suit Shooter, Doppelganger or Neighbor Game, Midnight Shift: Doppelganger, and Last Survivor Left: Zombie War. Each title starts with its own gameplay goal instead of being pushed through the same formula. We shape mechanics, controls, pacing, art direction, environments, and progression around the experience the game needs. </p>
          <p>That might mean careful inspection and suspense in a retro 2D horror game, open-world driving and combat in a 3D crime game, or resource gathering and survival against zombie threats. From early concepts to playable builds and ongoing improvements, our team keeps the player experience at the center while giving every project room to become something distinct. We test ideas, refine what works, and keep learning from each release so the next build feels more focused.</p>
          <a href="/about" className='btn-primary p-3 mt-7'>Learn More About Us</a>
        </div>
      </div>
    </section>
  );
}

const TEAM = [
  { name: 'Eddie Sankari', role: 'CEO & Founder', image: eddieImage, linkedin: 'https://www.linkedin.com/in/waywegaming/' },
  { name: 'Ayesha Mazhar', role: 'General Manager', image: ayeshaImage, linkedin: 'https://www.linkedin.com/in/ayesha-mazhar-179a61240/?isSelfProfile=true' },
  { name: 'Abdul Ahad', role: 'Assistant Manager', image: ahadImage, linkedin: 'https://www.linkedin.com/in/imabdulahad/' },
  { name: 'Numan Ali', role: 'Project Manager', image: nomanImage, linkedin: 'https://www.linkedin.com/in/noman-ali-5b0a03104/' },
];

function Team() {
  return (
    <section id="team" className="bg-white py-10 dark:bg-black md:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ---------- Section heading ---------- */}
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">
              Our Team
            </p>
            <h2 className="font-gaming text-4xl font-black leading-none text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              The <span className="text-primary-dark">Minds Behind</span> the Magic
            </h2>
          </div>
        </Reveal>

        {/* ---------- Team grid ---------- */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, index) => (
            <Reveal key={member.name} delay={index * 100}>
              <article className="group">

                {/* ============ Image card ============ */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-primary">

                  {/* Photo */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105 sm:h-72"
                  />

                  {/* ---------- Orange tint â€” appears on hover ---------- */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-700/90 via-orange-600/65 to-orange-500/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Dark bottom fade for legibility */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />

                  {/* ---------- Social icons â€” top right ---------- */}
                  <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                    <a
                      href={member.linkedin}
                      aria-label={`${member.name} on LinkedIn`}
                      className="flex h-7 w-7 -translate-y-1 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 shadow-md transition-all duration-500 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <i className="fab fa-linkedin-in text-[11px]" />
                    </a>
                  </div>
                </div>

                {/* ============ Name + role ============ */}
                <div className="pt-4 text-center">
                  <h3 className="font-gaming text-lg font-bold text-gray-900 transition-colors duration-500 group-hover:text-primary dark:text-white">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                    {member.role}
                  </p>
                </div>

              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const JOBS = [
  { title: 'Game Developer (Unreal Engine)', meta: 'Full Time â€¢ Remote / On-site', highlight: true },
  { title: '3D Artist (Environment)', meta: 'Full Time â€¢ Remote / On-site', highlight: false },
  { title: 'UI/UX Designer', meta: 'Full Time â€¢ Remote / On-site', highlight: false },
  // { title: 'Project Manager', meta: 'Full Time â€¢ Remote / On-site', highlight: false },
];

function Careers() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section id="careers" className="bg-white py-20 dark:bg-black md:py-24">
      <Reveal>
        <div className="relative overflow-hidden bg-cover bg-center px-6 py-10 md:px-10 lg:px-12" style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.5), rgba(0,0,0,.3)), url(${ctaImage})`
        }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Join Our Team</p>
              <h2 className="font-gaming text-4xl font-black leading-none text-white sm:text-5xl">
                Build The <span className="text-primary-dark">Next Game </span>
                With Us.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-300">
                Bring your skills to our team and help create 2D and 3D games across horror, action, survival, simulation, and shooters for players everywhere.
              </p>
              <a href="/careers" className="btn-primary mt-7 inline-flex rounded-lg px-5 py-3 text-xs font-semibold text-white">View Open Position</a>
            </div>
            <div className="rounded-xl border border-primary bg-black/30 p-4 backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold text-white">
                <i className="fas fa-gamepad text-lg text-white" />Current Openings
              </h3>
              <div className="divide-y divide-gray-700">
                {JOBS.map((job, index) => (
                  <a key={`${job.title}-${index}`} href="/careers" className="flex items-center justify-between gap-3 py-3 text-[10px] text-gray-300 transition hover:text-primary">
                    <span>{job.title}</span><i className="fas fa-arrow-right text-primary" />
                  </a>
                ))}
              </div>
              <a href="/careers" className="mt-3 inline-flex text-[10px] text-primary">View All Jobs <i className="fas fa-arrow-right ml-2" /></a>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mt-8 rounded-xl border border-primary p-5 bg-black md:p-6">
            <form onSubmit={handleSubscribe} className="flex flex-col items-center gap-5 md:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center  ">
                  <i className="fas fa-envelope text-4xl text-primary" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-200">Get studio updates, jobs alert and more.</h4>
                  {subscribed && <p className="mt-1 text-xs text-primary">Thanks! You&apos;re subscribed.</p>}
                </div>
              </div>
              <div className='flex gap-3 '>

                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="w-full rounded-lg border bg-white/10 text-white border-gray-500 px-4 py-3 text-xs placeholder-gray-500 focus:border-primary focus:outline-none sm:max-w-xs" />
                <button type="submit" className="btn-primary w-full rounded-lg px-6 py-3 text-xs font-semibold text-white sm:w-auto">Subscribe</button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedGames />
      <OurMission />
      <Team />
      <Careers />
      <ContactSection />
    </>
  );
}









