// DIMENSIONS
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// SCALES

// For this chart, the data on our x axis
// is categorical, not numeric. For that reason
// we use an ordinal scale instead of a linear one.
var x = d3.scale.ordinal()
    // For bar charts, we need to use a special range array because each bar needs
    // to take up a "band" of width along the x axis. For this we use rangeRoundBands
    // which divides up the range into rounded segments. You can also add a decimal
    // argument after your range array which will represent the amount of each segment
    // used for padding between our bars.  
    .rangeRoundBands([0, width], .1);

// Normal Y scale
var y = d3.scale.linear()
    .range([height, 0]);

// AXES
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // We can specify the number of ticks and 
    // a special transformation for percent data.
    .ticks(10, "%");

// APPEND SVG

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// APPEND groups for our axes

svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

svg.append("g")
      .attr("class", "y axis");

// Declare a global variable that will contain
// our data once we get it from the file.
var chartData;

// Get the data
d3.tsv("data/set2.tsv", function(error, data) {

  // Process the data
  data.forEach(function(d){
    d.value = +d.value;
  });

  // d3.nest lets us nest our data by a grouping key, in this cade the d.group property
  chartData = d3.nest()
                .key(function(d){ return d.group; })
                .map(data);

  draw('A');

});





// Put all our dynamic properties in a draw function
function draw(group){

  // Use the group to get the data we want
  var data = chartData[group];

  // Set scale domains
  // Map gives us an array of our labels, which is our ordinal scale's domain
  x.domain(data.map(function(d) { return d.label; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]).nice();

  // Call our axis functions
  d3.selectAll(".x.axis")
      .call(xAxis);

  d3.selectAll(".y.axis")
      .call(yAxis);

  // Join
  var bars = svg.selectAll(".bar")
      .data(data);

  // Enter
  bars
    .enter().append("rect")
      .attr("class", "bar");
      
  // Update
  bars
      .attr("width", x.rangeBand())
      .attr("x", function(d) { return x(d.label); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  // Exit
  bars.exit().remove();

}


// Call our draw function using our buttons
$(".btn").click(function(){
  draw($(this).text());
});