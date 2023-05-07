

window.onload = function () {
/*
  function pointToCircle(feature, latlng) { }
  */

  var mapObject = L.map('mapId').setView([35.1054, -106.6294], 13);

  var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
  });

  /* var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
             maxZoom: 17,
             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
         });
         OpenTopoMap.addTo(mapObject);*/


  Esri_WorldStreetMap.addTo(mapObject);

 

  //L.geoJson(nuevoMexico).addTo(mapObject);
  
  L.geoJson(newMexico).addTo(mapObject);

  
  /* start of choropleth attemp */
/*
  function getColor(d) {
    return d == "0" ? '#B3FF0F' :
      d == "1" ? '#BBE10F' :
        d == "2" ? '#C3C30F' :
          d == "3" ? '#CBA50F' :
            d == "4" ? '#D3870F' :
              d == "5" ? '#DB690F' :
                d == "6" ? '#E34B0F' :
                  d == "7" ? '#EB2D0F' :
                    '#F40F0F';
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties[simple_excede]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.simple_exceed)
    };
  }

  L.geoJson(simpleMexico, { style: style }).addTo(mapObject);
*/
  /* end of choropleth attempt */


  var marker = {
    radius: 10,
    fillColor: "	#40e0d0",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    /*  popup: "This is what it might say" */
  };



  L.geoJSON(justice, {
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.FID) {
        layer.bindPopup('<h3><p>Categories exceeded: ' + feature.properties["Total categories exceeded"] + '</h3><p>Population: ' + feature.properties["Total population"] + '</p>');
      }
    },

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, marker);
      /*  marker.bindPopup("Popup says this").openPopup() */
    },


  }).addTo(mapObject);







  /*var projection = d3.geoAlbersUSA()
    .translate([width / 2, height / 2])
    .scale([1000]);*/




};





