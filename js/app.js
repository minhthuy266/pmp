import { defaultSectionId, sections } from './sections.js';

const sectionById = new Map(sections.map(section => [section.id, section]));
const sectionCache = new Map();
const searchIndex = new Map();

const tabs = document.getElementById('tabs');
const content = document.getElementById('content');
const searchInput = document.getElementById('q');
const searchResults = document.getElementById('sr');
const scrollTopButton = document.getElementById('st');

let activeSectionId = null;
let searchRequest = 0;

const predictiveProcessNames = new Set([
  'Develop Project Charter',
  'Identify Stakeholders',
  'Develop Project Management Plan',
  'Direct and Manage Project Work',
  'Manage Project Knowledge',
  'Monitor and Control Project Work',
  'Perform Integrated Change Control',
  'Close Project or Phase',
  'Plan Scope Management',
  'Collect Requirements',
  'Define Scope',
  'Create WBS',
  'Validate Scope',
  'Control Scope',
  'Plan Schedule Management',
  'Define Activities',
  'Sequence Activities',
  'Estimate Activity Durations',
  'Develop Schedule',
  'Control Schedule',
  'Plan Cost Management',
  'Estimate Costs',
  'Determine Budget',
  'Control Costs',
  'Plan Quality Management',
  'Manage Quality',
  'Control Quality',
  'Plan Resource Management',
  'Estimate Activity Resources',
  'Acquire Resources',
  'Develop Team',
  'Manage Team',
  'Control Resources',
  'Plan Communications Management',
  'Manage Communications',
  'Monitor Communications',
  'Plan Risk Management',
  'Identify Risks',
  'Perform Qualitative Risk Analysis',
  'Perform Quantitative Risk Analysis',
  'Plan Risk Responses',
  'Implement Risk Responses',
  'Monitor Risks',
  'Plan Procurement Management',
  'Conduct Procurements',
  'Control Procurements',
  'Plan Stakeholder Engagement',
  'Manage Stakeholder Engagement',
  'Monitor Stakeholder Engagement'
]);

const predictiveProcessAliases = new Map([
  ['Control Cost', 'Control Costs'],
  ['Perform Qualitative Risk', 'Perform Qualitative Risk Analysis']
]);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionIdFromHash() {
  const [id] = decodeURIComponent(location.hash.slice(1)).split('/');
  return sectionById.has(id) ? id : defaultSectionId;
}

function hashPath() {
  return decodeURIComponent(location.hash.slice(1)).split('/').filter(Boolean);
}

function renderTabs() {
  tabs.innerHTML = sections.map(section => `
    <button
      class="tab"
      type="button"
      data-section-id="${section.id}"
      style="--tc:${section.color}"
    >${section.label}</button>
  `).join('');

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-section-id]');
    if (!button) return;
    openSection(button.dataset.sectionId);
  });
}

async function fetchSection(section) {
  if (!sectionCache.has(section.id)) {
    const files = section.parts || [section.file];
    sectionCache.set(section.id, Promise.all(files.map(async file => {
      const response = await fetch(`sections/${file}`);
      if (!response.ok) throw new Error(`Không tải được ${file} (${response.status})`);
      const html = await response.text();
      if (!section.parts) return html;
      const partId = file.split('/').pop().replace(/\.html$/, '');
      return `<section class="process-part" data-process-part="${partId}">${html}</section>`;
    })).then(parts => parts.join('\n')));
  }
  return sectionCache.get(section.id);
}

