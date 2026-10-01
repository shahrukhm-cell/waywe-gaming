import { useEffect, useState } from 'react';
import gamesData from '../data/games.json';
import { getStoredItems, readJsonResponse, productionApiMessage, setStoredItems } from '../utils/api';
import { resolveGameAsset } from '../utils/gameAssets';

const DEFAULT_REQUIREMENTS = {
  platform: '',
  players: '',
  release: '',
  minimum: { os: '', processor: '', memory: '', graphics: '', storage: '' },
  recommended: { os: '', processor: '', memory: '', graphics: '', storage: '' },
};
const INPUT_CLASS = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder-gray-500';

function stringify(value, fallback) {
  return JSON.stringify(value ?? fallback, null, 2);
}

function createDraft(game) {
  if (!game) {
    return {
      slug: '', title: '', genre: '', tags: '', developer: 'WayWe Gaming', publisher: 'WayWe Gaming', releaseDate: '', updatedOn: '', image: '', bannerImage: '', aboutImage: '', androidUrl: '', windowsUrl: '', iosUrl: '', heroSummary: '', description: '', modes: '', screenshots: '', screenshotIntro: '', features: '[]', deviceRequirements: '[]', details: '[]', cta: stringify({ heading: '', description: '', buttonLabel: 'Play Now' }, {}), relatedSlugs: '', requirements: stringify(DEFAULT_REQUIREMENTS, DEFAULT_REQUIREMENTS),
    };
  }

  return {
    slug: game.slug ?? '',
    title: game.title ?? '',
    genre: game.genre ?? '',
    tags: (game.tags ?? []).join(', '),
    developer: game.developer ?? 'WayWe Gaming',
    publisher: game.publisher ?? 'WayWe Gaming',
    releaseDate: game.releaseDate ?? '',
    updatedOn: game.updatedOn ?? '',
    image: game.image ?? '',
    bannerImage: game.bannerImage ?? '',
    aboutImage: game.aboutImage ?? '',
    androidUrl: game.androidUrl ?? '',
    windowsUrl: game.windowsUrl ?? '',
    iosUrl: game.iosUrl ?? '',
    heroSummary: game.heroSummary ?? '',
    description: game.description ?? '',
    modes: (game.modes ?? []).join(', '),
    screenshots: (game.screenshots ?? []).join('\n'),
    screenshotIntro: game.screenshotIntro ?? '',
    features: stringify(game.features, []),
    deviceRequirements: stringify(game.deviceRequirements, []),
    details: stringify(game.details, []),
    cta: stringify(game.cta, { heading: '', description: '', buttonLabel: 'Play Now' }),
    relatedSlugs: (game.relatedSlugs ?? []).join(', '),
    requirements: stringify(game.requirements, DEFAULT_REQUIREMENTS),
  };
}

