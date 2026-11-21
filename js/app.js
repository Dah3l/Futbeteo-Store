// Futbeteo Store — catálogo (index.html). Usa js/common.js (WA, SIZES, $, money, cart, jersey).
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

/* Colecciones: una tarjeta por categoría con su camiseta representativa. */
function renderCollections(){
  const box = $("collGrid");
  if (!box) return;
  box.innerHTML = CATS.filter(c=>c[0]!=="all").map(c => {
    const items = PRODUCTS.filter(p=>p.cat===c[0]);
    const rep = items[0];
    return '<button type="button" class="coll-tile" data-cat="'+c[0]+'">'
      + '<div class="coll-img">'+jersey(rep)+'</div>'
      + '<div class="coll-body"><p class="coll-name">'+c[1]+'</p>'
      + '<p class="coll-count">'+items.length+(items.length===1?" camiseta":" camisetas")+'</p></div></button>';
  }).join("");
  box.querySelectorAll(".coll-tile").forEach(t => t.onclick = () => {
    activeCat = t.dataset.cat; renderFilters(); renderGrid();
    document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});
  });
}

$("searchInput").addEventListener("input", () => { toggleClear(); renderGrid(); });
$("sortSelect").addEventListener("change", renderGrid);
$("teamSelect").addEventListener("change", () => { filterTeam = $("teamSelect").value; renderGrid(); });
$("sizeSelect").addEventListener("change", () => { filterSize = $("sizeSelect").value; renderGrid(); });
$("filtersBtn").addEventListener("click", togglePanel);
$("searchClear").addEventListener("click", () => { $("searchInput").value = ""; toggleClear(); renderGrid(); $("searchInput").focus(); });
$("cartBtn").addEventListener("click", () => { renderCart(); $("cartDrawer").classList.add("open"); });
$("cartClose").addEventListener("click", () => $("cartDrawer").classList.remove("open"));
$("heroNewBtn").addEventListener("click", (e) => {
  e.preventDefault();
  $("sortSelect").value = "new"; renderGrid();
  document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});
});

/* Personalizador interactivo */
const CUST_MODELS = [
  {id:"blanca", label:"Blanca", base:"#f5f5f5", sleeve:"#f5f5f5", trim:"#111111", numColor:"#111111"},
  {id:"negra", label:"Negra", base:"#161616", sleeve:"#161616", trim:"#ffffff", numColor:"#ffffff"},
  {id:"roja", label:"Roja", base:"#da291c", sleeve:"#da291c", trim:"#ffffff", numColor:"#ffffff"},
  {id:"azul", label:"Azul", base:"#004d98", sleeve:"#004d98", trim:"#ffffff", numColor:"#ffffff"},
  {id:"amarilla", label:"Amarilla", base:"#ffdf00", sleeve:"#009b3a", trim:"#009b3a", numColor:"#009b3a"}
];
let custModel = CUST_MODELS[0], custSize = "M";
function jerseyBack(m, nm, num){
  const body = "M70 30 L50 40 L30 76 L56 90 L62 76 L62 176 Q62 184 70 184 L130 184 Q138 184 138 176 L138 76 L144 90 L170 76 L150 40 L130 30 Q118 46 100 46 Q82 46 70 30 Z";
  return '<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista previa de tu camiseta personalizada">'
    + '<path d="'+body+'" fill="'+m.base+'" stroke="rgba(0,0,0,.3)" stroke-width="2"/>'
    + '<path d="M50 40 L30 76 L56 90 L64 74 L64 50 Z" fill="'+m.sleeve+'"/>'
    + '<path d="M150 40 L170 76 L144 90 L136 74 L136 50 Z" fill="'+m.sleeve+'"/>'
    + '<path d="M82 32 Q100 48 118 32" fill="none" stroke="'+m.trim+'" stroke-width="5" stroke-linecap="round"/>'
    + '<text x="100" y="92" text-anchor="middle" font-family="'+FONT+'" font-size="16" font-weight="800" letter-spacing="3" textLength="70" lengthAdjust="spacingAndGlyphs" fill="'+m.numColor+'">'+(nm||"TU NOMBRE")+'</text>'
    + '<text x="100" y="150" text-anchor="middle" font-family="'+FONT+'" font-size="52" font-weight="900" fill="'+m.numColor+'">'+(num||"00")+'</text>'
    + '</svg>';
}
function renderCust(){
  $("custPreview").innerHTML = jerseyBack(custModel, $("custName").value.trim().toUpperCase(), $("custNum").value.trim());
  $("modelPills").innerHTML = CUST_MODELS.map(m =>
    '<button type="button" class="model-pill'+(m.id===custModel.id?" active":"")+'" data-model="'+m.id+'"><span class="dot" style="background:'+m.base+'"></span>'+m.label+'</button>').join("");
  document.querySelectorAll("#modelPills .model-pill").forEach(b => b.onclick = () => { custModel = CUST_MODELS.find(m=>m.id===b.dataset.model); renderCust(); });
  $("custSizes").innerHTML = SIZES.map(s =>
    '<button type="button" class="size-pill'+(s===custSize?" active":"")+'" data-size="'+s+'">'+s+'</button>').join("");
  document.querySelectorAll("#custSizes .size-pill").forEach(b => b.onclick = () => { custSize = b.dataset.size; renderCust(); });
}
$("custName").addEventListener("input", renderCust);
$("custNum").addEventListener("input", renderCust);
$("custOrder").addEventListener("click", () => {
  const nm = $("custName").value.trim().toUpperCase(), num = $("custNum").value.trim();
  if (!nm || !num){ toast("Escribe el nombre y el número"); return; }
  const msg = "Hola Futbeteo Store, quiero una camiseta personalizada:\n\n• Modelo " + custModel.label + " — Talla " + custSize + " — $50\n  Nombre: " + nm + " · Número: " + num + "\n\nSubtotal: $50";
  window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg), "_blank");
});
renderCust();


renderFilters();
renderTeamOptions();
renderCollections();
renderGrid();
renderCart();
saveCart();
