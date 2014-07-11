$( document ).ready(function() {
    var max, scale, color,
          classes = 5,
          numColors = classes + 1,
          scheme = colorbrewer["YlOrRd"][numColors],
          container = L.DomUtil.get('users'),
          map = L.map('users').setView([32.0, 35.56], 8);

          

          // generate dummy users
          var users = getUsers(100);


          //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            L.mapbox.tileLayer('gil.ino4p7nh', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Async call for data. Source URL is loaded from container element's
          // 'data-source' attribute.

           d3.json(container.dataset.source, function(collection) {

            //console.log('collection', collection)
          //     // When data arrives, create leaflet layer with custom style callback.
              L.hexLayer(users, {
                  applyStyle: hex_style
              }).addTo(map);
           });

          
           
          
        /**
       * Hexbin style callback.
       *
       * Determines a quantize scale (http://bl.ocks.org/4060606) based on the
       * map's initial data density (which is based on the initial zoom level)
       * and applies a colorbrewer (http://colorbrewer2.org/) colour scheme
       * accordingly.
       */
      
            //.range(["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d", '#a63603']);

      function hex_style(hexagons) {
        //console.log('hexagons', hexagons, hexagons.data());
            if (!(max && scale)) {
                max = d3.max(hexagons.data(), function (d) { return d.value; });

                // create the threshold domain
                var thresholdDomain = [];
                for (var i=0; i<classes; ++i) {
                    thresholdDomain.push( (i + 1) * max / numColors);
                }

                scale = d3.scale.quantize()
                        .domain([0, max])
                        .range(d3.range(classes));

               color = d3.scale.threshold()
                          .domain(thresholdDomain)
                          .range(scheme);

                    
                createLegend();
          }

          // Maintain a density scale relative to initial zoom level.
          
          hexagons
              .attr("stroke", scheme[classes - 1])
              .attr("fill", function (d) {
                //console.log(d.value, color(d.value))
                  return color(d.value);
          });
      }

    /*******************************************************/
    /**     LEGEND                                                          */
    /*******************************************************/
    function createLegend() {
        var legendWidth = 400,
              legendHeight = 200;

        var segmentLength = 25;

        var svg = d3.select(".legend_container")
            .append("svg")
                .attr("class", "legend");

        //console.log(max, color.domain(), color.range());
                        
        // A position encoding for the key only.
        var x = d3.scale.linear()
            .domain([0, max])
            .range([0, segmentLength * numColors]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(13)
            .tickValues(color.domain());        

        var g = svg.append("g")
            .attr("class", "key")
            .attr("transform", "translate(80,40)");

          g.selectAll("rect")
              .data(color.range().map(function(d, i) {
                return {
                  x0: i ? x(color.domain()[i - 1]) : x.range()[0],
                  x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
                  z: d
                };
              }))
            .enter().append("rect")
              .attr("class", "legend_segment")
              .attr("height", 8)
              .attr("x", function(d) { return d.x0; })
              .attr("width", function(d) { return d.x1 - d.x0; })
              .style("fill", function(d) { return d.z; });

          g.call(xAxis).append("text")
              .attr("class", "caption")
              .attr("y", -6)
              .text("Users per 10 Km Radius");
      }
      //console.log('scheme', scheme);
/**/
});
// END document.ready


  

/*******************************************************/
/**     DATA                                                          */
/*******************************************************/
// dummy data
var users = {
  "type":"FeatureCollection",
  "bbox": [
    33.78, 29.30,
    36.16, 33.49
  ],
  "features": []
};


var getPoint = function() { 
  var point = [],
        a = 3.1347,
        b = -76.8888;

   var  x = d3.scale.linear()
          .domain([0,1])
          .range([34.638, 35.272]);

    var y = d3.scale.linear()
          .domain([0,1]);

    point[0] = x(Math.random());
    y.range([31.802, Math.min(33, a * point[0] + b)]);            

    point[1] = y(Math.random());

    return point;
}

var getUsers = function(num_users) {
    for (var i =0; i<num_users; ++i) {
        var p = getPoint();

        var user = {
              "type":"Feature",
              "id":"user_" + i,
              "geometry":{
                  "type":"Point",
                  "coordinates": p
              },
              "properties":{
                  "value": Math.round(Math.random() * 20)
              }
       }

       users.features.push(user);
    }

    return users;
}
