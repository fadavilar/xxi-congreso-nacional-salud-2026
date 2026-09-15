/* ============================================================
   App — theming, accordion, rendering
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "cns_theme";
  function applyTheme(mode){
    if(mode === "light" || mode === "dark"){
      document.documentElement.setAttribute("data-theme", mode);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function currentEffectiveTheme(){
    const attr = document.documentElement.getAttribute("data-theme");
    if(attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function initTheme(){
    let saved = null;
    try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
    applyTheme(saved);
  }
  function toggleTheme(){
    const eff = currentEffectiveTheme();
    const next = eff === "dark" ? "light" : "dark";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
  }
  initTheme();

  /* ---------------- Utility ---------------- */
  function el(tag, attrs, children){
    const node = document.createElement(tag);
    if(attrs){
      Object.keys(attrs).forEach(k=>{
        if(k === "class") node.setAttribute("class", attrs[k]);
        else if(k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children||[]).forEach(c=>{ if(c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  function escapeXML(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  function sessionById(n){
    return DATA.agenda.find(a=>a.n===n);
  }
  // Small numbered chips linking a fact to its agenda session(s), with the
  // speaker name shown as a native tooltip (title attribute).
  function sessionRefs(nums){
    const span = el("span", {class:"refs"});
    (nums||[]).forEach((n,i)=>{
      const s = sessionById(n);
      const chip = el("span", {class:"study-ref", title: s ? `Sesión ${n}: ${s.speaker}` : `Sesión ${n}`}, [String(n)]);
      span.appendChild(chip);
      if(i < nums.length-1) span.appendChild(document.createTextNode(" "));
    });
    return span;
  }

  /* ============================================================
     ACCORDION
     ============================================================ */
  const SECTIONS = [
    { id:"resumen", num:"01", title:"Resumen ejecutivo", sub:"El congreso en 60 segundos", open:true },
    { id:"ejes", num:"02", title:"Ejes temáticos del congreso", sub:"Financiamiento, tarifas, regulación, epidemiología, prestadores e IA", open:false },
    { id:"cifras", num:"03", title:"Cifras clave", sub:"Los números que más se citaron en el escenario", open:false },
    { id:"agenda", num:"04", title:"Agenda completa", sub:"22 sesiones, dos jornadas, con ponente y cargo", open:false },
    { id:"lectura", num:"05", title:"Mi lectura", sub:"Síntesis y reflexión propia del autor", open:false },
    { id:"metodologia", num:"06", title:"Metodología y fuentes", sub:"Cómo se elaboró esta síntesis, y sus límites", open:false },
  ];

  function buildAccordionShell(){
    const wrap = document.getElementById("accordion");
    SECTIONS.forEach(s=>{
      const item = el("div", {class:"acc-item"+(s.open?" open":""), id:"sec-"+s.id});
      const header = el("button", {class:"acc-header","aria-expanded": s.open?"true":"false"}, [
        el("span",{class:"num"},[s.num]),
        el("span",{class:"titles"},[ el("h3",{},[s.title]), el("span",{class:"sub"},[s.sub]) ]),
        el("svg",{class:"chev",viewBox:"0 0 24 24",fill:"none",html:'<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
      ]);
      const panel = el("div",{class:"acc-panel"});
      const inner = el("div",{},[ el("div",{class:"acc-body", id:"body-"+s.id}) ]);
      panel.appendChild(inner);
      header.addEventListener("click", ()=> toggleSection(item, header));
      item.appendChild(header);
      item.appendChild(panel);
      wrap.appendChild(item);
    });
  }
  function toggleSection(item, header, forceOpen){
    const willOpen = typeof forceOpen === "boolean" ? forceOpen : !item.classList.contains("open");
    item.classList.toggle("open", willOpen);
    header.setAttribute("aria-expanded", willOpen ? "true":"false");
  }
  function setAllSections(open){
    document.querySelectorAll(".acc-item").forEach(item=>{
      const header = item.querySelector(".acc-header");
      toggleSection(item, header, open);
    });
  }

  /* ============================================================
     RENDER: Header / Hero
     ============================================================ */
  function renderHero(){
    document.getElementById("brand-title").textContent = DATA.meta.title;
    document.getElementById("hero-title").textContent = DATA.meta.title;
    document.getElementById("hero-lede").textContent = DATA.meta.subtitle;
    document.getElementById("hero-framework").textContent = DATA.meta.framework;
    document.getElementById("hero-period").textContent = DATA.meta.period;
    document.getElementById("byline").innerHTML =
      `<strong>${DATA.meta.author}</strong>${DATA.meta.credentials ? ", "+DATA.meta.credentials : ""} · ${DATA.meta.affiliation}`;

    const grid = document.getElementById("stat-grid");
    DATA.stats.forEach(s=>{
      grid.appendChild(el("div",{class:"stat-card"},[
        el("div",{class:"value"},[s.value]),
        el("div",{class:"label"},[s.label]),
        el("div",{class:"detail"},[s.detail]),
      ]));
    });

    document.getElementById("footer-disclaimer").textContent = DATA.meta.disclaimer;
    document.getElementById("footer-author").textContent =
      DATA.meta.author + (DATA.meta.credentials ? ", "+DATA.meta.credentials : "") + " · " + DATA.meta.affiliation;
    document.getElementById("year").textContent = new Date().getFullYear();

    if(DATA.meta.license){
      const lic = DATA.meta.license;
      const badge = document.getElementById("cc-badge");
      badge.href = lic.url;
      badge.title = lic.name;
      badge.innerHTML = `
        <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="11.2" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="20.8" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <path d="M13 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
          <path d="M22.6 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
        </svg>
        <span>${lic.name}</span>`;
      document.getElementById("footer-license-text").textContent = lic.text;
    }
  }

  /* ============================================================
     RENDER: 01 Resumen
     ============================================================ */
  function renderResumen(){
    const body = document.getElementById("body-resumen");
    body.appendChild(el("p",{},[DATA.intro]));
    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Lo que atraviesa todo el congreso"]),
      el("h3",{},[DATA.selectiveCategory.title]),
      el("p",{},[DATA.selectiveCategory.text]),
    ]));
    body.appendChild(el("p",{style:"margin-top:14px;font-size:.85rem;color:var(--text-muted)"},[
      "Explora las secciones siguientes: primero los ejes temáticos (qué se dijo y quién lo dijo), luego las cifras clave (los números que más se citaron), la agenda completa (las 22 sesiones), la lectura propia del autor, y finalmente la metodología y fuentes de esta síntesis."
    ]));
  }

  /* ============================================================
     RENDER: 02 Ejes temáticos
     ============================================================ */
  function renderEjes(){
    const body = document.getElementById("body-ejes");
    body.appendChild(el("p",{},[
      "Clasificación editorial propia del autor de los puntos más relevantes del congreso, organizada por los grandes temas que atravesaron la agenda. Cada hallazgo enlaza a la sesión de la agenda que lo respalda — pasa el cursor sobre el número para ver el ponente."
    ]));
    DATA.categories.forEach(cat=>{
      const block = el("div",{class:"category-block "+cat.color});
      block.appendChild(el("h4",{},[
        el("span",{class:"chip "+cat.color, style:"margin-right:8px"},["Eje "+cat.id]),
        cat.title
      ]));
      const list = el("ul",{class:"code-list"});
      cat.codes.forEach(code=>{
        list.appendChild(el("li",{},[
          el("span",{},[code.text]),
          sessionRefs(code.studies),
        ]));
      });
      block.appendChild(list);
      body.appendChild(block);
    });
  }

  /* ============================================================
     RENDER: 03 Cifras clave
     ============================================================ */
  function renderSources(ind){
    const wrap = el("div",{class:"indicator-source"});
    const list = ind.sources && ind.sources.length ? ind.sources : [{ label: ind.source, url: ind.sourceUrl }];
    list.forEach((s, i)=>{
      const line = el("div",{class:"source-line"});
      line.appendChild(el("span",{class:"source-tag"},["Fuente"+(list.length>1?" "+(i+1):"")+": "]));
      if(s.url){
        line.appendChild(el("a",{href:s.url, target:"_blank", rel:"noopener"},[s.label]));
      } else {
        line.appendChild(el("span",{},[s.label]));
        line.appendChild(el("span",{class:"chip-muted chip", style:"margin-left:6px"},["sin URL pública"]));
      }
      wrap.appendChild(line);
    });
    return wrap;
  }
  function toCSV(columns, rows){
    const esc = v => `"${String(v).replace(/"/g,'""')}"`;
    return [columns.map(esc).join(","), ...rows.map(r=>r.map(esc).join(","))].join("\r\n");
  }
  function makeDownloadLink(filename, columns, rows){
    const csv = toCSV(columns, rows);
    const blob = new Blob(["﻿"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    return el("a",{href:url, download:filename, class:"csv-download"},[
      el("svg",{viewBox:"0 0 24 24",fill:"none",width:"14",height:"14",html:'<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'}),
      "Descargar CSV",
    ]);
  }
  function renderCifras(){
    const body = document.getElementById("body-cifras");
    body.appendChild(el("p",{},[
      "Todas estas cifras fueron declaradas por el ponente citado durante su sesión (agenda oficial + transcripción propia) o provienen de las fuentes públicas indicadas — no son series de tiempo, sino los puntos de dato que se presentaron en el congreso."
    ]));

    DATA.comparisonIndicators.forEach(ind=>{
      const block = el("div",{class:"indicator-block"});
      block.appendChild(el("div",{class:"indicator-head"},[
        el("h4",{},[ind.title]),
        ind.unit ? el("span",{class:"unit"},[ind.unit]) : null,
      ]));
      block.appendChild(el("div",{class:"indicator-linklet"},[ind.loopLink]));
      block.appendChild(el("div",{class:"comparison-row"},[
        el("div",{class:"comparison-point"},[
          el("div",{class:"cp-label"},[ind.before.label]),
          el("div",{class:"cp-value"},[ind.before.value]),
        ]),
        el("svg",{class:"comparison-arrow",viewBox:"0 0 24 24",fill:"none",html:'<path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
        el("div",{class:"comparison-point after"},[
          el("div",{class:"cp-label"},[ind.after.label]),
          el("div",{class:"cp-value"},[ind.after.value]),
        ]),
      ]));
      block.appendChild(el("div",{class:"callout"},[ind.deltaNote]));
      block.appendChild(renderSources(ind));
      body.appendChild(block);
    });

    DATA.keyFigureGroups.forEach(group=>{
      body.appendChild(el("h4",{style:"font-size:.86rem;margin:22px 0 10px"},[group.title]));
      const grid = el("div",{class:"stat-grid", style:"margin-top:0"});
      group.figures.forEach(f=>{
        grid.appendChild(el("div",{class:"stat-card", title: "Sesión "+f.session+" — "+(sessionById(f.session)?sessionById(f.session).speaker:"")},[
          el("div",{class:"value"},[f.value]),
          el("div",{class:"label"},[f.label]),
          el("div",{class:"detail"},[f.detail]),
        ]));
      });
      body.appendChild(grid);
    });

    const allFigures = [];
    DATA.keyFigureGroups.forEach(g=> g.figures.forEach(f=> allFigures.push([g.title, f.value, f.label, f.detail])));
    body.appendChild(el("div",{class:"data-table-actions", style:"margin-top:16px"},[
      makeDownloadLink("cifras_clave.csv", ["Eje","Valor","Indicador","Detalle / fuente"], allFigures)
    ]));
  }

  /* ============================================================
     RENDER: 04 Agenda
     ============================================================ */
  function renderAgenda(){
    const body = document.getElementById("body-agenda");
    body.appendChild(el("p",{},["Filtra por jornada. Las 22 sesiones del XXI Congreso Nacional de Salud, con horario, ponente y cargo."]));

    const days = ["Todas", ...Array.from(new Set(DATA.agenda.map(a=>a.day)))];
    const filterRow = el("div",{class:"filter-row"});
    days.forEach((day,i)=>{
      const chip = el("button",{class:"filter-chip"+(i===0?" active":""), "data-day":day},[day]);
      chip.addEventListener("click", ()=>{
        filterRow.querySelectorAll(".filter-chip").forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
        renderAgendaRows(day);
      });
      filterRow.appendChild(chip);
    });
    const actions = el("div",{class:"data-table-actions", style:"flex:1"});
    actions.appendChild(makeDownloadLink("agenda_congreso.csv",
      ["#","Día","Hora","Sesión","Ponente","Cargo"],
      DATA.agenda.map(a=>[String(a.n), a.day, a.time, a.title, a.speaker, a.role])
    ));
    body.appendChild(el("div",{style:"display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px"},[filterRow, actions]));

    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"studies", id:"agenda-table"},[
      el("thead",{},[ el("tr",{},[
        el("th",{},["#"]), el("th",{},["Día"]), el("th",{},["Hora"]),
        el("th",{},["Sesión"]), el("th",{},["Ponente"]), el("th",{},["Cargo"]),
      ])]),
      el("tbody",{id:"agenda-tbody"}),
    ]);
    tableWrap.appendChild(table);
    body.appendChild(tableWrap);
    renderAgendaRows("Todas");
  }
  function renderAgendaRows(filterDay){
    const tbody = document.getElementById("agenda-tbody");
    tbody.innerHTML = "";
    DATA.agenda.filter(a=> filterDay==="Todas" || a.day===filterDay).forEach(a=>{
      tbody.appendChild(el("tr",{},[
        el("td",{},[el("span",{class:"study-ref"},[String(a.n)])]),
        el("td",{},[el("span",{class:"db-badge"},[a.day.replace(" de septiembre","")])]),
        el("td",{style:"white-space:nowrap"},[a.time]),
        el("td",{style:"min-width:240px"},[a.title]),
        el("td",{style:"white-space:nowrap"},[a.speaker]),
        el("td",{style:"min-width:180px"},[a.role]),
      ]));
    });
  }

  /* ============================================================
     RENDER: 05 Mi lectura
     ============================================================ */
  function renderLectura(){
    const body = document.getElementById("body-lectura");
    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Síntesis y opinión personal del autor"]),
      el("p",{},[DATA.reading.text]),
    ]));
    body.appendChild(el("p",{style:"margin-top:14px;font-style:italic;color:var(--text-muted)"},[DATA.reading.prompt]));
  }

  /* ============================================================
     RENDER: 06 Metodología y fuentes
     ============================================================ */
  function renderMetodologia(){
    const body = document.getElementById("body-metodologia");
    const m = DATA.methodology;
    body.appendChild(el("p",{},[m.note]));

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["Fuentes consultadas"]));
    const src = renderSources({ sources: m.sources });
    body.appendChild(src);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["Limitaciones declaradas"]));
    const limitList = el("ul",{class:"limit-list"});
    m.limitations.forEach(l=> limitList.appendChild(el("li",{},[l])));
    body.appendChild(limitList);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot(){
    renderHero();
    buildAccordionShell();
    renderResumen();
    renderEjes();
    renderCifras();
    renderAgenda();
    renderLectura();
    renderMetodologia();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAllSections(true));
    document.getElementById("collapse-all").addEventListener("click", ()=> setAllSections(false));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
