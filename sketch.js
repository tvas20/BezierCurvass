//tamanho da tela
var wid = 400;
var hei = 400;

//Variaveis do codigo
var onCurvas = true;
var onPoligon = true;
var onPontos = true;
var atual = 0;
var nivel;
var deleta = false;
let element = document.getElementById("corCurva");//cor do seletor
var funfa = false;

//interacao de botoes
(document.getElementById("Clear")).addEventListener("click", limpar); //CLEAR
(document.getElementById("Add")).addEventListener("click", addCurva); //ADD
(document.getElementById("Del")).addEventListener("click", function(){
  deleta = true;
}); //DEL
(document.getElementById("DelCur")).addEventListener("click", function(){
  var lista = estruturas.curvas[atual];
  if(estruturas.quantidade > 0){
    estruturas.quantidade--;
    var corAtual = lista.cor;
    cores.splice(atual, 1);
    cores.push(corAtual);
    estruturas.curvas.splice(atual, 1);
    if(atual != 0){
       atual--;
    }
    muda();
  }
}); //DEL

//interacao checkboxes
document.getElementById("Curvas").addEventListener("change", function(){ 
  if(this.checked){
    onCurvas = true;
  }else{
    onCurvas = false;
  }
});
document.getElementById("Poligon").addEventListener("change", function(){
  if(this.checked){
    onPoligon = true;
  }else{
    onPoligon = false;
  }
});
document.getElementById("Pontos").addEventListener("change", function(){
  if(this.checked){
    onPontos = true;
  }else{
    onPontos = false;
  }
});

//Paleta de cores
var cores = [
  'rgba(255,0,0,1)',
  'rgba(0,255,0,1)',
  'rgba(0,0,255,1)',
  'rgba(255,255,0,1)',
  'rgba(255,0,255,1)',
  'rgba(0,255,255,1)',
  'rgba(125,255,125,1)',
  'rgba(255,125,125,1)',
  'rgba(125,125,255,1)',
  'rgba(255,255,255,1)'
];

function setup() {
  createCanvas(wid, hei);
}

function draw() {
  background(55);
  muda();
  if(onPontos){
    var i = 0;
    for(i=0;i<estruturas.quantidade;i++){
      drawPoints(i);
    }
  }
  if(onPoligon){
    var i =0;
    for(i=0;i<estruturas.quantidade;i++){
      drawPoligon(i);
    }
  }
  if(onCurvas){
    var i = 0;
    for(i=0;i<estruturas.quantidade;i++){
      drawCurva(i);
    }
  }
  
}

//Classe das curvas
class TodasCurvas{
  constructor(){
    this.curvas = [];
    this.quantidade = 0;
  }
}

class curvaBezier{
  constructor(){
    this.points = [];
    this.cor = null;
  }
}

//Inicia Objeto de todas estruturas
let estruturas = new TodasCurvas();

function proximo(lista, xi, yi){
  var i = 0;
  for(i=0; i < lista.points.length; i++){
    if(dist(xi,yi,lista.points[i][0],lista.points[i][1]) < 20){
      return i;
    }
  }
  return false;
}

function longe(lista, xi, yi){
  var i = 0;
  for(i=0; i < lista.points.length; i++){
    if(dist(xi,yi,lista.points[i][0],lista.points[i][1]) < 20){
      return false;
    }
  }
  return true;
}

function mouseClicked(){
  mx = mouseX;
  my = mouseY;
  if(estruturas.quantidade > 0){
    var lista = (estruturas.curvas)[atual];
    var distancia = longe(lista, mx, my);
    if((mx < 400 && my < 400) && deleta){
      var local = proximo(lista, mx, my);
      if(local !== false){
        deletar(local);
      }
      deleta = false;
    }else if((mx < 400 && my < 400) && estruturas.quantidade > 0 && distancia){
      (lista.points).push([mx, my]);
    }
  }
}

function mousePressed(){
  var lista = estruturas.curvas[atual];
  if(estruturas.quantidade > 0 && lista.points.length > 0){
    funfa = proximo(estruturas.curvas[atual],mouseX,mouseY);
  }
}
function mouseDragged(){ 
    if(funfa !== false){
      estruturas.curvas[atual].points[funfa][0] = mouseX;
      estruturas.curvas[atual].points[funfa][1] = mouseY;
      drawPoints(atual);
      drawPoligon(atual);
      drawCurva(atual);
    } 
}

function mouseReleased(){
  funfa = false;
}
function limpar(){
  deleta = false;
  atual = 0;
  estruturas.quantidade = 0;
  estruturas.curvas = [];
  muda();
}

function addCurva(){
  deleta = false;
  let curvaAtual = new curvaBezier();
  (estruturas.curvas).push(curvaAtual);
  estruturas.quantidade++;
  curvaAtual.cor = cores[estruturas.quantidade-1];
  atual = estruturas.quantidade-1;
  muda();
}

function deletar(coord){
  deleta = false;
  var lista = estruturas.curvas[atual].points;
  if(lista.length == 1){
    (estruturas.curvas).splice(atual,1);
    estruturas.quantidade--;
    if(atual != 0){
      atual--;
    }
  }else{
    lista.splice(coord,1);
  }  
}

function drawCurva(i){
  var lista = (estruturas.curvas)[i];
  if((lista.points).length > 2){
    stroke(lista.cor);
    strokeWeight(1);
    lista.cur = deCasteljau(lista.points, nivel);
    for(j=0;j < lista.cur.length-1;j++){
      line(lista.cur[j][0], lista.cur[j][1], lista.cur[j+1][0], lista.cur[j+1][1]);
    }
    //acerto do ultimo ponto
    line(lista.cur[lista.cur.length-1][0], lista.cur[lista.cur.length-1][1], lista.points[lista.points.length-1][0], lista.points[lista.points.length-1][1]);
  }
}

function drawPoligon(i){
  var lista = (estruturas.curvas)[i];
  if((lista.points).length > 1){
    stroke(lista.cor);
    strokeWeight(1);
    for(j=0;j<(lista.points).length-1;j++){
      line(lista.points[j][0],lista.points[j][1],lista.points[j+1][0],lista.points[j+1][1]);
    }
  }
}

function drawPoints(i){
  var lista = (estruturas.curvas)[i];
  stroke(lista.cor);
  strokeWeight(5);
  for(j=0;j<(lista.points).length;j++){
    point(lista.points[j][0],lista.points[j][1]);
  }
}

function muda(){
  nivel = document.getElementById("resultado").innerHTML = document.getElementById("qtd").value;
  if(estruturas.quantidade > 0){
    document.getElementById("corCurva").innerHtml = element.style.backgroundColor= cores[atual];
  }else{
    document.getElementById("corCurva").innerHtml = element.style.backgroundColor= 'rgba(0,0,0,0)';
  }
}

function seletor(){
  if(atual == estruturas.quantidade-1){
    atual = 0;
  }else{
    atual++;
  }
  muda();
}

function interpolate(t, p0, p1){
  return [((1-t) * p0[0] )+ (t * p1[0]),((1-t)*p0[1] )+ (t *p1[1])];
}

function deCasteljau(points, nEvaluations){
  if(points === undefined || points.length < 1){
    return [];
  }
  result = [];
  start = points[0];
  for (let t = 0; t <= 1; t+=1 / nEvaluations){ 
    controls = points;
    while (controls.length > 1){
      aux = [];
      for(i = 0; i < controls.length - 1; i++){
        aux[i] = interpolate(t, controls[i], controls[i+1]);
      }
      controls = aux;
    }
    result.push(controls[0]);
  }
  return result;
}