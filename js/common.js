// Futbeteo Store — código compartido por el catálogo (index.html) y la ficha del producto (producto.html).
// Se carga DESPUÉS de products.js y ANTES de app.js / producto.js.
const WA = "5358423238";
const SIZES = ["S","M","L","XL"];

// Única familia tipográfica del sitio (misma que el CSS: --font).
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

const $ = id => document.getElementById(id);
const money = n => "$" + n;

let cart = [];
try { cart = JSON.parse(localStorage.getItem("futbeteo_cart") || "[]"); } catch(e) { cart = []; }

function availSizes(p){ return p.sizes.filter(s => !(p.out||[]).includes(s)); }

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
    + '<text x="100" y="140" text-anchor="middle" font-family="'+FONT+'" font-size="46" font-weight="900" fill="'+p.numColor+'">'+p.num+'</text>'
    + '<text x="100" y="166" text-anchor="middle" font-family="'+FONT+'" font-size="10" font-weight="700" letter-spacing="2" textLength="68" lengthAdjust="spacingAndGlyphs" fill="'+p.numColor+'" opacity="0.85">'+p.team.toUpperCase().slice(0,18)+'</text>'
    + '</svg>';
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

/* Tarjeta de producto compartida (catálogo y relacionados). */
function cardHTML(p){
  return '<article class="card">'
    + '<a class="card-link" href="producto.html?id='+p.id+'" aria-label="'+p.name+'"><div class="card-img">'+jersey(p)+'</div></a>'
    + '<div class="card-body"><a class="card-link" href="producto.html?id='+p.id+'"><p class="card-name">'+p.name+'</p></a>'
    + '<p class="card-meta">'+p.team+' · '+p.season+'</p>'
    + '<p class="card-price">'+money(p.price)+(p.old?'<span class="price-old">'+money(p.old)+'</span>':'')+'</p></div>'
    + '<div class="card-foot"><button type="button" class="btn-add" onclick="quickAdd('+p.id+')">Añadir</button></div>'
    + '</article>';
}
/* Añadir rápido desde la tarjeta: primera talla disponible, sin nombre/número. */
function quickAdd(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if (!p) return;
  const size = availSizes(p)[0];
  if (!size){ toast("Sin tallas disponibles"); return; }
  addToCart(p, size, "", "", 1);
  toast(p.name+" añadida al pedido");
}

/* Menú móvil del header (ambas páginas). */
(function(){
  const t = $("navToggle"), n = $("mainNav");
  if (!t || !n) return;
  t.addEventListener("click", () => {
    const open = n.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });
  n.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    n.classList.remove("open");
    t.setAttribute("aria-expanded", "false");
  }));
})();
