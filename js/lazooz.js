/*******************************************************/
/**     LEGEND                                                          */
/*******************************************************
var color = d3.scale.threshold()
        .domain([3, 9, 36, 90, 270])
        .range(["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d", '#a63603']);
                
// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 390])
    .range([0, 240]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain());

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(40,40)");

  g.selectAll("rect")
      .data(color.range().map(function(d, i) {
        return {
          x0: i ? x(color.domain()[i - 1]) : x.range()[0],
          x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
          z: d
        };
      }))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return d.x0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .style("fill", function(d) { return d.z; });

  g.call(xAxis).append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .text("Population per square mile");
  //console.log('scheme', scheme);


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
          .range([34.638, 34.972]);

    var y = d3.scale.linear()
          .domain([0,1]);

    point[0] = x(Math.random());
    y.range([31.802, a * point[0] + b]);            

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
                  "publicid": i
              }
       }

       users.features.push(user);
    }

    return users;
}