function setActiveTab(sectionId) {
  tabs.querySelectorAll('.tab').forEach(button => {
    const active = button.dataset.sectionId === sectionId;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

async function openSection(sectionId, options = {}) {
  const section = sectionById.get(sectionId) || sectionById.get(defaultSectionId);
  const { updateHash = true, scroll = true } = options;

  activeSectionId = section.id;
  setActiveTab(section.id);
  searchInput.value = '';
  clearSearch();
  content.innerHTML = '<div class="loading">Đang tải nội dung...</div>';

  try {
    content.innerHTML = await fetchSection(section);
    if (section.id === 'PROCCESSES') enhanceProcessSection();
    document.title = `${section.label.replace(/^[^\p{L}\p{N}]+/u, '')} · PMP Cheat Sheet`;
  } catch (error) {
    content.innerHTML = `<div class="load-error"><strong>Không tải được nội dung.</strong><br>${escapeHtml(error.message)}</div>`;
  }

  const preserveProcessPath = section.id === 'PROCCESSES' && location.hash.startsWith('#PROCCESSES/');
  if (updateHash && !preserveProcessPath && location.hash !== `#${section.id}`) {
    history.pushState(null, '', `#${section.id}`);
  }
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function processSummary(rows, processName) {
  const purpose = rows[0]?.querySelector('.p-tech')?.textContent.replace(/\s+/g, ' ').trim() || '';
  const outputRow = rows.find(row => /output/i.test(row.querySelector('.p-badge')?.textContent || ''));
  const output = outputRow?.querySelector('.p-term')?.textContent.replace(/\s+/g, ' ').trim() || '';

  const summary = document.createElement('summary');
  summary.className = 'process-summary';
  summary.innerHTML = `
    <span class="process-summary-name">${escapeHtml(processName)}</span>
    <span class="process-summary-purpose">${escapeHtml(purpose)}</span>
    <span class="process-summary-output">${output ? `Output: ${escapeHtml(output)}` : `${rows.length} mục`}</span>
    <span class="process-summary-chevron" aria-hidden="true"></span>
  `;
  return summary;
}

function groupProcessRows(part) {
  const rows = Array.from(part.querySelectorAll(':scope > .proc-row:not(.proc-header)'));
  const groups = [];
  let currentName = '';

  for (const row of rows) {
    const rawName = row.querySelector('.p-name')?.textContent.replace(/\s+/g, ' ').trim() || '';
    const term = row.querySelector('.p-term')?.textContent.replace(/\s+/g, ' ').trim() || '';
    const normalizedRawName = predictiveProcessAliases.get(rawName) || rawName;
    const correctedHeading = term === 'Control Scope' ? term : '';

    if (correctedHeading) {
      currentName = correctedHeading;
    } else if (predictiveProcessNames.has(normalizedRawName) && rawName !== groups.at(-1)?.sourceName) {
      currentName = normalizedRawName;
    } else if (!currentName) {
      currentName = normalizedRawName;
    }
    if (!currentName) continue;

    const current = groups.at(-1);
    if (!current || current.name !== currentName) {
      groups.push({ name: currentName, sourceName: rawName, rows: [row] });
    } else {
      current.rows.push(row);
    }
  }

  const header = part.querySelector(':scope > .proc-header');
  header?.remove();

  for (const group of groups) {
    const details = document.createElement('details');
    details.className = 'process-card';
    details.dataset.processName = group.name.toLocaleLowerCase('vi');
    details.id = slugify(group.name);
    details.append(processSummary(group.rows, group.name));

    const body = document.createElement('div');
    body.className = 'process-card-body';
    group.rows.forEach(row => body.append(row));
    details.append(body);
    part.append(details);
  }

  return groups;
}

function enhanceProcessSection() {
  const parts = Array.from(content.querySelectorAll('.process-part'));
  if (!parts.length) return;

  const labels = {
    overview: 'Overview',
    integration: 'Integration',
    scope: 'Scope',
    schedule: 'Schedule',
    cost: 'Cost',
    quality: 'Quality',
    resources: 'Resources',
    communications: 'Communications',
    risk: 'Risk',
    procurement: 'Procurement',
    stakeholder: 'Stakeholder'
  };

  const processNamesByPart = new Map();
  parts.forEach(part => {
    const id = part.dataset.processPart;
    processNamesByPart.set(id, id === 'overview' ? [] : groupProcessRows(part));
  });

  const nav = document.createElement('div');
  nav.className = 'process-nav';
  nav.innerHTML = `
    <div class="process-area-tabs" role="tablist" aria-label="Process knowledge areas">
      ${parts.map(part => {
        const id = part.dataset.processPart;
        return `<button class="process-area-tab" type="button" role="tab" data-process-area="${id}">${labels[id] || id}</button>`;
      }).join('')}
    </div>
    <div class="process-tools">
      <label class="process-filter-wrap">
        <span class="sr-only">Lọc process trong knowledge area</span>
        <input class="process-filter" type="search" placeholder="Lọc process..." autocomplete="off">
      </label>
      <select class="process-jump" aria-label="Đi đến process"></select>
      <button class="process-icon-button" type="button" data-process-action="expand" title="Mở tất cả" aria-label="Mở tất cả">＋</button>
      <button class="process-icon-button" type="button" data-process-action="collapse" title="Đóng tất cả" aria-label="Đóng tất cả">−</button>
    </div>
  `;
  content.prepend(nav);

  const areaTabs = Array.from(nav.querySelectorAll('[data-process-area]'));
  const filter = nav.querySelector('.process-filter');
  const jump = nav.querySelector('.process-jump');
  const tools = nav.querySelector('.process-tools');

  function visiblePart() {
    return parts.find(part => !part.hidden);
  }

  function updateProcessOptions(partId) {
    const groups = processNamesByPart.get(partId) || [];
    jump.innerHTML = groups.length
      ? `<option value="">Đi đến process...</option>${groups.map(group =>
          `<option value="${slugify(group.name)}">${escapeHtml(group.name)}</option>`
        ).join('')}`
      : '<option value="">Overview</option>';
    tools.classList.toggle('is-overview', groups.length === 0);
    filter.value = '';
  }

  function openArea(partId, processId = '', updateHash = true) {
    if (!processNamesByPart.has(partId)) partId = 'overview';
    parts.forEach(part => {
      const active = part.dataset.processPart === partId;
      part.hidden = !active;
    });
    areaTabs.forEach(tab => {
      const active = tab.dataset.processArea === partId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    updateProcessOptions(partId);

    if (processId) {
      const target = visiblePart()?.querySelector(`#${CSS.escape(processId)}`);
      if (target) {
        target.open = true;
        jump.value = processId;
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    }

    if (updateHash) {
      const nextHash = `#PROCCESSES/${partId}${processId ? `/${processId}` : ''}`;
      history.replaceState(null, '', nextHash);
    }
  }

  nav.addEventListener('click', event => {
    const area = event.target.closest('[data-process-area]');
    if (area) {
      openArea(area.dataset.processArea);
      return;
    }

    const action = event.target.closest('[data-process-action]')?.dataset.processAction;
    if (!action) return;
    visiblePart()?.querySelectorAll('.process-card').forEach(card => {
      card.open = action === 'expand';
    });
  });

  filter.addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase('vi');
    visiblePart()?.querySelectorAll('.process-card').forEach(card => {
      card.hidden = query.length > 0 && !card.dataset.processName.includes(query);
    });
  });

  jump.addEventListener('change', event => {
    const processId = event.target.value;
    if (!processId) return;
    const partId = visiblePart()?.dataset.processPart || 'overview';
    openArea(partId, processId);
  });

  parts.forEach(part => {
    part.addEventListener('toggle', event => {
      const card = event.target.closest('.process-card');
      if (!card?.open || part.hidden) return;
      history.replaceState(null, '', `#PROCCESSES/${part.dataset.processPart}/${card.id}`);
    }, true);
  });

  const [, requestedPart = 'overview', requestedProcess = ''] = hashPath();
  openArea(requestedPart, requestedProcess, false);
}

function clearSearch() {
  searchResults.classList.remove('on');
  searchResults.innerHTML = '';
  content.hidden = false;
}

function searchableRows(html) {
  const documentFragment = new DOMParser().parseFromString(html, 'text/html');
  const selectors = [
    '.drow',
    '.proc-row',
    '.formula-card',
    '.scenario-item',
    '.conflict-item',
    '.motiv-card',
    '.sec-banner'
  ].join(',');
  return Array.from(documentFragment.querySelectorAll(selectors))
    .filter(row => !row.closest('[hidden]'))
    .map(row => row.textContent.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

async function buildSearchIndex() {
  await Promise.all(sections.map(async section => {
    if (searchIndex.has(section.id)) return;
    const html = await fetchSection(section);
    searchIndex.set(section.id, searchableRows(html));
  }));
}

function highlightedExcerpt(text, query) {
  const matchIndex = text.toLocaleLowerCase('vi').indexOf(query.toLocaleLowerCase('vi'));
  const start = Math.max(0, matchIndex - 90);
  const end = Math.min(text.length, matchIndex + query.length + 180);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  const excerpt = `${prefix}${text.slice(start, end)}${suffix}`;
  const pattern = new RegExp(escapeRegExp(query), 'gi');
  return escapeHtml(excerpt).replace(pattern, match => `<mark>${match}</mark>`);
}

async function runSearch(rawQuery) {
  const query = rawQuery.trim();
  const requestId = ++searchRequest;

  if (query.length < 2) {
    clearSearch();
    return;
  }

  content.hidden = true;
  searchResults.classList.add('on');
  searchResults.innerHTML = '<div class="loading">Đang tìm trong toàn bộ cheat sheet...</div>';

  try {
    await buildSearchIndex();
    if (requestId !== searchRequest) return;

    const normalizedQuery = query.toLocaleLowerCase('vi');
    const hits = [];

    for (const section of sections) {
      for (const row of searchIndex.get(section.id) || []) {
        if (!row.toLocaleLowerCase('vi').includes(normalizedQuery)) continue;
        hits.push({ section, row });
        if (hits.length >= 100) break;
      }
      if (hits.length >= 100) break;
    }

    searchResults.innerHTML = hits.length
      ? hits.map(({ section, row }) => `
          <button class="sr-item" type="button" data-result-section="${section.id}">
            <span class="sr-sheet">${section.label}</span>
            <span>${highlightedExcerpt(row, query)}</span>
          </button>
        `).join('')
      : `<div class="empty-search">Không tìm thấy “${escapeHtml(query)}”</div>`;
  } catch (error) {
    searchResults.innerHTML = `<div class="load-error">Không thể lập chỉ mục tìm kiếm: ${escapeHtml(error.message)}</div>`;
  }
}

searchResults.addEventListener('click', event => {
  const result = event.target.closest('[data-result-section]');
  if (!result) return;
  searchInput.value = '';
  openSection(result.dataset.resultSection);
});

searchInput.addEventListener('input', event => runSearch(event.target.value));
window.addEventListener('hashchange', () => openSection(sectionIdFromHash(), { updateHash: false }));
window.addEventListener('scroll', () => scrollTopButton.classList.toggle('on', scrollY > 300));
scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

renderTabs();
openSection(sectionIdFromHash(), { updateHash: false, scroll: false });