function parseJsonField(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} must be valid JSON.`);
  }
}

function toGame(draft) {
  const features = parseJsonField(draft.features, 'Features');
  const requirements = parseJsonField(draft.requirements, 'Requirements');
  const deviceRequirements = parseJsonField(draft.deviceRequirements, 'Device requirements');
  const details = parseJsonField(draft.details, 'Game details');
  const cta = parseJsonField(draft.cta, 'CTA');

  if (!Array.isArray(features)) throw new Error('Features must be a JSON array.');
  if (!Array.isArray(deviceRequirements)) throw new Error('Device requirements must be a JSON array.');
  if (!Array.isArray(details)) throw new Error('Game details must be a JSON array.');
  if (!requirements || typeof requirements !== 'object' || Array.isArray(requirements)) throw new Error('Requirements must be a JSON object.');
  if (!cta || typeof cta !== 'object' || Array.isArray(cta)) throw new Error('CTA must be a JSON object.');

  return {
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    genre: draft.genre.trim(),
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    developer: draft.developer.trim(),
    publisher: draft.publisher.trim(),
    releaseDate: draft.releaseDate.trim(),
    updatedOn: draft.updatedOn.trim(),
    image: draft.image.trim(),
    bannerImage: draft.bannerImage.trim(),
    aboutImage: draft.aboutImage.trim(),
    androidUrl: draft.androidUrl.trim(),
    windowsUrl: draft.windowsUrl.trim(),
    iosUrl: draft.iosUrl.trim(),
    heroSummary: draft.heroSummary.trim(),
    description: draft.description.trim(),
    modes: draft.modes.split(',').map((mode) => mode.trim()).filter(Boolean),
    screenshots: draft.screenshots.split('\n').map((url) => url.trim()).filter(Boolean),
    screenshotIntro: draft.screenshotIntro.trim(),
    features,
    deviceRequirements,
    details,
    cta,
    relatedSlugs: draft.relatedSlugs.split(',').map((slug) => slug.trim()).filter(Boolean),
    requirements,
  };
}

export default function GameCrud() {
  const [games, setGames] = useState([]);
  const [draft, setDraft] = useState(createDraft);
  const [editingSlug, setEditingSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isActive = true;
    fetch('/api/games')
      .then((response) => readJsonResponse(response, productionApiMessage('Loading games')))
      .then((result) => { if (isActive) setGames(result.games ?? []); })
      .catch(() => { if (isActive) { setGames(getStoredItems('wayve:games', gamesData.games ?? [])); setError(''); } })
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, []);

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setError('');
    setNotice('');
  };

  const resetEditor = () => {
    setDraft(createDraft());
    setEditingSlug('');
    setError('');
    setNotice('');
  };

  const saveGame = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const game = toGame(draft);
      const saveLocally = () => {
        const currentGames = getStoredItems('wayve:games', gamesData.games ?? []);
        if (currentGames.some((item) => item.slug === game.slug && item.slug !== editingSlug)) throw new Error('A game with this slug already exists.');
        const updatedGames = editingSlug ? currentGames.map((item) => item.slug === editingSlug ? game : item) : [...currentGames, game];
        setStoredItems('wayve:games', updatedGames);
        setGames(updatedGames);
        resetEditor();
        setNotice(editingSlug ? 'Game updated.' : 'Game added.');
      };

      try {
        const endpoint = editingSlug ? `/api/games/${encodeURIComponent(editingSlug)}` : '/api/games';
        const response = await fetch(endpoint, { method: editingSlug ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(game) });
        const result = await readJsonResponse(response, productionApiMessage('Saving games'));
        setGames((current) => editingSlug ? current.map((item) => item.slug === editingSlug ? result.game : item) : [...current, result.game]);
        resetEditor();
        setNotice(editingSlug ? 'Game updated.' : 'Game added.');
      } catch (requestError) {
        if (requestError.message === productionApiMessage('Saving games')) saveLocally();
        else setError(requestError.message);
      }
    } catch (draftError) {
      setError(draftError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const editGame = (game) => {
    setDraft(createDraft(game));
    setEditingSlug(game.slug);
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteGame = async (game) => {
    if (!window.confirm(`Delete "${game.title}"? This cannot be undone.`)) return;
    setError('');
    setNotice('');

    const deleteLocally = () => {
      const updatedGames = getStoredItems('wayve:games', gamesData.games ?? []).filter((item) => item.slug !== game.slug);
      setStoredItems('wayve:games', updatedGames);
      setGames(updatedGames);
      if (editingSlug === game.slug) resetEditor();
      setNotice('Game deleted.');
    };

    try {
      const response = await fetch(`/api/games/${encodeURIComponent(game.slug)}`, { method: 'DELETE' });
      const result = await readJsonResponse(response, productionApiMessage('Deleting games'));
      setGames(result.games ?? []);
      if (editingSlug === game.slug) resetEditor();
      setNotice('Game deleted.');
    } catch (requestError) {
      if (requestError.message === productionApiMessage('Deleting games')) deleteLocally();
      else setError(requestError.message);
    }
  };

  return (
    <section className="min-h-screen bg-white px-4 pb-16 pt-28 text-gray-900 dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-gray-200 pb-5 dark:border-gray-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Studio catalog</p>
          <h1 className="font-gaming text-3xl font-bold sm:text-4xl">Game Editor</h1>
        </header>

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(320px,0.9fr)_1.1fr]">
          <form onSubmit={saveGame} className="space-y-4 border border-gray-200 p-5 dark:border-gray-800 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{editingSlug ? 'Edit game' : 'Add game'}</h2>
              {editingSlug && <button type="button" onClick={resetEditor} className="text-xs text-gray-500 underline hover:text-primary">Cancel edit</button>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Title<input name="title" value={draft.title} onChange={updateDraft} className={INPUT_CLASS} required /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">URL slug<input name="slug" value={draft.slug} onChange={updateDraft} className={INPUT_CLASS} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers, and hyphens." /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Genre<input name="genre" value={draft.genre} onChange={updateDraft} className={INPUT_CLASS} required /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Tags, comma separated<input name="tags" value={draft.tags} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Developer<input name="developer" value={draft.developer} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Publisher<input name="publisher" value={draft.publisher} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Release date<input name="releaseDate" value={draft.releaseDate} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Updated on<input name="updatedOn" value={draft.updatedOn} onChange={updateDraft} className={INPUT_CLASS} /></label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Cover image path<input name="image" value={draft.image} onChange={updateDraft} className={INPUT_CLASS} required /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Banner image path<input name="bannerImage" value={draft.bannerImage} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300 sm:col-span-2">About image path<input name="aboutImage" value={draft.aboutImage} onChange={updateDraft} className={INPUT_CLASS} placeholder="/assets/games/about-game/example.webp" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Android store URL<input type="url" name="androidUrl" value={draft.androidUrl} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Windows store URL<input type="url" name="windowsUrl" value={draft.windowsUrl} onChange={updateDraft} className={INPUT_CLASS} /></label>
              <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">iOS store URL<input type="url" name="iosUrl" value={draft.iosUrl} onChange={updateDraft} className={INPUT_CLASS} /></label>
            </div>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Hero summary<textarea name="heroSummary" value={draft.heroSummary} onChange={updateDraft} className={`${INPUT_CLASS} resize-y`} rows={3} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Description<textarea name="description" value={draft.description} onChange={updateDraft} className={`${INPUT_CLASS} resize-y`} rows={5} required /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Modes, comma separated<input name="modes" value={draft.modes} onChange={updateDraft} className={INPUT_CLASS} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Screenshots, one URL per line<textarea name="screenshots" value={draft.screenshots} onChange={updateDraft} className={`${INPUT_CLASS} resize-y`} rows={3} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Screenshot intro<textarea name="screenshotIntro" value={draft.screenshotIntro} onChange={updateDraft} className={`${INPUT_CLASS} resize-y`} rows={2} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Related slugs, comma separated<input name="relatedSlugs" value={draft.relatedSlugs} onChange={updateDraft} className={INPUT_CLASS} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Features JSON<textarea name="features" value={draft.features} onChange={updateDraft} className={`${INPUT_CLASS} resize-y font-mono text-xs`} rows={7} required /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Device requirements JSON<textarea name="deviceRequirements" value={draft.deviceRequirements} onChange={updateDraft} className={`${INPUT_CLASS} resize-y font-mono text-xs`} rows={8} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Game details JSON<textarea name="details" value={draft.details} onChange={updateDraft} className={`${INPUT_CLASS} resize-y font-mono text-xs`} rows={7} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">CTA JSON<textarea name="cta" value={draft.cta} onChange={updateDraft} className={`${INPUT_CLASS} resize-y font-mono text-xs`} rows={5} /></label>
            <label className="block space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">Legacy requirements JSON<textarea name="requirements" value={draft.requirements} onChange={updateDraft} className={`${INPUT_CLASS} resize-y font-mono text-xs`} rows={12} required /></label>

            <button type="submit" disabled={isSaving} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"><i className={`fas ${editingSlug ? 'fa-save' : 'fa-plus'}`} aria-hidden="true" />{isSaving ? 'Saving...' : editingSlug ? 'Update game' : 'Add game'}</button>
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {notice && <p role="status" className="text-sm text-green-700 dark:text-green-400">{notice}</p>}
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800"><h2 className="text-lg font-semibold">Games</h2><span className="text-xs text-gray-500 dark:text-gray-400">{games.length} total</span></div>
            {isLoading ? <p className="py-8 text-sm text-gray-500">Loading games...</p> : error && games.length === 0 ? <p role="alert" className="py-8 text-sm text-red-600 dark:text-red-400">{error}</p> : games.length === 0 ? <p className="py-8 text-sm text-gray-500 dark:text-gray-400">No games in the catalog.</p> : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...games].map((game) => (
                  <article key={game.slug} className="flex flex-wrap items-center gap-4 py-4">
                    <img src={resolveGameAsset(game.image)} alt="" className="h-20 w-32 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{game.title}</h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">/{game.slug} - {game.genre} - {game.updatedOn || game.releaseDate || 'No date'}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{game.heroSummary || game.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => editGame(game)} aria-label={`Edit ${game.title}`} title="Edit game" className="flex h-9 w-9 items-center justify-center border border-gray-300 text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-200"><i className="fas fa-pen" aria-hidden="true" /></button>
                      <button type="button" onClick={() => deleteGame(game)} aria-label={`Delete ${game.title}`} title="Delete game" className="flex h-9 w-9 items-center justify-center border border-gray-300 text-gray-700 transition hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-200"><i className="fas fa-trash" aria-hidden="true" /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

