const WA = "5358423238";
const SIZES = ["S","M","L","XL"];

const $ = id => document.getElementById(id);
const money = n => "$" + n;
let cart = [];
try { cart = JSON.parse(localStorage.getItem("futbeteo_cart") || "[]"); } catch(e) { cart = []; }
let activeCat = "all", currentProduct = null, selSize = null, selQty = 1;

function jersey(p){
  const body = "M70 30 L50 40 L30 76 L56 90 L62 76 L62 176 Q62 184 70 184 L130 184 Q138 184 138 176 L138 76 L144 90 L170 76 L150 40 L130 30 Q118 46 100 46 Q82 46 70 30 Z";
  let extra = "";
  if (p.stripe) extra += '<rect x="62" y="98" width="76" height="12" fill="#ffffff" opacity="0.9"/>';
  if (p.vstripes) extra += '<rect x="80" y="60" width="11" height="124" fill="'+p.trim+'"/><rect x="96" y="60" width="11" height="124" fill="'+p.trim+'"/><rect x="112" y="60" width="11" height="124" fill="'+p.trim+'"/>';
  return '<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+p.name+'">'
    + '<path d="'+body+'" fill="'+p.base+'" stroke="rgba(0,0,0,.3)" stroke-width="2"/>'
    + '<path d="M50 40 L30 76 L56 90 L64 74 L64 50 Z" fill="'+p.sleeve+'"/>'
    + '<path d="M150 40 L170 76 L144 90 L136 74 L136 50 Z" fill="'+p.sleeve+'"/>'
    + '<path d="M82 32 Q100 48 118 32" fill="none" stroke="'+p.trim+'" stroke-width="5" stroke-linecap="round"/>'
    + extra
    + '<text x="100" y="140" text-anchor="middle" font-family="Arial,sans-serif" font-size="46" font-weight="900" fill="'+p.numColor+'">'+p.num+'</text>'
    + '<text x="100" y="166" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="'+p.numColor+'" opacity="0.85">'+p.team.toUpperCase().slice(0,18)+'</text>'
    + '</svg>';
}

function availSizes(p){ return p.sizes.filter(s => !(p.out||[]).includes(s)); }

function renderFilters(){
  $("filters").innerHTML = CATS.map(c =>
    '<button type="button" class="chip'+(activeCat===c[0]?" active":"")+'" data-cat="'+c[0]+'">'+c[1]+'</button>').join("");
  document.querySelectorAll(".chip").forEach(ch => ch.onclick = () => { activeCat = ch.dataset.cat; renderFilters(); renderGrid(); });
}

function filtered(){
  const q = $("searchInput").value.trim().toLowerCase();
  let list = PRODUCTS.filter(p => (activeCat==="all" || p.cat===activeCat)
    && (!q || (p.name+" "+p.team+" "+p.league).toLowerCase().includes(q)));
  const s = $("sortSelect").value;
  if (s==="low") list = [...list].sort((a,b)=>a.price-b.price);
  if (s==="high") list = [...list].sort((a,b)=>b.price-a.price);
  if (s==="feat") list = [...list].sort((a,b)=>(b.feat||0)-(a.feat||0));
  return list;
}

function renderGrid(){
  const list = filtered();
  $("resultCount").textContent = list.length + (list.length===1 ? " camiseta" : " camisetas");
  if (!list.length){ $("grid").innerHTML = '<p class="empty">No encontramos esa camiseta. Prueba con otro equipo o quita el filtro.</p>'; return; }
  $("grid").innerHTML = list.map(p =>
    '<article class="card" tabindex="0" role="button" aria-label="'+p.name+' '+money(p.price)+'" onclick="openProduct('+p.id+')" onkeydown="if(event.key===\'Enter\')openProduct('+p.id+')">'
    + '<div class="card-img">'+jersey(p)+'</div>'
    + '<p class="card-name">'+p.name+'</p>'
    + '<p class="card-price">'+money(p.price)+(p.old?'<span class="price-old">'+money(p.old)+'</span>':'')+'</p>'
    + '</article>').join("");
}

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2200);
}

function saveCart(){
  localStorage.setItem("futbeteo_cart", JSON.stringify(cart));
  const n = cart.reduce((a,i)=>a+i.qty,0);
  $("cartCount").style.display = n ? "grid" : "none";
  $("cartCount").textContent = n;
}

