// Futbeteo Store — ficha del producto (producto.html?id=N). Usa js/common.js.
let currentProduct = null, selSize = null, selQty = 1;

function catName(p){ return (CATS.find(c=>c[0]===p.cat)||[])[1] || p.cat; }

function renderDetail(){
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = PRODUCTS.find(x=>x.id===id);
  const box = $("detail");
  if (!p){
    document.title = "Camiseta no encontrada — Futbeteo Store";
    box.innerHTML = '<p class="empty">Esa camiseta no existe o ya no está disponible.</p>'
      + '<p style="text-align:center"><a class="btn btn-green" href="index.html">Volver al catálogo</a></p>';
    $("relatedSec").hidden = true;
    return;
  }
  currentProduct = p;
  selSize = availSizes(p)[1] || availSizes(p)[0];
  selQty = 1;
  const isPers = p.cat==="pers";
  document.title = p.name+" — Futbeteo Store";
  box.innerHTML =
    '<nav class="crumbs"><a href="index.html">Inicio</a> <span>/</span> <a href="index.html#catalogo">'+catName(p)+'</a> <span>/</span> <b>'+p.name+'</b></nav>'
    + '<div class="detail">'
    + '<div class="detail-img">'+jersey(p)+'</div>'
    + '<div class="detail-info">'
    + '<p class="detail-meta">'+catName(p)+' · '+p.season+' · '+p.league+'</p>'
    + '<h1>'+p.name+'</h1>'
    + '<p class="detail-price">'+money(p.price)+(p.old?'<span class="price-old">'+money(p.old)+'</span>':'')+'</p>'
    + '<hr class="detail-div">'
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
    + '<div class="detail-actions"><button type="button" class="btn-add" id="addBtn">Añadir al pedido</button>'
    + '<button type="button" class="btn btn-wa" id="waBtn">Pedir por WhatsApp</button></div>'
    + '<p class="cond">'+p.cond+'</p>'
    + '<p class="detail-ship">Envíos a todo el país · Recogida en Miramar</p>'
    + '</div></div>';
  document.querySelectorAll("#sizePills .size-pill").forEach(b => b.onclick = () => {
    selSize = b.dataset.size;
    document.querySelectorAll("#sizePills .size-pill").forEach(x=>x.classList.toggle("active", x===b));
  });
  $("qtyMinus").onclick = () => { selQty = Math.max(1, selQty-1); $("qtyVal").textContent = selQty; };
  $("qtyPlus").onclick = () => { selQty = Math.min(10, selQty+1); $("qtyVal").textContent = selQty; };
  $("addBtn").onclick = addFromDetail;
  $("waBtn").onclick = orderDirect;
  renderRelated(p);
}

function persVals(){
  return { nm: ($("persName")?$("persName").value.trim().toUpperCase():""),
           num: ($("persNum")?$("persNum").value.trim():"") };
}
function addFromDetail(){
  const v = persVals();
  if (currentProduct.cat==="pers" && (!v.nm || !v.num)){ toast("Escribe el nombre y el número"); return; }
  addToCart(currentProduct, selSize, v.nm, v.num, selQty);
  toast(currentProduct.name+" añadida al pedido");
}
function orderDirect(){
  const v = persVals();
  if (currentProduct.cat==="pers" && (!v.nm || !v.num)){ toast("Escribe el nombre y el número"); return; }
  const items = [{id:currentProduct.id, size:selSize, name:v.nm, num:v.num, qty:selQty}];
  openWa(items, "", "");
}

function renderRelated(p){
  const rel = PRODUCTS.filter(x => x.cat===p.cat && x.id!==p.id).slice(0,4);
  if (!rel.length){ $("relatedSec").hidden = true; return; }
  $("relatedGrid").innerHTML = rel.map(x => cardHTML(x)).join("");
}

$("cartBtn").addEventListener("click", () => { renderCart(); $("cartDrawer").classList.add("open"); });
$("cartClose").addEventListener("click", () => $("cartDrawer").classList.remove("open"));

renderDetail();
renderCart();
saveCart();
