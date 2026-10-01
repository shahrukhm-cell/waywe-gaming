const gameAssets = import.meta.glob('../assets/games/**/*.{avif,webp,png,jpg,jpeg,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function normalizeAssetPath(path) {
  return path.replace(/^\.\.\/assets\/games\//, '/assets/games/').replace(/^\.\/assets\/games\//, '/assets/games/');
}

const gameAssetMap = Object.fromEntries(
  Object.entries(gameAssets).map(([path, url]) => [normalizeAssetPath(path), url]),
);

export function resolveGameAsset(path) {
  if (!path) return '';
  return gameAssetMap[path] || path;
}