function addToCart(p, size, nm, num, qty){
  qty = qty || 1;
  const key = i => i.id===p.id && i.size===size && i.name===nm && i.num===num;
  const ex = cart.find(key);
  if (ex) ex.qty += qty;
  else cart.push({id:p.id, size:size, name:nm||"", num:num||"", qty:qty});
  saveCart(); renderCart();
}

function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  currentProduct = p;
  selSize = availSizes(p)[1] || availSizes(p)[0];
  selQty = 1;
  const isPers = p.cat==="pers";
  const catName = (CATS.find(c=>c[0]===p.cat)||[])[1] || p.cat;
  $("productSheet").innerHTML =
    '<button type="button" class="sheet-close" onclick="closeProduct()">✕</button>'
    + '<div class="sheet-img">'+jersey(p)+'</div>'
    + '<p class="sheet-meta">'+catName+' · '+p.season+' · '+p.league+'</p>'
    + '<h2>'+p.name+'</h2>'
    + '<p class="sheet-price">'+money(p.price)+(p.old?'<span class="price-old">'+money(p.old)+'</span>':'')+'</p>'
    + '<hr class="sheet-div">'
    + '<div class="field"><label>Talla</label><div class="size-pills" id="sizePills">'
    + p.sizes.map(s => {
        const out = (p.out||[]).includes(s);
        return '<button type="button" class="size-pill'+(s===selSize?" active":"")+(out?" out":"")+'" data-size="'+s+'" '+(out?"disabled":"")+'>'+s+'</button>';
      }).join("") + '</div>'
    + '<details class="guide"><summary>Guía de tallas</summary><table><tr><th>Talla</th><th>Pecho (cm)</th><th>Largo (cm)</th></tr>'
    + '<tr><td>S</td><td>50</td><td>68</td></tr><tr><td>M</td><td>53</td><td>70</td></tr>'
    + '<tr><td>L</td><td>56</td><td>72</td></tr><tr><td>XL</td><td>59</td><td>74</td></tr></table>'
    + '<p style="margin-top:6px">Medidas aproximadas de la camiseta extendida. Si estás entre dos tallas, te recomendamos la mayor.</p></details></div>'
    + '<div class="field"><label>Nombre en la espalda '+(isPers?"(obligatorio)":"(opcional)")+'</label>'
    + '<input id="persName" type="text" maxlength="12" placeholder="Ej: DAHEL"></div>'
    + '<div class="field"><label>Número en la espalda '+(isPers?"(obligatorio)":"(opcional)")+'</label>'
    + '<input id="persNum" type="text" maxlength="2" inputmode="numeric" placeholder="Ej: 10"></div>'
    + '<div class="field"><label>Cantidad</label><div class="qty-stepper"><button type="button" id="qtyMinus" aria-label="Quitar uno">−</button><b id="qtyVal">1</b><button type="button" id="qtyPlus" aria-label="Agregar uno">+</button></div></div>'
    + '<div class="modal-actions"><button type="button" class="btn-add" onclick="addFromSheet()">Añadir al pedido</button>'
    + '<button type="button" class="btn btn-wa" onclick="orderDirect()">Pedir por WhatsApp</button></div>'
    + '<p class="cond">'+p.cond+'</p>'
    + '<p class="sheet-ship">Envíos a todo el país · Recogida en Miramar</p>';
  document.querySelectorAll("#sizePills .size-pill").forEach(b => b.onclick = () => {
    selSize = b.dataset.size;
    document.querySelectorAll("#sizePills .size-pill").forEach(x=>x.classList.toggle("active", x===b));
  });
  $("qtyMinus").onclick = () => { selQty = Math.max(1, selQty-1); $("qtyVal").textContent = selQty; };
  $("qtyPlus").onclick = () => { selQty = Math.min(10, selQty+1); $("qtyVal").textContent = selQty; };
  $("productOverlay").classList.add("open");
}

