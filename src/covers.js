function normName(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function pickBestCover(data, game) {
  if (!Array.isArray(data)) return null;
  const withCover = data.filter(d => d && d.cover && d.cover.url);
  if (withCover.length === 0) return null;
  const target = normName(game.name);
  const scored = withCover.map(d => {
    let score = 0;
    const n = normName(d.name);
    if (n && n === target) score += 100;
    else if (n && (n.includes(target) || target.includes(n))) score += 30;
    if (d.first_release_date) {
      const y = new Date(d.first_release_date * 1000).getUTCFullYear();
      if (y === game.year) score += 50;
      else if (Math.abs(y - game.year) === 1) score += 20;
    }
    if (d.total_rating_count) score += Math.min(d.total_rating_count / 100, 20);
    return { d, score };
  });
    scored.sort((a, b) => b.score - a.score);
  if (scored[0].score < 30) return null;
  return scored[0].d;
}

  


export async function fetchGameCover(game, backendUrl, storageGetSafe, storageSetSafe) {
  const cacheRes = await storageGetSafe(`igdb-cover2:${game.id}`, true);
  if (cacheRes && cacheRes.value) {
    return JSON.parse(cacheRes.value);
  }
    const cleanName = game.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const res = await fetch(`${backendUrl}/api/games/search?q=${encodeURIComponent(cleanName)}`);

  const data = await res.json();
  const match = pickBestCover(data, game);
  let coverUrl = null;
  if (match) {
    const raw = match.cover.url;
    coverUrl = (raw.startsWith('//') ? 'https:' + raw : raw).replace(/\/t_[a-z0-9_]+\//, '/t_720p/');
  }
  const result = { url: coverUrl };
  await storageSetSafe(`igdb-cover2:${game.id}`, JSON.stringify(result), true);
  return result;
}
