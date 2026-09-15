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
  // Quoted-phrase citation chips linking a fact to its agenda session(s) —
  // the phrase alludes to the session's actual content (see agenda[].tag),
  // with the session number and speaker shown as a native tooltip.
  function sessionRefs(nums){
    const span = el("span", {class:"refs"});
    (nums||[]).forEach((n,i)=>{
      const s = sessionById(n);
      const label = s ? `"${s.tag}"` : `"sesión ${n}"`;
      const chip = el("span", {class:"cite-tag", title: s ? `Sesión ${n} · ${s.speaker}` : `Sesión ${n}`}, [label]);
      span.appendChild(chip);
      if(i < nums.length-1) span.appendChild(document.createTextNode(" "));
    });
    return span;
  }
  function levelClass(level){
    const l = (level||"").toLowerCase();
    if(l.indexOf("alta")>=0 || l.indexOf("alto")>=0) return "level-alta";
    if(l.indexOf("media-alta")>=0) return "level-media-alta";
    if(l.indexOf("media")>=0) return "level-media";
    if(l.indexOf("baja")>=0) return "level-baja";
    return "level-por";
  }
  /* ---------------- Confidence tags (trazabilidad de datos) ----------------
     4 estados: verificado (URL pública real) · escenario (declarado por el
     ponente, sin URL) · nota-autor (síntesis/interpretación propia) ·
     pendiente (dato a verificar más adelante). */
  const CONFIDENCE_LABEL = {
    verificado: "Verificado en fuente pública",
    escenario: "Declarado en escenario",
    "nota-autor": "Nota del autor",
    pendiente: "Pendiente de verificación",
  };
  function confidenceTag(level){
    if(!level) return null;
    const label = CONFIDENCE_LABEL[level] || level;
    return el("span",{class:"confidence-tag confidence-"+level, title:"Confiabilidad del dato: "+label},[label]);
  }
  /* ---------------- Speaker avatars ----------------
     Real photo (from DATA.speakerPhotos, official-source only) when
     available, otherwise a generated initials circle — never a scraped
     photo of a private individual (see README for the sourcing rule). */
  function initialsOf(name){
    const clean = name.replace(/^(Dr\.|Dra\.|Ing\.|Arq\.)\s*/i, "");
    const parts = clean.split(/\s+/).filter(Boolean);
    if(parts.length === 0) return "?";
    if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const AVATAR_PALETTE = ["chip-a","chip-b","chip-c","chip-d","chip-e"];
  function avatarColorClass(name){
    let hash = 0;
    for(let i=0;i<name.length;i++) hash = (hash*31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  }
  function avatarEl(name, size){
    size = size || 34;
    const photo = DATA.speakerPhotos && DATA.speakerPhotos[name];
    if(photo && photo.src){
      const img = el("img",{class:"avatar avatar-photo", src:photo.src, alt:name, title:photo.sourceLabel?("Foto: "+photo.sourceLabel):name, loading:"lazy"});
      img.style.width = size+"px"; img.style.height = size+"px";
      return img;
    }
    const div = el("div",{class:"avatar avatar-initials "+avatarColorClass(name), title:name},[initialsOf(name)]);
    div.style.width = size+"px"; div.style.height = size+"px"; div.style.fontSize = Math.round(size*0.38)+"px";
    return div;
  }

  /* ============================================================
     ACCORDION
     ============================================================ */
  // Estructura tipo artículo científico (resumen → introducción → materiales
  // y métodos → resultados → discusión y recomendaciones → conclusión), no
  // la agenda del congreso — para que quien no asistió tenga una lectura
  // ordenada, y quien sí asistió encuentre valor adicional (diagnóstico
  // causal, tablero de recomendaciones, nota técnica con herramientas).
  const SECTIONS = [
    { id:"resumen", num:"01", title:"Resumen", sub:"El congreso en un párrafo", open:true },
    { id:"introduccion", num:"02", title:"Introducción", sub:"Por qué este congreso, y cómo leer este documento", open:false },
    { id:"metodos", num:"03", title:"Materiales y métodos", sub:"Las 22 sesiones y cómo se construyó esta síntesis", open:false,
      subs: [{ id:"metodos-agenda", label:"Agenda completa (22 sesiones)" }] },
    { id:"resultados", num:"04", title:"Resultados", sub:"Diagnóstico causal, ejes temáticos y cifras clave", open:false,
      subs: [
        { id:"resultados-diagnostico", label:"Diagnóstico causal" },
        ...DATA.categories.map(c=>({ id:"eje-"+c.id, label:"Eje "+c.id+" — "+c.title })),
        { id:"resultados-cifras", label:"Cifras clave" },
        ...DATA.keyFigureGroups.map((g,i)=>({ id:"cifras-grupo-"+i, label:g.title })),
      ] },
    { id:"discusion", num:"05", title:"Discusión y recomendaciones", sub:"Implicaciones, lagunas y una nota técnica práctica", open:false,
      subs: [
        { id:"discusion-recomendaciones", label:"Recomendaciones" },
        { id:"discusion-lagunas", label:"Lagunas de evidencia" },
        { id:"discusion-nota-tecnica", label:"Nota técnica: de la intervención a la implementación" },
        { id:"nota-tecnica-herramienta", label:"Herramienta práctica: mapa mental + plantilla" },
      ] },
    { id:"conclusion", num:"06", title:"Conclusión", sub:"Mi lectura — síntesis y reflexión propia del autor", open:false },
  ];

  function buildAccordionShell(){
    const wrap = document.getElementById("accordion");
    SECTIONS.forEach(s=>{
      const item = el("div", {class:"acc-item"+(s.open?" open":""), id:"sec-"+s.id});
      const header = el("button", {class:"acc-header", id:"hdr-"+s.id, "aria-expanded": s.open?"true":"false", "aria-controls":"body-"+s.id}, [
        el("span",{class:"num"},[s.num]),
        el("span",{class:"titles"},[ el("h3",{},[s.title]), el("span",{class:"sub"},[s.sub]) ]),
        el("svg",{class:"chev",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",html:'<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
      ]);
      const panel = el("div",{class:"acc-panel"});
      const inner = el("div",{},[ el("div",{class:"acc-body", id:"body-"+s.id, role:"region", "aria-labelledby":"hdr-"+s.id}) ]);
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
  function openSection(sectionId){
    const item = document.getElementById("sec-"+sectionId);
    if(!item) return;
    const header = item.querySelector(".acc-header");
    toggleSection(item, header, true);
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

  // Small helper for a subsection break inside a merged accordion body
  // (e.g. "Diagnóstico causal" inside "04 Resultados").
  function sectionDivider(body, id, title, subtitle){
    const h = el("h3",{id:id, class:"subsection-title"},[title]);
    body.appendChild(h);
    if(subtitle) body.appendChild(el("p",{class:"subsection-subtitle"},[subtitle]));
    return h;
  }

  /* ============================================================
     RENDER: 01 Resumen
     ============================================================ */
  function renderResumen(){
    const body = document.getElementById("body-resumen");
    body.appendChild(el("p",{},[DATA.intro]));
  }

  /* ============================================================
     RENDER: 02 Introducción
     ============================================================ */
  function renderIntroduccion(){
    const body = document.getElementById("body-introduccion");
    if(DATA.introduction) body.appendChild(el("p",{},[DATA.introduction]));
    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Lo que atraviesa todo el congreso"]),
      el("h3",{},[DATA.selectiveCategory.title]),
      el("p",{},[DATA.selectiveCategory.text]),
    ]));
    if(DATA.meta.relatedWork){
      const rw = DATA.meta.relatedWork;
      body.appendChild(el("div",{class:"related-work-box"},[
        el("h4",{},["Análisis relacionado del autor"]),
        el("a",{href:rw.url, target:"_blank", rel:"noopener noreferrer", style:"font-weight:700"},[rw.title]),
        el("p",{style:"margin-top:4px"},[rw.text]),
      ]));
    }
  }

  /* ============================================================
     RENDER: 04 Resultados — Diagnóstico causal (SVG diagram)
     ============================================================ */
  function renderDiagnostico(){
    const body = document.getElementById("body-resultados");
    sectionDivider(body, "resultados-diagnostico", "Diagnóstico causal",
      "Modelo de dinámica de sistemas — retoma y profundiza la revisión de gobernanza del autor.");
    body.appendChild(el("p",{},[
      "Diagrama de bucles causales construido a partir de las cifras declaradas en el congreso. Toca o pasa el cursor sobre un nodo para ver las sesiones que lo respaldan, o sobre las etiquetas R1 / B1 para leer la explicación completa de cada bucle."
    ]));

    const wrap = el("div",{class:"diagram-wrap"});
    wrap.appendChild(buildCausalSVG());
    const tooltipEl = el("div",{class:"diagram-tooltip",hidden:"hidden"});
    tooltipEl.addEventListener("mouseenter", cancelHideTooltip);
    tooltipEl.addEventListener("mouseleave", scheduleHideTooltip);
    wrap.appendChild(tooltipEl);
    body.appendChild(wrap);
    addAccessibleListToggle(body, wrap, buildCausalAccessibleList());

    body.appendChild(el("div",{class:"loop-legend"},[
      el("span",{class:"swatch"},[el("span",{class:"sw sw-r"}), "R1 · bucle de refuerzo (crisis de caja)"]),
      el("span",{class:"swatch"},[el("span",{class:"sw sw-b"}), "B1 · bucle de balance, con demora (trazabilidad y auditoría)"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--danger);font-weight:800"},["−"]), " las variables cambian en sentido opuesto"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--success);font-weight:800"},["+"]), " las variables cambian en el mismo sentido"]),
    ]));

    body.appendChild(el("p",{class:"diagram-hint"},["Consejo: los nodos y las etiquetas R1/B1 son interactivos — pasa el cursor o tócalos para ver el detalle sin perder de vista el resto del diagrama."]));
    body.appendChild(el("p",{class:"indicator-source", style:"margin-top:8px"},[DATA.causalLoop.citation]));
  }

  function buildCausalSVG(){
    const svgNS = "http://www.w3.org/2000/svg";
    const W = 780, H = 640;
    const cx = W/2, cy = 400, R = 175;
    const nodes = DATA.causalLoop.nodes;
    const n = nodes.length;
    const pos = {};
    nodes.forEach((node,i)=>{
      const angle = -Math.PI/2 + (i * (2*Math.PI/n));
      pos[node.id] = { x: cx + R*Math.cos(angle), y: cy + R*Math.sin(angle) };
    });

    const svg = document.createElementNS(svgNS,"svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width","100%");
    svg.setAttribute("role","img");
    svg.setAttribute("aria-label","Diagrama de bucles causales de la crisis de caja del sistema de salud");

    const defs = document.createElementNS(svgNS,"defs");
    defs.innerHTML = `
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"></path>
      </marker>`;
    svg.appendChild(defs);

    const r1Loop = DATA.causalLoop.loops.find(l=>l.id==="R1");
    const r1Group = document.createElementNS(svgNS,"g");
    r1Group.setAttribute("class","loop-tag-group r");
    r1Group.innerHTML = `
      <rect x="${cx-70}" y="${cy-26}" width="140" height="46" rx="10"></rect>
      <text x="${cx}" y="${cy-6}" text-anchor="middle" class="loop-tag r">R1</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="10" style="fill:var(--text-muted)">crisis de caja</text>`;
    if(r1Loop) attachLoopTooltip(r1Group, r1Loop);
    svg.appendChild(r1Group);

    DATA.causalLoop.edges.forEach(edge=>{
      const a = pos[edge.from], b = pos[edge.to];
      const mx = (a.x+b.x)/2, my=(a.y+b.y)/2;
      const dx = mx-cx, dy = my-cy;
      const dist = Math.sqrt(dx*dx+dy*dy) || 1;
      const bow = 18;
      const cxp = mx - (dx/dist)*bow, cyp = my - (dy/dist)*bow;

      const path = document.createElementNS(svgNS,"path");
      path.setAttribute("d", `M ${a.x} ${a.y} Q ${cxp} ${cyp} ${b.x} ${b.y}`);
      path.setAttribute("class","edge-path");
      svg.appendChild(path);

      const label = document.createElementNS(svgNS,"text");
      label.setAttribute("x", cxp); label.setAttribute("y", cyp);
      label.setAttribute("text-anchor","middle");
      label.setAttribute("class","edge-label "+(edge.polarity==="-"?"neg":"pos"));
      label.textContent = edge.polarity;
      svg.appendChild(label);
    });

    // B1 loop: node 2 (flujo de recursos) <-> external "Trazabilidad y auditoría preventiva"
    const n2 = pos[2];
    const bx = n2.x, by = n2.y - 145;
    const bnode = document.createElementNS(svgNS,"g");
    bnode.setAttribute("class","node-box");
    bnode.innerHTML = `
      <rect x="${bx-100}" y="${by-24}" width="200" height="48" rx="10"></rect>
      <text x="${bx}" y="${by-2}" text-anchor="middle">Trazabilidad y auditoría preventiva</text>
      <text x="${bx}" y="${by+14}" text-anchor="middle" class="actors">ADRES · Auditoría forense UPC</text>`;
    svg.appendChild(bnode);

    const pathToB = document.createElementNS(svgNS,"path");
    pathToB.setAttribute("d", `M ${n2.x-40} ${n2.y-20} Q ${n2.x-95} ${by+40} ${bx-20} ${by+22}`);
    pathToB.setAttribute("class","edge-path b1-edge");
    svg.appendChild(pathToB);
    const lblToB = document.createElementNS(svgNS,"text");
    lblToB.setAttribute("x", n2.x-100); lblToB.setAttribute("y", by+60);
    lblToB.setAttribute("class","edge-label neg"); lblToB.textContent="−";
    svg.appendChild(lblToB);

    const pathFromB = document.createElementNS(svgNS,"path");
    pathFromB.setAttribute("d", `M ${bx+20} ${by+22} Q ${n2.x+95} ${by+40} ${n2.x+40} ${n2.y-20}`);
    pathFromB.setAttribute("class","edge-path b1-edge");
    svg.appendChild(pathFromB);
    const lblFromB = document.createElementNS(svgNS,"text");
    lblFromB.setAttribute("x", n2.x+100); lblFromB.setAttribute("y", by+60);
    lblFromB.setAttribute("class","edge-label pos"); lblFromB.textContent="+ (demora)";
    svg.appendChild(lblFromB);

    const b1Loop = DATA.causalLoop.loops.find(l=>l.id==="B1");
    const bTagY = (by + n2.y) / 2 + 6;
    const b1Group = document.createElementNS(svgNS,"g");
    b1Group.setAttribute("class","loop-tag-group b");
    b1Group.innerHTML = `
      <rect x="${bx-24}" y="${bTagY-16}" width="48" height="26" rx="8"></rect>
      <text x="${bx}" y="${bTagY}" text-anchor="middle" class="loop-tag b">B1</text>`;
    if(b1Loop) attachLoopTooltip(b1Group, b1Loop);
    svg.appendChild(b1Group);

    nodes.forEach(node=>{
      const p = pos[node.id];
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","node-box");
      g.setAttribute("data-node", node.id);
      const words = wrapLabel(node.label, 20);
      const boxW = 168, lineH = 13;
      const boxH = 30 + words.length*lineH + (node.actors ? 14: 0);
      let html = `<rect x="${p.x-boxW/2}" y="${p.y-boxH/2}" width="${boxW}" height="${boxH}" rx="10"></rect>`;
      words.forEach((w,i)=>{
        html += `<text x="${p.x}" y="${p.y - boxH/2 + 16 + i*lineH}" text-anchor="middle">${escapeXML(w)}</text>`;
      });
      if(node.actors){
        html += `<text x="${p.x}" y="${p.y + boxH/2 - 8}" text-anchor="middle" class="actors">${escapeXML(node.actors)}</text>`;
      }
      g.innerHTML = html;
      attachNodeTooltip(g, node);
      svg.appendChild(g);
    });

    svg.addEventListener("mouseleave", scheduleHideTooltip);
    return svg;
  }
  function buildCausalAccessibleList(){
    const ul = el("ul",{class:"a11y-list"});
    DATA.causalLoop.loops.forEach(loop=>{
      ul.appendChild(el("li",{},[
        el("div",{class:"a11y-title"},[loop.title]),
        el("div",{},[loop.text]),
      ]));
    });
    DATA.causalLoop.nodes.forEach(node=>{
      const li = el("li",{},[
        el("div",{class:"a11y-title"},["Nodo "+node.id+": "+node.label]),
      ]);
      if(node.actors) li.appendChild(el("div",{class:"a11y-meta"},["Actores: "+node.actors]));
      if(node.sessions && node.sessions.length){
        li.appendChild(el("div",{class:"a11y-meta"},[
          "Respaldado por: " + node.sessions.map(n=>{ const s=sessionById(n); return s?`"${s.tag}" (${s.speaker})`:`sesión ${n}`; }).join("; ")
        ]));
      }
      if(node.confidence) li.appendChild(confidenceTag(node.confidence));
      ul.appendChild(li);
    });
    DATA.causalLoop.edges.forEach(e=>{
      const from = DATA.causalLoop.nodes.find(n=>n.id===e.from);
      const to = DATA.causalLoop.nodes.find(n=>n.id===e.to);
      ul.appendChild(el("li",{},[
        el("div",{},[`${from.label} → ${to.label}`, el("span",{class:"chip-muted chip", style:"margin-left:8px"},[e.polarity==="-"?"sentido opuesto (−)":"mismo sentido (+)"])]),
      ]));
    });
    return ul;
  }
  function wrapLabel(text, maxChars){
    const words = text.split(" ");
    const lines = []; let cur = "";
    words.forEach(w=>{
      if((cur+" "+w).trim().length > maxChars){ lines.push(cur.trim()); cur = w; }
      else cur = (cur+" "+w).trim();
    });
    if(cur) lines.push(cur);
    return lines;
  }
  /* ---------------- Diagram floating tooltip (nodes + R1/B1 loop tags) ---------------- */
  function nodeTooltipHTML(node){
    let html = `<h5>${escapeXML(node.label)}</h5>`;
    if(node.actors) html += `<p style="color:var(--text-muted)">Actores: ${escapeXML(node.actors)}</p>`;
    if(node.sessions && node.sessions.length){
      html += `<p>Respaldado por: `;
      html += node.sessions.map(n=>{
        const s = sessionById(n);
        return s ? `"${escapeXML(s.tag)}" (${escapeXML(s.speaker)})` : `Sesión ${n}`;
      }).join("; ");
      html += `</p>`;
    } else {
      html += `<p style="color:var(--text-muted)">Nodo de enlace en la narrativa causal (síntesis del autor); no corresponde a una cifra citada individualmente.</p>`;
    }
    if(node.confidence){
      html += `<p style="margin-top:4px"><span class="confidence-tag confidence-${escapeXML(node.confidence)}">${escapeXML(CONFIDENCE_LABEL[node.confidence]||node.confidence)}</span></p>`;
    }
    return html;
  }
  function loopTooltipHTML(loop){
    let html = `<h5>${escapeXML(loop.title)}</h5><p>${escapeXML(loop.text)}</p>`;
    if(loop.relatedInitiatives){
      html += `<div class="initiatives">` +
        loop.relatedInitiatives.map(t=>`<span class="tag-pill">${escapeXML(t)}</span>`).join("") + `</div>`;
    }
    return html;
  }
  // Makes an SVG <g> node keyboard-operable (Tab to focus, Enter/Space to
  // trigger the same tooltip a mouse hover/click would show) — required for
  // WCAG 2.1.1 (keyboard) since these custom shapes have no native semantics.
  function makeSvgFocusable(gEl, label){
    gEl.setAttribute("tabindex","0");
    gEl.setAttribute("role","button");
    gEl.setAttribute("aria-label", label);
  }
  function attachNodeTooltip(gEl, node){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, nodeTooltipHTML(node));
    };
    makeSvgFocusable(gEl, node.label);
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("focus", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
    gEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); show(); } });
  }
  function attachLoopTooltip(gEl, loop){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, loopTooltipHTML(loop));
    };
    makeSvgFocusable(gEl, loop.title);
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("focus", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
    gEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); show(); } });
  }
  function showDiagramTooltip(targetEl, html){
    const wrap = targetEl.closest(".diagram-wrap");
    const tooltip = wrap ? wrap.querySelector(".diagram-tooltip") : null;
    if(!tooltip || !wrap) return;
    tooltip.innerHTML = html;
    tooltip.hidden = false;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();
    const cx = elRect.left - wrapRect.left + wrap.scrollLeft + elRect.width/2;
    const topOfEl = elRect.top - wrapRect.top + wrap.scrollTop;
    const bottomOfEl = elRect.bottom - wrapRect.top + wrap.scrollTop;
    requestAnimationFrame(()=>{
      const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      let left = cx - tw/2;
      let top = topOfEl - th - 10;
      if(top < wrap.scrollTop + 4) top = bottomOfEl + 10;
      left = Math.max(wrap.scrollLeft + 6, Math.min(left, wrap.scrollLeft + wrapRect.width - tw - 6));
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });
  }
  function hideDiagramTooltip(){
    document.querySelectorAll(".diagram-tooltip").forEach(t=> t.hidden = true);
    document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
  }
  let tooltipHideTimer = null;
  function scheduleHideTooltip(){
    clearTimeout(tooltipHideTimer);
    tooltipHideTimer = setTimeout(hideDiagramTooltip, 300);
  }
  function cancelHideTooltip(){
    clearTimeout(tooltipHideTimer);
  }
  // Text-equivalent view for a mouse/keyboard SVG diagram — some screen
  // readers handle custom interactive SVG poorly regardless of ARIA
  // labeling, so every diagram also ships a plain accessible list of the
  // same information, toggleable in place.
  function addAccessibleListToggle(body, wrap, listEl){
    listEl.hidden = true;
    const btn = el("button",{class:"btn", type:"button", "aria-pressed":"false"},["Ver como lista (accesible)"]);
    btn.addEventListener("click", ()=>{
      const showingList = listEl.hidden;
      listEl.hidden = !showingList;
      wrap.hidden = showingList;
      btn.setAttribute("aria-pressed", showingList?"true":"false");
      btn.textContent = showingList ? "Ver como diagrama" : "Ver como lista (accesible)";
    });
    body.appendChild(el("div",{class:"a11y-list-toggle"},[btn]));
    body.appendChild(listEl);
  }

  /* ============================================================
     RENDER: 04 Resultados — Ejes temáticos
     ============================================================ */
  function renderEjes(){
    const body = document.getElementById("body-resultados");
    sectionDivider(body, "resultados-ejes", "Ejes temáticos del congreso",
      "Financiamiento, tarifas, regulación, epidemiología, y prestadores/infraestructura/IA.");
    body.appendChild(el("p",{},[
      "Clasificación editorial propia del autor de los puntos más relevantes del congreso, organizada por los grandes temas que atravesaron la agenda. Cada hallazgo cita, entre comillas, la sesión de la agenda que lo respalda — pasa el cursor sobre la cita para ver el número de sesión y el ponente."
    ]));
    DATA.categories.forEach(cat=>{
      const block = el("div",{class:"category-block "+cat.color, id:"eje-"+cat.id});
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
        line.appendChild(el("a",{href:s.url, target:"_blank", rel:"noopener noreferrer"},[s.label]));
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
    const body = document.getElementById("body-resultados");
    sectionDivider(body, "resultados-cifras", "Cifras clave",
      "Los números que más se citaron en el escenario.");
    body.appendChild(el("p",{},[
      "Todas estas cifras fueron declaradas por el ponente citado durante su sesión (agenda oficial + anotaciones propias del autor) o provienen de las fuentes públicas indicadas — no son series de tiempo, sino los puntos de dato que se presentaron en el congreso."
    ]));

    DATA.comparisonIndicators.forEach(ind=>{
      const block = el("div",{class:"indicator-block"});
      block.appendChild(el("div",{class:"indicator-head"},[
        el("h4",{},[ind.title]),
        ind.unit ? el("span",{class:"unit"},[ind.unit]) : null,
        confidenceTag(ind.confidence),
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

    DATA.keyFigureGroups.forEach((group,gi)=>{
      body.appendChild(el("h4",{id:"cifras-grupo-"+gi, style:"font-size:.86rem;margin:22px 0 10px"},[group.title]));
      const grid = el("div",{class:"stat-grid", style:"margin-top:0"});
      group.figures.forEach(f=>{
        const card = el("div",{class:"stat-card", title: "Sesión "+f.session+" — "+(sessionById(f.session)?sessionById(f.session).speaker:"")},[
          el("div",{class:"value"},[f.value]),
          el("div",{class:"label"},[f.label]),
          el("div",{class:"detail"},[f.detail]),
        ]);
        card.appendChild(confidenceTag("escenario"));
        grid.appendChild(card);
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
     RENDER: 03 Materiales y métodos — Agenda completa
     ============================================================ */
  function renderAgenda(){
    const body = document.getElementById("body-metodos");
    sectionDivider(body, "metodos-agenda", "Agenda completa",
      "El material de esta síntesis: las 22 sesiones del congreso, con la conclusión más relevante de cada una.");
    body.appendChild(el("p",{},["Filtra por jornada. Ponente y cargo van en una sola columna para mantener la tabla legible."]));

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
      ["#","Día","Hora","Sesión","Ponente","Cargo","Conclusión más relevante"],
      DATA.agenda.map(a=>[String(a.n), a.day, a.time, a.title, a.speaker, a.role, a.conclusion||""])
    ));
    body.appendChild(el("div",{style:"display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px"},[filterRow, actions]));

    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"studies", id:"agenda-table"},[
      el("caption",{class:"sr-only"},["Agenda completa del XXI Congreso Nacional de Salud, 22 sesiones con día, hora, título, ponente, cargo y conclusión más relevante"]),
      el("thead",{},[ el("tr",{},[
        el("th",{},["#"]), el("th",{},["Día"]), el("th",{},["Hora"]),
        el("th",{},["Sesión"]), el("th",{},["Ponente y cargo"]), el("th",{},["Conclusión más relevante"]),
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
        el("td",{style:"min-width:220px"},[a.title]),
        el("td",{style:"min-width:190px"},[
          el("div",{class:"speaker-cell"},[ avatarEl(a.speaker, 28), el("span",{},[a.speaker]) ]),
          el("div",{class:"agenda-role"},[a.role]),
        ]),
        el("td",{style:"min-width:240px"},[a.conclusion || ""]),
      ]));
    });
  }

  /* ============================================================
     RENDER: 06 Recomendaciones
     ============================================================ */
  function renderRecomendaciones(){
    const body = document.getElementById("body-discusion");
    sectionDivider(body, "discusion-recomendaciones", "Recomendaciones",
      "Tablero de acción — síntesis propia, ancladas en el diagnóstico causal.");
    body.appendChild(el("p",{},[
      "Síntesis propia del autor, ancladas en los puntos de apalancamiento del diagnóstico causal (sección anterior). No son conclusiones del congreso ni posiciones de Consultorsalud o de los ponentes citados."
    ]));
    DATA.recommendations.forEach(rec=>{
      const card = el("div",{class:"rec-card"});
      card.appendChild(el("div",{class:"rec-top"},[
        el("h4",{},[rec.title]),
      ]));
      card.appendChild(el("div",{class:"rec-leverage"},["Punto de apalancamiento: "+rec.leverage]));
      card.appendChild(el("p",{style:"margin:0 0 6px"},[rec.text]));
      if(rec.owner || rec.nextStep){
        card.appendChild(el("div",{class:"rec-board-row"},[
          rec.owner ? el("div",{class:"rec-board-cell"},[ el("div",{class:"k"},["Responsable sugerido"]), rec.owner ]) : null,
          rec.nextStep ? el("div",{class:"rec-board-cell"},[ el("div",{class:"k"},["Próximo paso"]), rec.nextStep ]) : null,
        ]));
      }
      const outWrap = el("div",{class:"outcomes"});
      rec.outcomes.forEach(o=>{
        outWrap.appendChild(el("div",{class:"outcome"},[
          el("div",{class:"name"},[o.name, el("span",{class:"level-pill "+levelClass(o.level)},[o.level])]),
          el("div",{class:"note"},[o.note]),
        ]));
      });
      card.appendChild(outWrap);
      body.appendChild(card);
    });
  }

  /* ============================================================
     RENDER: 05 Discusión — Lagunas de evidencia
     ============================================================ */
  function renderLagunas(){
    const body = document.getElementById("body-discusion");
    sectionDivider(body, "discusion-lagunas", "Lagunas de evidencia",
      "Qué no se presentó o quedó sin resolver.");
    const list = el("ul",{class:"gap-list"});
    DATA.gaps.forEach(g=> list.appendChild(el("li",{},[g])));
    body.appendChild(list);
  }

  /* ============================================================
     RENDER: 08 Nota técnica
     ============================================================ */
  function renderNotaTecnica(){
    const body = document.getElementById("body-discusion");
    const t = DATA.technicalNote;
    sectionDivider(body, "discusion-nota-tecnica", "Nota técnica",
      "De la intervención a la implementación en IPS y otros prestadores.");

    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Nota técnica"]),
      el("h3",{},[t.title]),
      el("p",{style:"color:var(--text-muted)"},[t.subtitle]),
      el("p",{},[t.purpose]),
    ]));

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:22px"},["1. Contexto"]));
    body.appendChild(el("p",{},[t.context]));

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["2. La brecha identificada"]));
    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"data-table gap-table"},[
      el("caption",{class:"sr-only"},["Tabla comparativa: intervenciones anunciadas frente a evidencia de implementación en IPS"]),
      el("thead",{},[ el("tr",{}, t.gapTable.columns.map(c=>el("th",{},[c]))) ]),
      el("tbody",{}, t.gapTable.rows.map(r=> el("tr",{}, r.map(cell=> el("td",{style:"white-space:normal;min-width:260px"},[cell]))))),
    ]);
    tableWrap.appendChild(table);
    body.appendChild(tableWrap);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["3. Por qué es una oportunidad"]));
    body.appendChild(el("p",{},[t.opportunity]));

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["4. Opciones para cerrar la brecha"]));
    t.options.forEach((o,i)=>{
      body.appendChild(el("div",{class:"card"},[
        el("strong",{},[(i+1)+". "+o.title]),
        el("p",{style:"margin:4px 0 0"},[o.text]),
      ]));
    });

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["5. Marco de resultados de implementación aplicable"]));
    body.appendChild(el("p",{style:"font-size:.85rem;color:var(--text-muted)"},[t.outcomesFramework.note]));
    const outWrap = el("div",{class:"outcomes"});
    t.outcomesFramework.rows.forEach(o=>{
      outWrap.appendChild(el("div",{class:"outcome"},[
        el("div",{class:"name"},[o.name, el("span",{class:"level-pill "+levelClass(o.level)},[o.level])]),
        el("div",{class:"note"},[o.note]),
      ]));
    });
    body.appendChild(outWrap);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:18px"},["6. A quién le compete / próximos pasos"]));
    const stepsList = el("ul",{class:"gap-list"});
    t.nextSteps.forEach(s=>{
      stepsList.appendChild(el("li",{},[ el("strong",{},[s.actor+": "]), s.action ]));
    });
    body.appendChild(stepsList);

    body.appendChild(el("p",{class:"indicator-source", style:"margin-top:16px"},[t.sources]));

    // 7. Herramienta práctica — mapa mental + plantilla, anidados con la sesión 22
    const pt = t.providerNoteTool;
    if(pt){
      body.appendChild(el("h4",{id:"nota-tecnica-herramienta", style:"font-size:.86rem;margin-top:26px"},["7. Herramienta práctica: nota técnica de un prestador a una EPS"]));
      body.appendChild(el("p",{},[pt.intro]));

      const wrap = el("div",{class:"diagram-wrap"});
      wrap.appendChild(buildMindMapSVG(pt));
      const tooltipEl = el("div",{class:"diagram-tooltip",hidden:"hidden"});
      tooltipEl.addEventListener("mouseenter", cancelHideTooltip);
      tooltipEl.addEventListener("mouseleave", scheduleHideTooltip);
      wrap.appendChild(tooltipEl);
      body.appendChild(wrap);
      const mmList = el("ul",{class:"a11y-list"});
      pt.branches.forEach(b=>{
        const li = el("li",{},[ el("div",{class:"a11y-title"},[b.label]) ]);
        const itemsList = el("ul",{style:"margin:4px 0 0;padding-left:18px"});
        b.items.forEach(it=> itemsList.appendChild(el("li",{style:"font-size:.82rem"},[it])));
        li.appendChild(itemsList);
        if(b.sessions && b.sessions.length){
          li.appendChild(el("div",{class:"a11y-meta"},[
            b.sessions.map(n=>{ const s=sessionById(n); return s?`"${s.tag}"`:`sesión ${n}`; }).join(" · ")
          ]));
        }
        mmList.appendChild(li);
      });
      addAccessibleListToggle(body, wrap, mmList);
      body.appendChild(el("p",{class:"diagram-hint"},["Toca o pasa el cursor sobre cada rama para ver los elementos que la componen."]));

      if(pt.template){
        const tpl = pt.template;
        const dlBox = el("div",{class:"template-download"},[
          el("div",{},[
            el("strong",{},[tpl.label.replace("Descargar ","")]),
            el("p",{style:"margin:4px 0 0;font-size:.82rem;color:var(--text-muted)"},[tpl.note]),
          ]),
          el("a",{class:"btn btn-primary", href:tpl.path, download:tpl.filename},[
            el("svg",{viewBox:"0 0 24 24",fill:"none",width:"16",height:"16",html:'<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'}),
            tpl.label,
          ]),
        ]);
        body.appendChild(dlBox);
      }
    }
  }

  function buildMindMapSVG(pt){
    const svgNS = "http://www.w3.org/2000/svg";
    const W = 820, H = 800;
    const cx = W/2, cy = H/2, R = 280;
    const branches = pt.branches;
    const n = branches.length;
    const pos = {};
    branches.forEach((b,i)=>{
      const angle = -Math.PI/2 + (i * (2*Math.PI/n));
      pos[b.id] = { x: cx + R*Math.cos(angle), y: cy + R*Math.sin(angle) };
    });

    const svg = document.createElementNS(svgNS,"svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width","100%");
    svg.setAttribute("role","img");
    svg.setAttribute("aria-label","Mapa mental de los elementos de una nota técnica de un prestador a una EPS");

    // Connecting lines hub -> branch
    branches.forEach(b=>{
      const p = pos[b.id];
      const path = document.createElementNS(svgNS,"path");
      path.setAttribute("d", `M ${cx} ${cy} L ${p.x} ${p.y}`);
      path.setAttribute("class","edge-path mindmap-edge");
      svg.appendChild(path);
    });

    // Central hub
    const hub = document.createElementNS(svgNS,"g");
    hub.setAttribute("class","node-box mindmap-hub");
    const hubWords = wrapLabel(pt.center, 16);
    const hubW = 190, hubLineH = 15, hubH = 26 + hubWords.length*hubLineH;
    let hubHtml = `<rect x="${cx-hubW/2}" y="${cy-hubH/2}" width="${hubW}" height="${hubH}" rx="14"></rect>`;
    hubWords.forEach((w,i)=>{
      hubHtml += `<text x="${cx}" y="${cy - hubH/2 + 20 + i*hubLineH}" text-anchor="middle">${escapeXML(w)}</text>`;
    });
    hub.innerHTML = hubHtml;
    svg.appendChild(hub);

    // Branch nodes
    branches.forEach(b=>{
      const p = pos[b.id];
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","node-box");
      const words = wrapLabel(b.label, 17);
      const boxW = 172, lineH = 13;
      const boxH = 24 + words.length*lineH;
      let html = `<rect x="${p.x-boxW/2}" y="${p.y-boxH/2}" width="${boxW}" height="${boxH}" rx="10"></rect>`;
      words.forEach((w,i)=>{
        html += `<text x="${p.x}" y="${p.y - boxH/2 + 16 + i*lineH}" text-anchor="middle">${escapeXML(w)}</text>`;
      });
      g.innerHTML = html;
      attachBranchTooltip(g, b);
      svg.appendChild(g);
    });

    svg.addEventListener("mouseleave", scheduleHideTooltip);
    return svg;
  }
  function branchTooltipHTML(b){
    let html = `<h5>${escapeXML(b.label)}</h5>`;
    html += `<ul class="cite-list">` + b.items.map(it=>`<li>${escapeXML(it)}</li>`).join("") + `</ul>`;
    if(b.sessions && b.sessions.length){
      html += `<p>` + b.sessions.map(n=>{
        const s = sessionById(n);
        return s ? `"${escapeXML(s.tag)}"` : `sesión ${n}`;
      }).join(" · ") + `</p>`;
    }
    return html;
  }
  function attachBranchTooltip(gEl, branch){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, branchTooltipHTML(branch));
    };
    makeSvgFocusable(gEl, branch.label);
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("focus", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
    gEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); show(); } });
  }

  /* ============================================================
     RENDER: 06 Conclusión (Mi lectura)
     ============================================================ */
  function renderConclusion(){
    const body = document.getElementById("body-conclusion");
    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Síntesis y opinión personal del autor"]),
      el("p",{},[DATA.reading.text]),
    ]));
    body.appendChild(el("p",{style:"margin-top:14px;font-style:italic;color:var(--text-muted)"},[DATA.reading.prompt]));
  }

  /* ============================================================
     RENDER: 03 Materiales y métodos — Metodología y fuentes
     ============================================================ */
  function renderMetodologia(){
    const body = document.getElementById("body-metodos");
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
     SIDEBAR TOC + SCROLLSPY + BREADCRUMB
     ============================================================ */
  function scrollToId(id){
    const target = document.getElementById(id);
    if(target) target.scrollIntoView({behavior:"smooth", block:"start"});
  }
  function renderSidebarTOC(){
    const nav = document.getElementById("toc");
    SECTIONS.forEach(s=>{
      const a = el("a",{class:"toc-link", href:"#sec-"+s.id, "data-target":"sec-"+s.id},[
        el("span",{class:"toc-num"},[s.num]), s.title
      ]);
      a.addEventListener("click",(e)=>{
        e.preventDefault();
        openSection(s.id);
        scrollToId("sec-"+s.id);
        closeMobileSidebar();
      });
      nav.appendChild(a);
      (s.subs||[]).forEach(sub=>{
        const sa = el("a",{class:"toc-link sub", href:"#"+sub.id, "data-target":sub.id},[sub.label]);
        sa.addEventListener("click",(e)=>{
          e.preventDefault();
          openSection(s.id);
          scrollToId(sub.id);
          closeMobileSidebar();
        });
        nav.appendChild(sa);
      });
    });
  }
  function initScrollspy(){
    const landmarks = [];
    SECTIONS.forEach(s=>{
      landmarks.push({ tocKey:"sec-"+s.id, el: document.getElementById("hdr-"+s.id), sectionId:s.id, subId:null, label:s.title });
      (s.subs||[]).forEach(sub=>{
        const e = document.getElementById(sub.id);
        if(e) landmarks.push({ tocKey:sub.id, el:e, sectionId:s.id, subId:sub.id, label:sub.label });
      });
    });
    function update(){
      // Collapsed accordion panels use grid-template-rows:0fr + overflow:hidden
      // to hide content: the panel's own box is 0-height (nothing paints), but
      // elements inside still carry their "phantom" layout position as if the
      // panel were fully expanded. Skip sub-landmarks of collapsed sections so
      // that phantom geometry never breaks the (otherwise monotonic) scan —
      // only top-level headers are guaranteed real/visible regardless of state.
      const offset = 100;
      let current = null;
      for(const lm of landmarks){
        if(!lm.el) continue;
        if(lm.subId){
          const parentItem = document.getElementById("sec-"+lm.sectionId);
          if(!parentItem || !parentItem.classList.contains("open")) continue;
        }
        if(lm.el.getBoundingClientRect().top - offset <= 0) current = lm;
      }
      setActiveTOC(current || landmarks[0]);
    }
    let ticking = false;
    window.addEventListener("scroll", ()=>{
      if(!ticking){ requestAnimationFrame(()=>{ update(); ticking=false; }); ticking=true; }
    }, {passive:true});
    update();
  }
  function setActiveTOC(current){
    document.querySelectorAll(".toc-link").forEach(a=>{
      a.classList.toggle("active", a.getAttribute("data-target") === current.tocKey);
    });
    updateBreadcrumb(current);
  }
  function updateBreadcrumb(current){
    const bc = document.getElementById("breadcrumb");
    if(!bc) return;
    const section = SECTIONS.find(s=>s.id===current.sectionId);
    if(!section) return;
    bc.innerHTML = "";
    bc.appendChild(el("a",{href:"#main"},["Inicio"]));
    bc.appendChild(el("span",{class:"sep","aria-hidden":"true"},["›"]));
    if(current.subId){
      const secLink = el("a",{href:"#sec-"+current.sectionId},[section.title]);
      secLink.addEventListener("click",(e)=>{ e.preventDefault(); openSection(current.sectionId); scrollToId("sec-"+current.sectionId); });
      bc.appendChild(secLink);
      bc.appendChild(el("span",{class:"sep","aria-hidden":"true"},["›"]));
      bc.appendChild(el("span",{class:"current"},[current.label]));
    } else {
      bc.appendChild(el("span",{class:"current"},[section.title]));
    }
  }

  /* ============================================================
     MOBILE SIDEBAR DRAWER
     ============================================================ */
  function initMobileSidebar(){
    const toggle = document.getElementById("toc-toggle");
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("sidebar-scrim");
    function openDrawer(){
      sidebar.classList.add("open"); scrim.hidden = false;
      toggle.setAttribute("aria-expanded","true");
    }
    toggle.addEventListener("click", ()=> sidebar.classList.contains("open") ? closeMobileSidebar() : openDrawer());
    scrim.addEventListener("click", closeMobileSidebar);
  }
  function closeMobileSidebar(){
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("sidebar-scrim");
    const toggle = document.getElementById("toc-toggle");
    if(!sidebar) return;
    sidebar.classList.remove("open");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded","false");
  }

  /* ============================================================
     LIVE SEARCH
     ============================================================ */
  let SEARCH_INDEX = [];
  let searchResults = [];
  let searchActiveIndex = -1;
  function buildSearchIndex(){
    const idx = [];
    DATA.agenda.forEach(a=>{
      idx.push({ type:"Ponente", label:a.speaker, detail:a.role+" · sesión "+a.n+" · "+a.title, sectionId:"metodos", anchorId:"metodos-agenda" });
      idx.push({ type:"Sesión "+a.n, label:a.title, detail:(a.conclusion?a.conclusion+" — ":"")+a.speaker+" — "+a.role, sectionId:"metodos", anchorId:"metodos-agenda" });
    });
    DATA.categories.forEach(cat=>{
      cat.codes.forEach(code=>{
        idx.push({ type:"Eje "+cat.id, label: code.text.length>90? code.text.slice(0,90)+"…" : code.text, detail: cat.title, sectionId:"resultados", anchorId:"eje-"+cat.id });
      });
    });
    DATA.keyFigureGroups.forEach((g,gi)=>{
      g.figures.forEach(f=>{
        idx.push({ type:"Cifra", label: f.value+" — "+f.label, detail: f.detail, sectionId:"resultados", anchorId:"cifras-grupo-"+gi });
      });
    });
    DATA.comparisonIndicators.forEach(ci=>{
      idx.push({ type:"Cifra", label: ci.title, detail: ci.before.value+" → "+ci.after.value, sectionId:"resultados", anchorId:"resultados-cifras" });
    });
    DATA.recommendations.forEach(r=>{
      idx.push({ type:"Recomendación", label:r.title, detail:r.leverage, sectionId:"discusion", anchorId:"discusion-recomendaciones" });
    });
    DATA.gaps.forEach(g=>{
      idx.push({ type:"Laguna", label: g.length>90? g.slice(0,90)+"…" : g, detail:"Lagunas de evidencia", sectionId:"discusion", anchorId:"discusion-lagunas" });
    });
    idx.push({ type:"Sección", label:"Diagnóstico causal", detail:"Bucles R1 (crisis de caja) y B1 (trazabilidad y auditoría)", sectionId:"resultados", anchorId:"resultados-diagnostico" });
    idx.push({ type:"Sección", label:"Nota técnica", detail:"Intervención vs. implementación en IPS", sectionId:"discusion", anchorId:"discusion-nota-tecnica" });
    idx.push({ type:"Herramienta", label:"Mapa mental: nota técnica IPS → EPS", detail:"Mapa mental y plantilla descargable", sectionId:"discusion", anchorId:"nota-tecnica-herramienta" });
    return idx;
  }
  function openSearch(){
    const panel = document.getElementById("search-panel");
    const input = document.getElementById("search-input");
    panel.hidden = false;
    input.value = "";
    document.getElementById("search-results").innerHTML = "";
    searchResults = []; searchActiveIndex = -1;
    setTimeout(()=> input.focus(), 10);
  }
  function closeSearch(){
    const panel = document.getElementById("search-panel");
    if(panel.hidden) return;
    panel.hidden = true;
    document.getElementById("search-trigger").focus();
  }
  function isSearchOpen(){ return !document.getElementById("search-panel").hidden; }
  function runSearch(q){
    const resultsEl = document.getElementById("search-results");
    const input = document.getElementById("search-input");
    resultsEl.innerHTML = "";
    searchActiveIndex = -1;
    const query = q.trim().toLowerCase();
    if(!query){ searchResults = []; input.setAttribute("aria-expanded","false"); return; }
    searchResults = SEARCH_INDEX.filter(e=>
      (e.label && e.label.toLowerCase().indexOf(query)>=0) ||
      (e.detail && e.detail.toLowerCase().indexOf(query)>=0) ||
      (e.type && e.type.toLowerCase().indexOf(query)>=0)
    ).slice(0,30);
    input.setAttribute("aria-expanded", searchResults.length ? "true":"false");
    if(!searchResults.length){
      resultsEl.appendChild(el("li",{class:"search-empty"},['Sin resultados para "'+q+'"']));
      return;
    }
    searchResults.forEach((r,i)=>{
      const li = el("li",{role:"presentation"});
      const a = el("a",{class:"search-result", href:"#", role:"option", id:"sr-"+i},[
        el("div",{class:"sr-type"},[r.type]),
        el("div",{class:"sr-label"},[r.label]),
        el("div",{class:"sr-detail"},[r.detail||""]),
      ]);
      a.addEventListener("click",(e)=>{ e.preventDefault(); goToSearchResult(r); });
      li.appendChild(a);
      resultsEl.appendChild(li);
    });
  }
  function goToSearchResult(r){
    closeSearch();
    openSection(r.sectionId);
    setTimeout(()=> scrollToId(r.anchorId), 60);
  }
  function highlightActiveResult(){
    const items = document.querySelectorAll(".search-result");
    items.forEach((a,i)=> a.classList.toggle("active", i===searchActiveIndex));
    const active = items[searchActiveIndex];
    if(active) active.scrollIntoView({block:"nearest"});
  }
  function initSearch(){
    SEARCH_INDEX = buildSearchIndex();
    const trigger = document.getElementById("search-trigger");
    const panel = document.getElementById("search-panel");
    const input = document.getElementById("search-input");
    const closeBtn = document.getElementById("search-close");
    trigger.addEventListener("click", openSearch);
    closeBtn.addEventListener("click", closeSearch);
    panel.addEventListener("mousedown",(e)=>{ if(e.target===panel) closeSearch(); });
    input.addEventListener("input", ()=> runSearch(input.value));
    input.addEventListener("keydown",(e)=>{
      if(e.key==="ArrowDown"){ e.preventDefault(); if(searchResults.length){ searchActiveIndex = Math.min(searchActiveIndex+1, searchResults.length-1); highlightActiveResult(); } }
      else if(e.key==="ArrowUp"){ e.preventDefault(); if(searchResults.length){ searchActiveIndex = Math.max(searchActiveIndex-1, 0); highlightActiveResult(); } }
      else if(e.key==="Enter"){ e.preventDefault();
        if(searchActiveIndex>=0 && searchResults[searchActiveIndex]) goToSearchResult(searchResults[searchActiveIndex]);
        else if(searchResults.length) goToSearchResult(searchResults[0]);
      }
    });
  }

  /* ============================================================
     KEYBOARD SHORTCUTS + HELP PANEL
     ============================================================ */
  function isShortcutsOpen(){ return !document.getElementById("shortcuts-panel").hidden; }
  function openShortcuts(){
    document.getElementById("shortcuts-panel").hidden = false;
    document.getElementById("shortcuts-close").focus();
  }
  function closeShortcuts(){
    document.getElementById("shortcuts-panel").hidden = true;
    document.getElementById("help-toggle").focus();
  }
  function initShortcutsPanel(){
    document.getElementById("help-toggle").addEventListener("click", ()=> isShortcutsOpen() ? closeShortcuts() : openShortcuts());
    document.getElementById("shortcuts-close").addEventListener("click", closeShortcuts);
    document.getElementById("shortcuts-panel").addEventListener("mousedown",(e)=>{
      if(e.target.id==="shortcuts-panel") closeShortcuts();
    });
  }
  function initKeyboardShortcuts(){
    document.addEventListener("keydown",(e)=>{
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      const typing = tag==="input" || tag==="textarea" || (e.target && e.target.isContentEditable);
      if(e.key==="/" && !typing){ e.preventDefault(); openSearch(); return; }
      if(e.key==="?" && !typing){ e.preventDefault(); isShortcutsOpen() ? closeShortcuts() : openShortcuts(); return; }
      if(e.key==="Escape"){
        if(isSearchOpen()) closeSearch();
        else if(isShortcutsOpen()) closeShortcuts();
        else { const sb = document.getElementById("sidebar"); if(sb && sb.classList.contains("open")) closeMobileSidebar(); }
      }
    });
  }

  /* ============================================================
     FOCUS MODE / SCROLL TO TOP
     ============================================================ */
  function initFocusMode(){
    const btn = document.getElementById("focus-toggle");
    btn.addEventListener("click", ()=>{
      const on = !document.body.classList.contains("focus-mode");
      document.body.classList.toggle("focus-mode", on);
      btn.setAttribute("aria-pressed", on?"true":"false");
    });
  }
  function initScrollTop(){
    const btn = document.getElementById("scroll-top");
    window.addEventListener("scroll", ()=>{ btn.hidden = window.scrollY < 600; }, {passive:true});
    btn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
  }

  /* ============================================================
     SOURCES PANEL
     ============================================================ */
  function renderSourcesPanel(){
    const body = document.getElementById("sources-panel-body");
    const groups = [];
    const methodologySources = DATA.methodology.sources.filter(s=>s.url);
    if(methodologySources.length) groups.push({ title:"Cobertura del congreso", items: methodologySources });
    const photoSources = Object.keys(DATA.speakerPhotos||{}).map(name=>({
      label: name+" — "+DATA.speakerPhotos[name].sourceLabel, url: DATA.speakerPhotos[name].sourceUrl
    })).filter(x=>x.url);
    if(photoSources.length) groups.push({ title:"Retratos oficiales de ponentes", items: photoSources });
    if(DATA.meta.relatedWork) groups.push({ title:"Análisis relacionado del autor", items:[{ label: DATA.meta.relatedWork.title, url: DATA.meta.relatedWork.url }] });
    if(!groups.length){
      body.appendChild(el("p",{style:"color:var(--text-muted);font-size:.85rem"},["No hay fuentes con URL pública verificable registradas."]));
      return;
    }
    groups.forEach(g=>{
      const gEl = el("div",{class:"sources-panel-group"},[ el("h3",{},[g.title]) ]);
      const ul = el("ul",{class:"sources-panel-list"});
      g.items.forEach(it=> ul.appendChild(el("li",{},[ el("a",{href:it.url, target:"_blank", rel:"noopener noreferrer"},[it.label]) ])));
      gEl.appendChild(ul);
      body.appendChild(gEl);
    });
  }
  function initSourcesPanelToggle(){
    const btn = document.getElementById("sources-panel-btn");
    const panel = document.getElementById("sources-panel");
    btn.addEventListener("click", ()=>{
      panel.hidden = !panel.hidden;
      if(!panel.hidden) panel.scrollIntoView({behavior:"smooth", block:"start"});
    });
  }

  /* ============================================================
     CHANGELOG
     ============================================================ */
  function initChangelog(){
    const body = document.getElementById("changelog-body");
    const list = el("ul",{class:"changelog-list"});
    (DATA.changelog||[]).forEach(c=> list.appendChild(el("li",{},[ el("time",{},[c.date]), el("span",{},[c.summary]) ])));
    body.appendChild(list);
    document.getElementById("changelog-toggle").addEventListener("click", ()=>{ body.hidden = !body.hidden; });
  }

  /* ============================================================
     EXPORT: single "export to PDF" control, visible sections only.
     One control at the end of the content (not one per section) —
     it prints exactly whichever sections are currently expanded via
     the browser's print dialog; collapsed sections are excluded by
     the @media print rule ".acc-item:not(.open){ display:none }".
     ============================================================ */
  function initGlobalExport(){
    const btn = document.getElementById("export-pdf-btn");
    if(!btn) return;
    btn.addEventListener("click", ()=> window.print());
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot(){
    renderHero();
    buildAccordionShell();
    renderResumen();
    renderIntroduccion();
    renderMetodologia();
    renderAgenda();
    renderDiagnostico();
    renderEjes();
    renderCifras();
    renderRecomendaciones();
    renderLagunas();
    renderNotaTecnica();
    renderConclusion();

    renderSidebarTOC();
    renderSourcesPanel();
    initGlobalExport();
    initChangelog();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAllSections(true));
    document.getElementById("collapse-all").addEventListener("click", ()=> setAllSections(false));

    document.addEventListener("click", (e)=>{
      if(!e.target.closest || !e.target.closest(".node-box, .loop-tag-group")) hideDiagramTooltip();
    });

    initMobileSidebar();
    initSearch();
    initShortcutsPanel();
    initKeyboardShortcuts();
    initFocusMode();
    initScrollTop();
    initSourcesPanelToggle();
    initScrollspy();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
