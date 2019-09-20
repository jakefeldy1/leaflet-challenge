// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
      
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, circles) {
      return L.circleMarker(circles, {
        color: givemecolor(feature.properties.mag),
        radius: feature.properties.mag*7,
        fillOpacity: 0.25
      })
    },
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// function for colors
function givemecolor(mag) { 
  if (mag >= 5) {
    return "red"}
  else if (mag >= 4) {
    return "orange"}
  else if (mag >= 3) {
    return "limegreen"}
  else if (mag >= 2) {
    return "lime"}
  else if (mag >= 1) {
    return "lightgreen"}
  else if (mag >= 0) {
    return "yellow"}
}  

// creating legend
function addLegend(map) {
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'legend');
  labels = [],
  labels1 = ['0-1', '1-2','2-3','3-4','4-5','5+'];
  
  for (var i = 0; i < labels1.length; i++) {

    div.innerHTML +=
    '<i style="background:' + givemecolor(i) + '"></i> ' +
     '<span>'+ labels1[i] +'</span>' + '<br>' ;
      
      }
  return div;
  };
  legend.addTo(map);
}

function createMap(earthquakes) {

  // Define streetmap
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var mymap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(mymap);
  addLegend(mymap);
}