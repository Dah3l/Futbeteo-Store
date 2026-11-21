// Futbeteo Store — portada (index.html). Usa js/common.js (WA, SIZES, $, money, cart, jersey, cardHTML).

/* Tira de colecciones: cada una lleva a su filtro en el catálogo aparte. */
function renderCollections(){
  const box = $("collGrid");
  if (!box) return;
  box.innerHTML = CATS.filter(c=>c[0]!=="all").map(c => {
    const items = PRODUCTS.filter(p=>p.cat===c[0]);
    const rep = items[0];
    return '<a class="cat-item" href="catalogo.html?cat='+c[0]+'">'
      + '<span class="cat-thumb">'+jersey(rep)+'</span>'
      + '<b>'+c[1]+'</b>'
      + '<span>'+items.length+(items.length===1?" camiseta":" camisetas")+'</span></a>';
  }).join("");
}

/* Destacados: los productos marcados como destacados. */
function renderFeatured(){
  const box = $("featuredGrid");
  if (!box) return;
  box.innerHTML = PRODUCTS.filter(p=>p.feat).map(p => cardHTML(p)).join("");
}

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

/* "Ver novedades" abre el catálogo aparte ordenado por novedades. */
$("heroNewBtn").addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "catalogo.html?orden=novedades";
});

renderCollections();
renderFeatured();
renderCust();
renderCart();
saveCart();
