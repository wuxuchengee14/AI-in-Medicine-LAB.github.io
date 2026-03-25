const API_BASE = ''

/**
 * AIMLab - Main Website Logic (Optimized)
 * - Mobile nav toggle
 * - Data-driven rendering: news / people / publications / projects / research
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 0) Mobile nav toggle (works on every page)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // 1) Elements
  const ui = {
    news: document.getElementById('news-container'),
    pi: document.getElementById('people-pi'),
    members: document.getElementById('people-members'),
    alumni: document.getElementById('alumni-list'),
    pubs: document.getElementById('pubs-container'),
    projects: document.getElementById('projects-container'),
    researchPrograms: document.getElementById('research-programs'),
    researchAreas: document.getElementById('research-areas')
  };

  // 2) Init
  try {
    if (ui.news) initSection('news', data => renderNews(data, ui.news));
    if (ui.pi || ui.members || ui.alumni) initSection('people', data => renderPeople(data, ui));
    if (ui.pubs) initSection('publications', data => renderPublications(data, ui.pubs));
    if (ui.projects) initSection('projects', data => renderProjects(data, ui.projects));
    if (ui.researchPrograms || ui.researchAreas) {
      initSection('research', data => renderResearch(data, ui));
    }
  } catch (error) {
    console.error("AIMLab Site Initialization Failed:", error);
  }
});

async function initSection(type, renderFn) {
  try {
    const response = await fetch(`${API_BASE}assets/data/${type}.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    renderFn(data);
  } catch (e) {
    console.error(`[Data Load Error] ${type}:`, e);
    showSectionError(type);
  }
}

function showSectionError(type) {
  const containerMap = {
    news: 'news-container',
    people: 'people-pi',
    publications: 'pubs-container',
    projects: 'projects-container',
    research: 'research-programs'
  };
  const el = document.getElementById(containerMap[type]);
  if (el) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:#dc2626;font-weight:700;">資料載入失敗</div>';
  }
}

/* ---------------- News ---------------- */
function renderNews(data, container) {
  container.innerHTML = (data || []).slice(0, 5).map(item => `
    <div class="news-item">
      <span class="news-date">${escapeHtml(item.date || '')}</span>
      <span class="news-text">${escapeHtml(item.text || '')}</span>
    </div>
  `).join('');
}

/* ---------------- People ---------------- */
function renderPeople(data, ui) {
  // 1) PI centered card
  if (ui.pi && data && data.pi) {
    const pi = data.pi;

    const emailForMailto = (pi.email || '').replace('[at]', '@').replace(' ', '');
    const links = pi.links || {};

    const expertiseList = Array.isArray(pi.expertise)
      ? pi.expertise.map(x => `<li>${escapeHtml(x)}</li>`).join('')
      : '';

    ui.pi.innerHTML = `
      <div class="pi-profile-centered">
        <img src="${escapeAttr(pi.photo || 'assets/img/avatar.svg')}" alt="${escapeAttr(pi.name || 'PI')}">
        
        <div class="pi-name">${escapeHtml(pi.name || '')} <span style="color:var(--text-500); font-weight:800; font-size:0.92em;">${escapeHtml(pi.name_zh || '')}</span></div>
        <div class="pi-title">${escapeHtml(pi.title || '')}</div>
        <div class="pi-affil">
          ${escapeHtml(pi.group || '')}<br>
          ${escapeHtml(pi.affiliation || '')}
        </div>

        <div class="pi-contact">
          ${pi.office ? `<div class="contact-chip"><span class="k">Office</span> ${escapeHtml(pi.office)}</div>` : ''}
          ${pi.phone ? `<div class="contact-chip"><span class="k">Phone</span> ${escapeHtml(pi.phone)}</div>` : ''}
          ${pi.email ? `<div class="contact-chip"><span class="k">Email</span> <a href="mailto:${escapeAttr(emailForMailto)}" style="color:var(--blue-700); text-decoration:none;">${escapeHtml(pi.email)}</a></div>` : ''}
        </div>

        <div class="pi-links">
          ${links.nycu_scholar ? `<a class="pill" href="${escapeAttr(links.nycu_scholar)}" target="_blank" rel="noopener">NYCU Scholar</a>` : ''}
          ${links.ibe_profile ? `<a class="pill" href="${escapeAttr(links.ibe_profile)}" target="_blank" rel="noopener">IBE Profile</a>` : ''}
          ${links.department_profile ? `<a class="pill" href="${escapeAttr(links.department_profile)}" target="_blank" rel="noopener">Department</a>` : ''}
        </div>

        ${expertiseList ? `
          <div class="pi-expertise">
            <h4>Research Expertise</h4>
            <ul>${expertiseList}</ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 2) Members grid (auto-expand)
  if (ui.members && data && Array.isArray(data.members)) {
    ui.members.innerHTML = data.members.map(m => `
      <div class="member-card">
        <img src="${escapeAttr(m.photo || 'assets/img/avatar.svg')}" alt="${escapeAttr(m.name || 'Member')}">
        <span class="person-name">${escapeHtml(m.name || '')}</span>
        <div class="person-role">${escapeHtml(m.role || '')}</div>
      </div>
    `).join('');
  }

  // 3) Alumni table (auto-expand)
  if (ui.alumni && data && Array.isArray(data.alumni)) {
    const sorted = [...data.alumni].sort((a, b) => (b.year || 0) - (a.year || 0));
    ui.alumni.innerHTML = sorted.map(al => `
      <tr>
        <td class="alumni-year">${escapeHtml(String(al.year || '—'))}</td>
        <td class="alumni-name">${escapeHtml(al.name || '—')}</td>
        <td>${escapeHtml(al.degree || '—')}</td>
        <td>${escapeHtml(al.current || '—')}</td>
      </tr>
    `).join('');
  }
}

