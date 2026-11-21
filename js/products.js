// Catálogo de Futbeteo Store — datos de muestra.
// Al lanzar: reemplazar por las fotos y precios reales.
const CATS = [
  ["all","Todos"],["actual","Actuales"],["retro","Retro"],["pers","Personalizadas"],
  ["beisbol","Béisbol"],["basket","Basketball"],["nfl","NFL"],["f1","Fórmula 1"]
];
const PROVINCES = ["La Habana","Pinar del Río","Artemisa","Mayabeque","Matanzas","Villa Clara","Sancti Spíritus","Camagüey","Holguín","Santiago de Cuba","Otra"];

// Catálogo de MUESTRA — al lanzar se reemplaza por las fotos y precios reales.
const PRODUCTS = [
  {id:1, name:"Real Madrid Local 2024-25", team:"Real Madrid", season:"2024-25", cat:"actual", league:"La Liga", price:45, base:"#f5f5f5", sleeve:"#f5f5f5", trim:"#c8a96a", num:"7", numColor:"#c8a96a", sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:1},
  {id:2, name:"FC Barcelona Local 2024-25", team:"FC Barcelona", season:"2024-25", cat:"actual", league:"La Liga", price:45, base:"#a50044", sleeve:"#004d98", trim:"#ffffff", num:"10", numColor:"#ffffff", sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:1},
  {id:3, name:"Argentina Local 2024", team:"Argentina", season:"2024", cat:"actual", league:"Selecciones", price:40, base:"#75aadb", sleeve:"#75aadb", trim:"#ffffff", num:"10", numColor:"#ffffff", stripe:true, sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:0},
  {id:4, name:"Manchester United Retro 1998-99", team:"Manchester United", season:"1998-99", cat:"retro", league:"Premier League", price:55, old:70, base:"#da291c", sleeve:"#da291c", trim:"#ffffff", num:"7", numColor:"#ffffff", sizes:["S","M","L"], out:["M"], cond:"Retro original · Estado muy bueno · Una sola unidad por talla", feat:1},
  {id:5, name:"Brasil Retro 1994", team:"Brasil", season:"1994", cat:"retro", league:"Selecciones", price:50, base:"#ffdf00", sleeve:"#009b3a", trim:"#009b3a", num:"10", numColor:"#009b3a", sizes:["M","L","XL"], cond:"Retro original · Estado muy bueno · Una sola unidad por talla", feat:1},
  {id:6, name:"AC Milan Retro 1989-90", team:"AC Milan", season:"1989-90", cat:"retro", league:"Serie A", price:55, base:"#111111", sleeve:"#111111", trim:"#e2001a", num:"3", numColor:"#ffffff", vstripes:true, sizes:["S","M","L","XL"], cond:"Retro original · Estado muy bueno · Una sola unidad por talla", feat:0},
  {id:7, name:"Camiseta Personalizada", team:"Tu equipo favorito", season:"A tu gusto", cat:"pers", league:"Personalizada", price:50, base:"#14201a", sleeve:"#14201a", trim:"#00e676", num:"?", numColor:"#00e676", sizes:["S","M","L","XL"], cond:"Por encargo · Elige modelo, nombre y número", feat:1},
  {id:8, name:"Los Angeles Lakers", team:"LA Lakers", season:"2024-25", cat:"basket", league:"NBA", price:40, base:"#552583", sleeve:"#552583", trim:"#fdb927", num:"23", numColor:"#fdb927", sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:0},
  {id:9, name:"New York Yankees", team:"NY Yankees", season:"2024", cat:"beisbol", league:"MLB", price:38, base:"#f5f5f5", sleeve:"#f5f5f5", trim:"#0c2340", num:"27", numColor:"#0c2340", sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:0},
  {id:10, name:"Dallas Cowboys", team:"Dallas Cowboys", season:"2024", cat:"nfl", league:"NFL", price:42, base:"#003594", sleeve:"#003594", trim:"#ffffff", num:"88", numColor:"#ffffff", sizes:["M","L","XL"], cond:"Nueva · Original", feat:0},
  {id:11, name:"Ferrari F1", team:"Scuderia Ferrari", season:"2025", cat:"f1", league:"Fórmula 1", price:45, base:"#dc0000", sleeve:"#dc0000", trim:"#111111", num:"16", numColor:"#ffffff", sizes:["S","M","L","XL"], cond:"Nueva · Original", feat:0}
];
