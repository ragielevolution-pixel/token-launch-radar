// Token Radar dashboard: renders window.RADAR (written by main.ts into
// data.js beside this page) with no network. Board, detail view for every
// protocol, and a filter. No network calls, no links, no external resources.
(function () {
  'use strict';
  var data = window.RADAR;
  if (!data || !Array.isArray(data.rows)) {
    document.getElementById('meta').textContent = 'No radar data found: data.js did not load.';
    return;
  }
  var rows = data.rows;
  var live = data.live || [];

  function money(n) {
    if (n === null || n === undefined) return '—';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + String(Math.round(n));
  }
  function pct(n) {
    if (n === null || n === undefined) return '—';
    return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
  }
  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }
  function numCell(text, cls) {
    var td = el('td', text, 'num' + (cls ? ' ' + cls : ''));
    return td;
  }

  document.getElementById('meta').textContent =
    'Snapshot ' + data.as_of + ' · ' + data.board_size + ' protocols ranked (' +
    data.watchlist_size + ' on the watchlist, ' + data.early_size + ' early) · ' +
    data.live_size + ' live-token protocols set aside · Model ' + data.model_version +
    ' · Floor $' + (data.floor_usd / 1e6).toFixed(0) + 'M';

  var catSel = document.getElementById('category');
  var chainSel = document.getElementById('chain');
  var cats = {};
  var chains = {};
  rows.forEach(function (r) {
    if (r.category) cats[r.category] = true;
    r.chains.forEach(function (c) { chains[c] = true; });
  });
  Object.keys(cats).sort().forEach(function (c) { catSel.appendChild(el('option', c)); });
  Object.keys(chains).sort().forEach(function (c) { chainSel.appendChild(el('option', c)); });

  var state = { q: '', category: '', chain: '', minTvl: 0, watchlist: false, sort: 'rank', selected: null };
  // Watchlist rows are exactly the board rows at or above the floor: every
  // board row is pre-token and passes the watchlist's rule, and the early
  // rows are all below the floor. So TVL >= floor is the watchlist filter.
  function filtered() {
    var q = state.q.trim().toLowerCase();
    var out = rows.filter(function (r) {
      if (q && r.name.toLowerCase().indexOf(q) < 0 && r.slug.toLowerCase().indexOf(q) < 0) return false;
      if (state.category && r.category !== state.category) return false;
      if (state.chain && r.chains.indexOf(state.chain) < 0) return false;
      if (r.tvl_usd < state.minTvl) return false;
      if (state.watchlist && r.tvl_usd < data.floor_usd) return false;
      return true;
    });
    var s = state.sort;
    out.sort(function (a, b) {
      if (s === 'tvl') return b.tvl_usd - a.tvl_usd;
      if (s === 'change') return (b.change_7d || 0) - (a.change_7d || 0);
      if (s === 'age') return (b.age_days || 0) - (a.age_days || 0);
      if (s === 'name') return a.name < b.name ? -1 : 1;
      return a.rank - b.rank;
    });
    return out;
  }

  var tbody = document.getElementById('rows');
  var countEl = document.getElementById('count');

  function renderBoard() {
    var list = filtered();
    tbody.textContent = '';
    list.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.setAttribute('aria-selected', state.selected === r.slug ? 'true' : 'false');
      tr.appendChild(numCell(String(r.rank)));
      var nameTd = el('td', r.name + '  ·  ' + r.slug);
      tr.appendChild(nameTd);
      tr.appendChild(el('td', r.category || '—'));
      tr.appendChild(el('td', r.chains.slice(0, 3).join(', ') + (r.chains.length > 3 ? ' +' + (r.chains.length - 3) : '')));
      tr.appendChild(numCell(money(r.tvl_usd)));
      var ch = el('td', null, 'num');
      ch.appendChild(el('span', pct(r.change_7d), (r.change_7d || 0) >= 0 ? 'up' : 'down'));
      tr.appendChild(ch);
      tr.appendChild(numCell(r.age_days === null ? '—' : r.age_days + 'd'));
      tr.appendChild(numCell(money(r.implied_value_usd), 'implied'));
      tr.addEventListener('click', function () { showDetail(r.slug); });
      tbody.appendChild(tr);
    });
    countEl.textContent = 'Showing ' + list.length + ' of ' + rows.length + ' ranked protocols.';
  }

  var detailEmpty = document.getElementById('detail-empty');
  var detailBody = document.getElementById('detail-body');
  function showDetail(slug) {
    var r = null;
    for (var i = 0; i < rows.length; i++) if (rows[i].slug === slug) { r = rows[i]; break; }
    if (!r) return;
    state.selected = slug;
    detailEmpty.hidden = true;
    detailBody.hidden = false;
    detailBody.textContent = '';
    detailBody.appendChild(el('h3', '#' + r.rank + '  ' + r.name));
    detailBody.appendChild(el('p', r.slug + ' · ' + (r.category || 'No category') + ' · ' + r.chains.join(', '), 'note'));
    var facts = el('div', null, 'facts');
    var fact = function (label, value) {
      var d = el('div');
      d.appendChild(el('b', label));
      d.appendChild(document.createTextNode(value));
      facts.appendChild(d);
    };
    fact('Implied value', money(r.implied_value_usd));
    fact('TVL', money(r.tvl_usd));
    fact('7-day change', pct(r.change_7d));
    fact('Age', r.age_days === null ? 'Unknown' : r.age_days + ' days');
    fact('Peer multiple', r.peer_multiple.toFixed(3) + ' (' + r.peer_source + ')');
    fact('Growth ×', r.growth_multiplier.toFixed(3));
    fact('Maturity ×', r.maturity_multiplier.toFixed(3));
    fact('Chain ×', r.chain_multiplier.toFixed(3));
    detailBody.appendChild(facts);
    var formula = el('p', 'Model: TVL ' + money(r.tvl_usd) + ' × peer ' + r.peer_multiple.toFixed(3) +
      ' × growth ' + r.growth_multiplier.toFixed(3) + ' × maturity ' + r.maturity_multiplier.toFixed(3) +
      ' × chains ' + r.chain_multiplier.toFixed(3) + ' = ' + money(r.implied_value_usd) +
      '. The peer multiple is the median market-cap-to-TVL of live-token peers in this category' +
      (r.peer_source === 'global' ? ', falling back to the global median because the category has too few live peers.' : '.'), 'note');
    detailBody.appendChild(formula);
    detailBody.appendChild(el('h3', 'Farm plan — 7 steps'));
    var ol = document.createElement('ol');
    r.farm_steps.forEach(function (s) {
      ol.appendChild(el('li', s));
    });
    detailBody.appendChild(ol);
    detailBody.appendChild(el('p', 'Token status: this protocol records no token in the sealed snapshot. That is not proof it has none, and it is not a promise that a token will be issued.', 'note'));
    renderBoard();
    detailBody.scrollIntoView({ block: 'nearest' });
  }

  function renderLive() {
    var tb = document.getElementById('live-rows');
    live.forEach(function (p) {
      var tr = document.createElement('tr');
      tr.appendChild(el('td', p.name + '  ·  ' + p.slug));
      tr.appendChild(el('td', p.category || '—'));
      tr.appendChild(numCell(money(p.tvl_usd)));
      tr.appendChild(numCell(money(p.mcap_usd)));
      tr.appendChild(numCell(p.multiple === null ? '—' : p.multiple.toFixed(3)));
      tb.appendChild(tr);
    });
  }

  document.getElementById('q').addEventListener('input', function (e) { state.q = e.target.value; renderBoard(); });
  catSel.addEventListener('change', function (e) { state.category = e.target.value; renderBoard(); });
  chainSel.addEventListener('change', function (e) { state.chain = e.target.value; renderBoard(); });
  document.getElementById('mintvl').addEventListener('change', function (e) { state.minTvl = Number(e.target.value); renderBoard(); });
  document.getElementById('watchlist').addEventListener('change', function (e) { state.watchlist = e.target.checked; renderBoard(); });
  document.getElementById('sort').addEventListener('change', function (e) { state.sort = e.target.value; renderBoard(); });

  renderBoard();
  renderLive();
})();