/* ---------------- Publications ---------------- */
function renderPublications(data, container) {
  const isFeaturedOnly = container.dataset.featured === "true";
  const arr = Array.isArray(data) ? data : [];
  const filtered = isFeaturedOnly ? arr.filter(p => p.featured) : arr;

  container.innerHTML = `
    <div class="pub-list">
      ${filtered.map(pub => `
        <div class="pub-item">
          <span class="pub-title">${escapeHtml(pub.title || '')}</span>
          <div class="pub-authors">${escapeHtml(pub.authors || '')}</div>
          <div class="pub-venue">${escapeHtml(pub.venue || '')}</div>

          ${pub.links ? `
            <div class="pub-links">
              ${pub.links.pdf ? `<a class="pill" href="${escapeAttr(pub.links.pdf)}" target="_blank" rel="noopener">PDF</a>` : ''}
              ${pub.links.code ? `<a class="pill" href="${escapeAttr(pub.links.code)}" target="_blank" rel="noopener">Code</a>` : ''}
              ${pub.links.project ? `<a class="pill" href="${escapeAttr(pub.links.project)}" target="_blank" rel="noopener">Project</a>` : ''}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------------- Projects ---------------- */
function renderProjects(data, container) {
  const arr = Array.isArray(data) ? data : [];
  container.innerHTML = arr.map(proj => `
    <div class="card">
      <img src="${escapeAttr(proj.img || 'assets/img/placeholder_project.svg')}" alt="${escapeAttr(proj.title || 'Project')}" loading="lazy">
      <div class="card-content">
        <h3>${escapeHtml(proj.title || '')}</h3>
        <p>${escapeHtml(proj.description || '')}</p>
      </div>
    </div>
  `).join('');
}

/* ---------------- Research (Programs + Areas) ---------------- */
function renderResearch(data, ui) {
  const programs = (data && Array.isArray(data.programs)) ? data.programs : [];
  const areas = (data && Array.isArray(data.areas)) ? data.areas : [];

  if (ui.researchPrograms) {
    ui.researchPrograms.innerHTML = programs.map(p => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const focus = Array.isArray(p.focus) ? p.focus : [];
      const links = p.links || {};

      return `
        <div class="card">
          <div class="card-content">
            <h3>${escapeHtml(p.title || '')}</h3>
            <p>${escapeHtml(p.summary || '')}</p>

            ${focus.length ? `
              <ul style="margin:12px 0 0; padding-left:18px; color:var(--text-700);">
                ${focus.map(x => `<li>${escapeHtml(x)}</li>`).join('')}
              </ul>
            ` : ''}

            ${tags.length ? `
              <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                ${tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}

            ${(links.projects || links.publications || links.website) ? `
              <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
                ${links.projects ? `<a class="pill" href="${escapeAttr(links.projects)}" style="text-transform:none;">Projects →</a>` : ''}
                ${links.publications ? `<a class="pill" href="${escapeAttr(links.publications)}" style="text-transform:none;">Publications →</a>` : ''}
                ${links.website ? `<a class="pill" href="${escapeAttr(links.website)}" target="_blank" rel="noopener" style="text-transform:none;">Learn More →</a>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  if (ui.researchAreas) {
    ui.researchAreas.innerHTML = areas.map(a => {
      const tags = Array.isArray(a.tags) ? a.tags : [];
      const links = a.links || {};

      return `
        <div class="card">
          <div class="card-content">
            <h3>${escapeHtml(a.title || '')}</h3>
            <p>${escapeHtml(a.summary || '')}</p>

            ${tags.length ? `
              <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                ${tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}

            ${(links.projects || links.publications || links.website) ? `
              <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
                ${links.projects ? `<a class="pill" href="${escapeAttr(links.projects)}" style="text-transform:none;">Projects →</a>` : ''}
                ${links.publications ? `<a class="pill" href="${escapeAttr(links.publications)}" style="text-transform:none;">Publications →</a>` : ''}
                ${links.website ? `<a class="pill" href="${escapeAttr(links.website)}" target="_blank" rel="noopener" style="text-transform:none;">Learn More →</a>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

/* ---------------- Helpers ---------------- */
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
function escapeAttr(str){ return escapeHtml(str); }