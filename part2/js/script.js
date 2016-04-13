// DEFINE CHART DIMENSIONS
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// DEFINE SCALES
var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);
var y = d3.scale.linear()
    .range([height, 0]);


// DEFINE AXES
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");


// APPEND SVG AND AXES GROUPS TO THE DOM
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

svg.append("g")
      .attr("class", "y axis");



// IMPORT DATA
var chartData;
d3.tsv("data/set2.tsv", function(error, data) {


// PREPARE DATA
  data.forEach(function(d){
    d.value = +d.value;
  });
  chartData = d3.nest()
                .key(function(d){ return d.group; })
                .map(data);

  draw('A');

});

// WRITE DRAW FUNCTION
function draw(group){
  var data = chartData[group];


// SET SCALES DOMAIN
  x.domain(data.map(function(d) { return d.label; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]).nice();


// CALL AXES
  d3.selectAll(".x.axis")
      .call(xAxis);

  d3.selectAll(".y.axis")
      .call(yAxis);


// BARS
// 1) JOIN
  var bars = svg.selectAll(".bar")
      .data(data);


// 2) ENTER
  bars
    .enter().append("rect")
      .attr("class", "bar");



// 3) UPDATE
  bars
      .attr("width", x.rangeBand())
      .attr("x", function(d) { return x(d.label); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });


// 4) EXIT
  bars.exit().remove();

}


// Call our draw function using our buttons
$(".btn").click(function(){
  draw($(this).text());
});