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
  const SECTIONS = [
    { id:"resumen", num:"01", title:"Resumen ejecutivo", sub:"El congreso en 60 segundos", open:true },
    { id:"diagnostico", num:"02", title:"Diagnóstico causal", sub:"Modelo de dinámica de sistemas — retoma la revisión de gobernanza del autor", open:false },
    { id:"ejes", num:"03", title:"Ejes temáticos del congreso", sub:"Financiamiento, tarifas, regulación, epidemiología, prestadores e IA", open:false },
    { id:"cifras", num:"04", title:"Cifras clave", sub:"Los números que más se citaron en el escenario", open:false },
    { id:"agenda", num:"05", title:"Agenda completa", sub:"22 sesiones, dos jornadas, con ponente y cargo", open:false },
    { id:"recomendaciones", num:"06", title:"Recomendaciones", sub:"Síntesis propia — ancladas en el diagnóstico causal", open:false },
    { id:"lagunas", num:"07", title:"Lagunas de evidencia", sub:"Qué no se presentó o quedó sin resolver", open:false },
    { id:"nota-tecnica", num:"08", title:"Nota técnica", sub:"De la intervención a la implementación en IPS y otros prestadores", open:false },
    { id:"lectura", num:"09", title:"Mi lectura", sub:"Síntesis y reflexión propia del autor", open:false },
    { id:"metodologia", num:"10", title:"Metodología y fuentes", sub:"Cómo se elaboró esta síntesis, y sus límites", open:false },
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
    if(DATA.meta.relatedWork){
      const rw = DATA.meta.relatedWork;
      body.appendChild(el("div",{class:"related-work-box"},[
        el("h4",{},["Análisis relacionado del autor"]),
        el("a",{href:rw.url, target:"_blank", rel:"noopener", style:"font-weight:700"},[rw.title]),
        el("p",{style:"margin-top:4px"},[rw.text]),
      ]));
    }
    body.appendChild(el("p",{style:"margin-top:14px;font-size:.85rem;color:var(--text-muted)"},[
      "Explora las secciones siguientes: el diagnóstico causal (por qué se llega a esta crisis de caja), los ejes temáticos (qué se dijo y quién lo dijo), las cifras clave, la agenda completa, las recomendaciones y lagunas de evidencia, la lectura propia del autor, y finalmente la metodología y fuentes de esta síntesis."
    ]));
  }

  /* ============================================================
     RENDER: 02 Diagnóstico causal (SVG diagram)
     ============================================================ */
  function renderDiagnostico(){
    const body = document.getElementById("body-diagnostico");
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
  function attachNodeTooltip(gEl, node){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, nodeTooltipHTML(node));
    };
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
  }
  function attachLoopTooltip(gEl, loop){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, loopTooltipHTML(loop));
    };
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
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

  /* ============================================================
     RENDER: 02 Ejes temáticos
     ============================================================ */
  function renderEjes(){
    const body = document.getElementById("body-ejes");
    body.appendChild(el("p",{},[
      "Clasificación editorial propia del autor de los puntos más relevantes del congreso, organizada por los grandes temas que atravesaron la agenda. Cada hallazgo cita, entre comillas, la sesión de la agenda que lo respalda — pasa el cursor sobre la cita para ver el número de sesión y el ponente."
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
      "Todas estas cifras fueron declaradas por el ponente citado durante su sesión (agenda oficial + anotaciones propias del autor) o provienen de las fuentes públicas indicadas — no son series de tiempo, sino los puntos de dato que se presentaron en el congreso."
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
        el("td",{style:"white-space:nowrap"},[
          el("span",{class:"speaker-cell"},[ avatarEl(a.speaker, 28), el("span",{},[a.speaker]) ])
        ]),
        el("td",{style:"min-width:180px"},[a.role]),
      ]));
    });
  }

  /* ============================================================
     RENDER: 06 Recomendaciones
     ============================================================ */
  function renderRecomendaciones(){
    const body = document.getElementById("body-recomendaciones");
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
     RENDER: 07 Lagunas de evidencia
     ============================================================ */
  function renderLagunas(){
    const body = document.getElementById("body-lagunas");
    const list = el("ul",{class:"gap-list"});
    DATA.gaps.forEach(g=> list.appendChild(el("li",{},[g])));
    body.appendChild(list);
  }

  /* ============================================================
     RENDER: 08 Nota técnica
     ============================================================ */
  function renderNotaTecnica(){
    const body = document.getElementById("body-nota-tecnica");
    const t = DATA.technicalNote;

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
      body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:26px"},["7. Herramienta práctica: nota técnica de un prestador a una EPS"]));
      body.appendChild(el("p",{},[pt.intro]));

      const wrap = el("div",{class:"diagram-wrap"});
      wrap.appendChild(buildMindMapSVG(pt));
      const tooltipEl = el("div",{class:"diagram-tooltip",hidden:"hidden"});
      tooltipEl.addEventListener("mouseenter", cancelHideTooltip);
      tooltipEl.addEventListener("mouseleave", scheduleHideTooltip);
      wrap.appendChild(tooltipEl);
      body.appendChild(wrap);
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
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
  }

  /* ============================================================
     RENDER: 09 Mi lectura
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
     RENDER: 10 Metodología y fuentes
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
    renderDiagnostico();
    renderEjes();
    renderCifras();
    renderAgenda();
    renderRecomendaciones();
    renderLagunas();
    renderNotaTecnica();
    renderLectura();
    renderMetodologia();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAllSections(true));
    document.getElementById("collapse-all").addEventListener("click", ()=> setAllSections(false));

    document.addEventListener("click", (e)=>{
      if(!e.target.closest || !e.target.closest(".node-box, .loop-tag-group")) hideDiagramTooltip();
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
