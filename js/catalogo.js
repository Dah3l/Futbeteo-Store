// Futbeteo Store — catálogo (catalogo.html). Usa js/common.js (WA, SIZES, $, money, cart, jersey, cardHTML).
let activeCat = "all", filterTeam = "all", filterSize = "all";

function renderTeamOptions(){
  const teams = [...new Set(PRODUCTS.filter(p => p.cat!=="pers").map(p => p.team))].sort();
  $("teamSelect").innerHTML = '<option value="all">Todos los equipos</option>'
    + teams.map(t => '<option value="'+t+'"'+(filterTeam===t?" selected":"")+'>'+t+'</option>').join("");
}
function toggleClear(){ $("searchClear").classList.toggle("show", $("searchInput").value.length > 0); }
function togglePanel(){
  const panel = $("filterPanel"), open = panel.hidden;
  panel.hidden = !open;
  $("filtersBtn").classList.toggle("active", open);
  $("filtersBtn").setAttribute("aria-expanded", open ? "true" : "false");
}

function renderFilters(){
  $("filters").innerHTML = CATS.map(c =>
    '<button type="button" class="chip'+(activeCat===c[0]?" active":"")+'" data-cat="'+c[0]+'">'+c[1]+'</button>').join("");
  document.querySelectorAll(".chip").forEach(ch => ch.onclick = () => { activeCat = ch.dataset.cat; renderFilters(); renderGrid(); });
}

function filtered(){
  const q = $("searchInput").value.trim().toLowerCase();
  let list = PRODUCTS.filter(p => (activeCat==="all" || p.cat===activeCat)
    && (filterTeam==="all" || p.team===filterTeam)
    && (filterSize==="all" || p.sizes.includes(filterSize))
    && (!q || (p.name+" "+p.team+" "+p.league).toLowerCase().includes(q)));
  const s = $("sortSelect").value;
  if (s==="low") list = [...list].sort((a,b)=>a.price-b.price);
  if (s==="high") list = [...list].sort((a,b)=>b.price-a.price);
  if (s==="feat") list = [...list].sort((a,b)=>(b.feat||0)-(a.feat||0));
  if (s==="new") list = [...list].sort((a,b)=>b.id-a.id);
  return list;
}

function renderGrid(){
  const list = filtered();
  $("resultCount").textContent = list.length + (list.length===1 ? " camiseta" : " camisetas");
  if (!list.length){ $("grid").innerHTML = '<p class="empty">No encontramos esa camiseta. Prueba con otro equipo o quita el filtro.</p>'; return; }
  $("grid").innerHTML = list.map(p => cardHTML(p)).join("");
}

$("searchInput").addEventListener("input", () => { toggleClear(); renderGrid(); });
$("sortSelect").addEventListener("change", renderGrid);
$("teamSelect").addEventListener("change", () => { filterTeam = $("teamSelect").value; renderGrid(); });
$("sizeSelect").addEventListener("change", () => { filterSize = $("sizeSelect").value; renderGrid(); });
$("filtersBtn").addEventListener("click", togglePanel);
$("searchClear").addEventListener("click", () => { $("searchInput").value = ""; toggleClear(); renderGrid(); $("searchInput").focus(); });

/* Parámetros de URL: ?cat=retro&orden=novedades&q=madrid */
(function(){
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  if (cat && CATS.some(c=>c[0]===cat)) activeCat = cat;
  const orden = params.get("orden");
  const ordenMap = {novedades:"new", feat:"feat", new:"new", low:"low", high:"high"};
  if (orden && ordenMap[orden]) $("sortSelect").value = ordenMap[orden];
  const q = params.get("q");
  if (q) $("searchInput").value = q;
})();

renderFilters();
renderTeamOptions();
toggleClear();
renderGrid();
renderCart();
saveCart();
