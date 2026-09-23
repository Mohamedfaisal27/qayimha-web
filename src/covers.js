function normName(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function sortByBestMatch(data, game) {
  if (!Array.isArray(data)) return data;
  const target = normName(game.name);
  const score = (d) => {
    let s = 0;
    const n = normName(d && d.name);
    if (n && n === target) s += 100;
    else if (n && (n.includes(target) || target.includes(n))) s += 30;
    if (d && d.first_release_date) {
      const y = new Date(d.first_release_date * 1000).getUTCFullYear();
      if (y === game.year) s += 50;
      else if (Math.abs(y - game.year) === 1) s += 20;
    }
    if (d && d.total_rating_count) s += Math.min(d.total_rating_count / 100, 20);
    return s;
  };
  data.forEach(d => {
    if (d && d.cover && d.cover.url) {
      d.cover.url = d.cover.url.replace(/\/t_[a-z0-9_]+\//, '/t_720p/');
    }
  });
  data.sort((a, b) => score(b) - score(a));
  return data;
}
