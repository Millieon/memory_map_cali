


//Access token
const access_key = 'pk.eyJ1IjoibWlsbGllb24iLCJhIjoiY2xkdXU0NjFqMDlobjN2bWZxejZvam9qcyJ9.WLbCBeUxcPUyYl2jFw8JPw';
//Mapbox style
const style = "mapbox://styles/millieon/clduuehey003r01taidqu3xm1";


// Options for map
const options = {
  lat: 37.4418834,
  lng: -122.1430195,
  zoom: 5,
  style: style,
};

// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', access_key);
var myMap;
var data;
let cali;
var icon;
var font;
var iconWidth = 10;
var iconHeight = 10;
var poiPoints = [];
let pg;

//
function preload() {
  data = loadJSON("assets/data.json");
  //cali=loadJSON("assets/csvjson.json");
  
  icon = loadImage("assets/icon.png");
  font = loadFont("assets/Khmer Sangam MN.ttf");
}

function setup() {
 
  canvas = createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth/4, windowHeight);

  

  
  fetch("assets/csvjson.json").then(function(response) {
    return response.json();
  }).then(function(data) {

    //console.log(data);
    
    cali= data;


    //using no Loop? you can just call your function once the data is loaded
    
  
  }).catch(function(err) {
    console.log(`Something went wrong: ${err}`);
  });

  // Create a tile map and overlay the canvas.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

}

var loaded = false;

function draw() {



 clear();
  if (myMap.ready && !loaded) {
    loadPoiCoord();
  }

  if (loaded) {
    
    for(let i=0; i<poiPoints.length; i++){
      
      var pos = myMap.latLngToPixel(poiPoints[i].lat, poiPoints[i].lng);
      
      poiPoints[i].updatePos(pos.x,pos.y, myMap.zoom());
      poiPoints[i].over(mouseX,mouseY,myMap.zoom()+1);
      poiPoints[i].show();      
      
    }
  }
//image(pg,windowWidth/2,0);
 
  
}


function loadPoiCoord() {

  var pois = data['features']; // Create an object that contains the features. 

 
    //iterate trough the pois object. If it contains a PoI transform the latitude and longitude to pixels, and create a new instance of the class PoI
    for (let i = 0; i <cali.length; i++) {

      
      let item = cali[i];
     
      let location=item.location;
      let Note=item.Note;
      let Title=item.Title;

      location=location.replace("'lat':",'' ).replace("'lng':",'' ).replace('{','').replace('}','');
      let splitString = split(location, ',');
      var lat=float(splitString[0]);
      var long=float(splitString[1]);
     
  
        var pos = myMap.latLngToPixel(lat, long);
        
  
        // Creates an instance of PoI with the position data of every point fro the data 
        var poi = new PoI(
          //lat, lng, x, y, w, h, title
          lat,
          long,
          pos.x,
          pos.y,
          iconWidth,
          iconHeight,
          Note
        );
  
        poiPoints.push(poi);
        console.log(poiPoints);
      loaded = true;
   
    }
 


//   //iterate trough the pois object. If it contains a PoI transform the latitude and longitude to pixels, and create a new instance of the class PoI
//   for (let i = 0; i < pois.length; i++) {

//     if (pois[i].properties.PoI) {

//       var pos = myMap.latLngToPixel(pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]);
// //console.log(pois[i].geometry.coordinates[1]);
//       // Creates an instance of PoI with the position data of every point fro the data 
//       var poi = new PoI(
//         //lat, lng, x, y, w, h, title
//         pois[i].geometry.coordinates[1],
//         pois[i].geometry.coordinates[0],
//         pos.x,
//         pos.y,
//         iconWidth,
//         iconHeight,
//         pois[i].properties.PoI
        
//       );
//       console.log(poiPoints);

//       poiPoints.push(poi);
//     }
//     loaded = true;
//   }
}