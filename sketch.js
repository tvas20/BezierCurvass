function setup() {
  createCanvas(400, 400);
}

var nivel;
var lista = [];
var n;

function draw() {
    background(55);
    nivel = document.getElementById("resultado").innerHTML = document.getElementById("qtd").value;
  
  /*desenha os pontos*/
  for(i = 0; i < lista.length; i++){
    var cor = (100);
    //console.log(cor);
    stroke('white');
    strokeWeight(5);
    point(lista[i][0],lista[i][1]);
    if((i < (lista.length - 1))){
      strokeWeight(1);
      /*desenha as poligonais*/
      line(lista[i][0],lista[i][1],lista[i+1][0],lista[i+1][1]);}
      if(lista.length >  2){
        strokeWeight(1);
        var j = 0;
        while(j < n.length-1){
          line(n[j][0], n[j][1], n[j+1][0], n[j+1][1]);
          j++;
        }
        //acerto do ultimo ponto
        line(n[n.length-1][0], n[n.length-1][1], lista[lista.length-1][0], lista[lista.length-1][1]);
        }
          
        
        }
       
}
function bezC(){
  n = deCasteljau(lista, document.getElementById("qtd").value);
}
function mouseClicked(){
  /*console.log(lista);*/
  mx = mouseX;
  my = mouseY;
  /*checa se esta dentro do campo de desenho*/
  if(mx < 400 && my < 400){
    lista.push([mx, my]);
    if(lista.length > 2){
    n = deCasteljau(lista, nivel);}
  }
}

function mostrarResult(){
    let element = document.getElementById("corCurva");
    if( element.style.backgroundColor== 'blue'){
            document.getElementById("corCurva").innerHtml = element.style.backgroundColor= 'red';
    }
    else{
      document.getElementById("corCurva").innerHtml = element.style.backgroundColor= 'blue';
    }
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
      
      /*stroke("red");
      point(aux[0],aux[1]);*/
    }
    /*console.log(controls[0][0]);*/
    result.push(controls[0]);
  }
  console.log(result);
  return result;
}
















