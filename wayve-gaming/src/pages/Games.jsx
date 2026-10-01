import CallToAction from '../components/CallToAction';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import catalog from '../data/games.json';
import androidIcon from '../assets/extras/android.png';
import { resolveGameAsset } from '../utils/gameAssets';
import ctaImage from '../assets/cta/cta-image.webp'

export default function Games() {
  return (
    <div className="bg-white dark:bg-black">
        <PageHero
            imagePath={resolveGameAsset('/assets/games/main-game-page-hero.webp')}
            pageName="Our Games"
            heading={<>Games Built for   <span className="text-primary-dark">Every Kind</span>  of Player</>}
            description="Explore horror, survival, action open world and tactical shooter games from Waywe Gaming. Each of the titles provides its own set of setting, style of gameplay, and challenge, from tense 2D detection to immersive 3D worlds."
        />
        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {catalog.games.map((game, index) => (
                <Reveal key={game.slug} delay={index * 80}>
                    <article className="group flex h-full min-h-[300px] overflow-hidden rounded-xl border border-primary bg-white text-gray-950 shadow-[0_0_0_1px_rgba(255,126,0,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.35)] dark:bg-black dark:text-white dark:hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.85)]">
                    <div className="flex w-full flex-col">
                        <div className="relative h-44 overflow-hidden border-b border-primary sm:h-48">
                        <img
                            src={resolveGameAsset(game.image)}
                            alt={game.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        </div>

                        <div className="flex min-h-[124px] flex-1 flex-col bg-white p-4 dark:bg-black">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-950 dark:text-white">
                            {game.title}
                            </h2>

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
                            <a
                            href={`/games/${game.slug}`}
                            className="inline-flex items-center gap-2 btn-secondary px-3 py-2  text-xs"
                            >
                            View Details
                            <i className="fas fa-arrow-right text-[9px]" />
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
            </section>

      <CallToAction
        imagePath={ctaImage}
        heading={<>Ready to Find Your Next <span className="text-primary-dark">Game?</span></>}
        description="Step into worlds built around action, suspense, survival, and strategy. Explore the Waywe Gaming lineup and choose the experience that matches how you want to play."
        buttonLabel="Explore Our Games"
        buttonHref="/contact"
      />
    </div>
  );
}



