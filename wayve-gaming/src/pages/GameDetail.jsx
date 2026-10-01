import CallToAction from '../components/CallToAction';
import Reveal from '../components/Reveal';
import catalog from '../data/games.json';
import PageHero from '../components/PageHero';
import androidIcon from '../assets/extras/android.png';
import androidStoreBadge from '../assets/extras/andriodBig.png';
import windowsStoreBadge from '../assets/extras/get-it-on-windows.webp';
import { resolveGameAsset } from '../utils/gameAssets';

const iconForLabel = (label) => {
  const text = label.toLowerCase();
  if (text.includes('developer')) return 'fa-code';
  if (text.includes('publisher')) return 'fa-building';
  if (text.includes('date') || text.includes('updated')) return 'fa-calendar';
  if (text.includes('platform')) return 'fa-gamepad';
  return 'fa-circle-info';
};

const normalizeRows = (rows) => (rows ?? []).map((row) => (
  Array.isArray(row) ? { label: row[0], value: row[1] } : row
)).filter((row) => row?.label && row?.value);

export default function GameDetail({ slug }) {
  const game = catalog.games.find((item) => item.slug === slug);

  if (!game) {
    return (
      <section className="bg-white px-6 py-32 text-center dark:bg-black">
        <h1 className="font-gaming text-4xl text-gray-900 dark:text-white">Game Not Found</h1>
        <a href="/games" className="btn-primary-dark mt-6 inline-flex rounded-lg px-5 py-3 text-xs font-semibold text-white">
          Back to Games
        </a>
      </section>
    );
  }

  const metaItems = [
    ['Developer', game.developer || 'WayWe Gaming'],
    ['Publisher', game.publisher || 'WayWe Gaming'],
    [game.releaseDate ? 'Release Date' : 'Updated On', game.releaseDate || game.updatedOn || game.requirements?.release],
    ['Platforms', game.requirements?.platform],
  ].filter(([, value]) => value);

  const requirementGroups = game.deviceRequirements?.length
    ? game.deviceRequirements
    : [
        {
          title: 'Minimum Requirements',
          items: [
            ['OS', game.requirements?.minimum?.os],
            ['Processor', game.requirements?.minimum?.processor],
            ['Memory', game.requirements?.minimum?.memory],
            ['Graphics', game.requirements?.minimum?.graphics],
            ['Storage', game.requirements?.minimum?.storage],
          ],
        },
        {
          title: 'Recommended Requirements',
          items: [
            ['OS', game.requirements?.recommended?.os],
            ['Processor', game.requirements?.recommended?.processor],
            ['Memory', game.requirements?.recommended?.memory],
            ['Graphics', game.requirements?.recommended?.graphics],
            ['Storage', game.requirements?.recommended?.storage],
          ],
        },
      ];

  const relatedGames = (game.relatedSlugs ?? [])
    .map((relatedSlug) => catalog.games.find((item) => item.slug === relatedSlug))
    .filter(Boolean);
  const fallbackRelated = catalog.games.filter((item) => item.slug !== game.slug).slice(0, 4);
  const displayedRelated = (relatedGames.length ? relatedGames : fallbackRelated).slice(0, 4);
  const screenshots = game.screenshots?.length ? game.screenshots : [game.image];
  const bannerImage = game.bannerImage || game.image;
  const aboutImage = game.aboutImage || game.image;
  const cta = game.cta ?? {};

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        imagePath={resolveGameAsset(bannerImage)}
        pageName="Our Games"
        heading={<>{game.title}</>}
        description={game.heroSummary || game.description}
      />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10 lg:px-12">
        {(game.androidUrl || game.windowsUrl) && (
          <div className="flex flex-wrap items-center gap-4 pb-10 sm:gap-6">
            {game.androidUrl && (
              <a href={game.androidUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open Google Play for ${game.title}`} className="inline-flex items-center transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <img src={androidStoreBadge} alt="Get it on Google Play" className="w-40" />
              </a>
            )}
            {game.windowsUrl && (
              <a href={game.windowsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open Windows download for ${game.title}`} className="inline-flex items-center transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <img src={windowsStoreBadge} alt="Get it on Windows" className="w-40" />
              </a>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr_1.35fr]">
          <Reveal>
            <img src={resolveGameAsset(aboutImage)} alt={`${game.title} about`} className="h-full min-h-72 w-full rounded-xl border border-primary-dark object-cover" />
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6 lg:px-4 lg:py-2">
              {metaItems.map(([label, value]) => (
                <div key={label} className="flex items-center gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary bg-transparent">
                    <i className={`fas ${iconForLabel(label)} text-md text-primary`} />
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-1 text-md text-gray-900 dark:text-gray-100">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div>
              <h2 className="font-gaming text-3xl font-bold tracking-wide sm:text-5xl">
                <span className="text-primary-dark">About</span> This Game
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-900 dark:text-gray-100">{game.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {(game.modes?.length ? game.modes : game.tags).map((mode) => (
                  <span key={mode} className="rounded-md bg-gray-100 px-5 py-2 text-xs text-gray-700 transition hover:border-primary hover:bg-primary/10 dark:border-gray-600 dark:bg-gray-900/80 dark:text-gray-200" style={{ boxShadow: 'inset -3px 0 6px rgba(254, 252, 252, 0.2), inset 0 1px 5px rgba(254, 254, 254, 0.2)' }}>
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="sm:pt-20">
          <h2 className="mt-16 font-gaming text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100 sm:text-5xl">
            Game <span className="text-primary-dark">Screenshots</span>
          </h2>
          <p className="mt-3 max-w-2xl text-md text-gray-900 dark:text-gray-100">{game.screenshotIntro || 'Take a closer look at the world, characters, and action.'}</p>
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_2fr]">
          <Reveal>
            <img src={resolveGameAsset(screenshots[0])} alt={`${game.title} screenshot 1`} className="h-72 w-full rounded-xl border-2 border-primary object-cover lg:h-full" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {screenshots.slice(1, 5).map((image, index) => (
              <Reveal key={image} delay={(index + 1) * 80}>
                <img src={resolveGameAsset(image)} alt={`${game.title} screenshot ${index + 2}`} className="h-32 w-full rounded-xl border border-primary/70 object-cover transition duration-300 hover:border-primary sm:h-36 lg:h-[13.5rem]" />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="sm:pt-20">
          <h2 className="mt-16 font-gaming text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100 sm:text-6xl">
            Key <span className="text-primary-dark">Features</span>
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {game.features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <div className="h-full rounded-xl border border-primary/70 bg-white p-5 transition duration-300 hover:border-primary hover:shadow-[0_15px_40px_-20px_rgba(249,115,22,0.5)] dark:bg-black">
                <div className="flex h-10 w-10 items-center justify-center"><i className="fas fa-gamepad text-2xl text-gray-800 dark:text-gray-200" /></div>
                <h3 className="mt-4 font-gaming text-base font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-800 dark:text-gray-200">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="sm:pt-20">
          <h2 className="mt-16 font-gaming text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100 sm:text-6xl">
            Device <span className="text-primary-dark">Requirements</span>
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {requirementGroups.map((group) => (
            <Reveal key={group.title}>
              <div className="h-full rounded-xl border border-primary/70 bg-white p-6 transition duration-300 hover:border-primary dark:bg-black">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/70"><i className="fas fa-gamepad text-sm text-primary" /></span>
                  <h3 className="font-gaming text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">{group.title}</h3>
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  {normalizeRows(group.items).map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-[120px_1fr] gap-3">
                      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                      <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>

        {game.details?.length > 0 && (
          <>
            <Reveal className="sm:pt-20">
              <h2 className="mt-16 font-gaming text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100 sm:text-6xl">
                Game <span className="text-primary-dark">Details</span>
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {normalizeRows(game.details).map(({ label, value }) => (
                <Reveal key={label}>
                  <div className="rounded-xl border border-primary/60 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      <CallToAction
        imagePath={resolveGameAsset(bannerImage)}
        heading={<>{cta.heading || `Ready to Play ${game.title}?`}</>}
        description={cta.description || game.heroSummary || game.description}
        buttonLabel={cta.buttonLabel || 'Play Now'}
        buttonHref={game.androidUrl || '/games'}
      />

      <section id="games" className="bg-white py-10 dark:bg-black md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-10 font-gaming text-4xl font-black leading-none text-gray-900 dark:text-white sm:text-5xl">Related/Other Games</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayedRelated.map((relatedGame, index) => (
              <Reveal key={relatedGame.slug} delay={index * 100}>
                <article className="group flex h-full min-h-[300px] overflow-hidden rounded-xl border border-primary bg-white text-gray-950 shadow-[0_0_0_1px_rgba(255,126,0,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.35)] dark:bg-black dark:text-white dark:hover:shadow-[0_16px_36px_-18px_rgba(255,126,0,0.85)]">
                  <div className="flex w-full flex-col">
                    <div className="relative h-44 overflow-hidden border-b border-primary sm:h-48"><img src={resolveGameAsset(relatedGame.image)} alt={relatedGame.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
                    <div className="flex min-h-[124px] flex-1 flex-col bg-white p-4 dark:bg-black">
                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-gray-950 dark:text-white">{relatedGame.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                          {relatedGame.tags.map((tag, tagIndex) => <span key={tag} className="inline-flex items-center gap-1.5">{tag}{tagIndex < relatedGame.tags.length - 1 && <span className="text-primary">|</span>}</span>)}
                        </div>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                        <a href={`/games/${relatedGame.slug}`} className="btn-secondary inline-flex items-center gap-2 px-3 py-2 text-xs">View Details <i className="fas fa-arrow-right text-[9px]" /></a>
                        {relatedGame.androidUrl && <a href={relatedGame.androidUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open Google Play for ${relatedGame.title}`} title={`Open Google Play for ${relatedGame.title}`} className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><img src={androidIcon} alt="" className="invert dark:invert-0" /></a>}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}



