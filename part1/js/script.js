// D3, pattern-driven development
//
// Lots of what we do in d3.js is driven by patterns,
// lessons we've learned after many, many hours banging
// our head against the idiosyncracies of d3's syntax.
//
// The architecture and notes below should help jumpstart
// most d3 charts you'll need to build in the future.


// DEFINE CHART DIMENSIONS
var margin = {top: 20, right: 60, bottom: 30, left: 50},
    width = 920 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



// DEFINE SCALES
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .domain(['< 10%','10-20%','> 20%'])
    .range(['#fa9fb5','#dd3497','#7a0177']);


// DEFINE AXES
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d){
        return d+"%"
    });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


// APPEND SVG TO THE DOM
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// IMPORT DATA
d3.tsv("data/sat.tsv", function(error, data) {


// PREPARE DATA
  data.forEach(function(d) {
    d.state = d["State"];
    d.tested = +d["Tested"];
    d.score = +d["Score"];
    d.waiver = d["Waiver"];
  });


// SET SCALES DOMAIN
  x.domain([0, 100]);
  y.domain(d3.extent(data, function(d) { return d.score; })).nice();


  var tooltip = d3.select("#tooltip");


// APPEND AXES
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width) 
      .attr("y", -6)
      .style("text-anchor", "end") 
      .text("Student participation rate");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)") 
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average SAT score")


// DOTS
// 1) SELECT
      var dots = svg.selectAll(".dot")


// 2) JOIN
            .data(data);


// 3) ENTER
      dots.enter()
            .append("circle")
            .attr("class", "dot");



// 4) UPDATE
      dots
        .attr("r", 5)
        .attr("cx",function(d){ return x(d.tested); })
        .attr("cy",function(d){ return y(d.score); })
        .style("stroke","white")
        .style("stroke-width","1px")
        .style("fill", function(d){
            return color(d.waiver);
        })
        .on("mouseover",function(d){

            tooltip
                .style("left", (d3.event.pageX + 10 ) + "px")
                .style("top" , (d3.event.pageY - 30 - document.body.scrollTop ) + "px");
            tooltip.classed("hidden",false);

            tooltip.select("p")
                .text(d.state);
        })
        .on("mouseout", function(d){
            tooltip.classed("hidden",true);
        });

//ADD LEGEND
        var keys = d3.select("#key-table").selectAll(".key")
            .data(color.domain()) 
            .enter()
            .append("div") 
            .attr("class","key")
            .html(function(d){
                return "<i class='fa fa-circle' style='color:"
                +color(d)+
                ";'></i>"+d;});


});