function closeProduct(){ $("productOverlay").classList.remove("open"); }
function persVals(){
  return { nm: ($("persName")?$("persName").value.trim().toUpperCase():""),
           num: ($("persNum")?$("persNum").value.trim():"") };
}
function addFromSheet(){
  const v = persVals();
  if (currentProduct.cat==="pers" && (!v.nm || !v.num)){ toast("Escribe el nombre y el número"); return; }
  addToCart(currentProduct, selSize, v.nm, v.num, selQty);
  closeProduct(); toast(currentProduct.name+" añadida al pedido");
}
function orderDirect(){
  const v = persVals();
  if (currentProduct.cat==="pers" && (!v.nm || !v.num)){ toast("Escribe el nombre y el número"); return; }
  const items = [{id:currentProduct.id, size:selSize, name:v.nm, num:v.num, qty:selQty}];
  openWa(items, "", "");
}
function itemLine(i){
  const p = PRODUCTS.find(x=>x.id===i.id);
  let line = "• "+p.name+" — Talla "+i.size+" — "+money(p.price);
  if (i.qty>1) line += " x"+i.qty+" = "+money(p.price*i.qty);
  if (i.name || i.num) line += "\n  Nombre: "+(i.name||"—")+" · Número: "+(i.num||"—");
  return line;
}
function buildMsg(items, province, client){
  const total = items.reduce((a,i)=>a+PRODUCTS.find(x=>x.id===i.id).price*i.qty,0);
  let msg = "Hola Futbeteo Store, quiero hacer un pedido:\n\n" + items.map(itemLine).join("\n") + "\n\nSubtotal: "+money(total);
  if (province) msg += "\nEnvío a: "+province;
  if (client) msg += "\nNombre: "+client;
  return msg;
}
function openWa(items, province, client){
  window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(buildMsg(items, province, client)), "_blank");
}

function renderCart(){
  const body = $("cartBody"), foot = $("cartFoot");
  if (!cart.length){
    body.innerHTML = '<p style="color:var(--muted);text-align:center;padding:30px 0">Tu pedido está vacío.<br>Explora el catálogo y añade tus camisetas favoritas.</p>';
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = cart.map((i,idx) => {
    const p = PRODUCTS.find(x=>x.id===i.id);
    return '<div class="cart-item"><div class="thumb">'+jersey(p)+'</div><div>'
      + '<h4>'+p.name+'</h4><p>Talla '+i.size+' · '+money(p.price)+'</p>'
      + ((i.name||i.num) ? '<p>Nombre: '+(i.name||"—")+' · N.º '+(i.num||"—")+'</p>' : '')
      + '<div class="qty"><button type="button" onclick="chQty('+idx+',-1)">−</button><b>'+i.qty+'</b>'
      + '<button type="button" onclick="chQty('+idx+',1)">+</button>'
      + '<button type="button" class="rm" onclick="rmItem('+idx+')">Quitar</button></div>'
      + '</div></div>';
  }).join("");
  const total = cart.reduce((a,i)=>a+PRODUCTS.find(x=>x.id===i.id).price*i.qty,0);
  foot.innerHTML =
    '<div class="field"><label>Tu nombre</label><input id="clientName" type="text" placeholder="Ej: Dahel"></div>'
    + '<div class="field"><label>Provincia de envío</label><select id="provinceSel">'
    + PROVINCES.map(pr=>'<option'+(pr==="La Habana"?" selected":"")+'>'+pr+'</option>').join("") + '</select></div>'
    + '<div class="total-row"><span>Total</span><span>'+money(total)+'</span></div>'
    + '<p style="font-size:13px;color:var(--muted);margin-bottom:12px">El costo del envío se coordina por WhatsApp según la provincia.</p>'
    + '<button type="button" class="btn btn-wa" style="width:100%" onclick="checkout()">Pedir por WhatsApp</button>';
}
function chQty(idx, d){
  cart[idx].qty += d;
  if (cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart(); renderCart();
}
function rmItem(idx){ cart.splice(idx,1); saveCart(); renderCart(); }
function checkout(){
  if (!cart.length) return;
  const province = $("provinceSel") ? $("provinceSel").value : "";
  const client = $("clientName") ? $("clientName").value.trim() : "";
  openWa(cart, province, client);
}

$("searchInput").addEventListener("input", renderGrid);
$("sortSelect").addEventListener("change", renderGrid);
$("cartBtn").addEventListener("click", () => { renderCart(); $("cartDrawer").classList.add("open"); });
$("cartClose").addEventListener("click", () => $("cartDrawer").classList.remove("open"));
$("productOverlay").addEventListener("click", e => { if (e.target === $("productOverlay")) closeProduct(); });

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
    + '<text x="100" y="92" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="800" letter-spacing="3" fill="'+m.numColor+'">'+(nm||"TU NOMBRE")+'</text>'
    + '<text x="100" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="900" fill="'+m.numColor+'">'+(num||"00")+'</text>'
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
renderGrid();
renderCart();
saveCart();
