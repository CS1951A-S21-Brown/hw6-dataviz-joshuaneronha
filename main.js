// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg_2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var map_q2 = d3.map()

var outlines = d3.geoPath()
var map_proj = d3.geoMercator().scale(50).center([0,0]).translate([graph_1_width / 2, graph_1_height / 2]);


var color = d3.scaleThreshold()
  .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90,100])
  .range(d3.schemeBlues[9]);

var dataset = [
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("/data/football_clean_q2.csv", function (d) {map_q2.set(d.country_code, +parseFloat(d.win_percent))})
]

console.log(map_q2)

Promise.all(dataset).then(execute)

function execute([input]) {
    svg_2.append("g")
    .attr("class","countries")
    .selectAll("path")
    .data(input.features)
    .enter().append("path")
    .attr("d", d3.geoPath().projection(map_proj))
    // .attr("fill", function(d) { return color(d.win_percent = map_q2.get(d.country_code)); })
    .attr("fill", function (d) {
        d.total = map_q2.get(d.id);
        console.log(d.total)
        return color(d.total);
      });


}

    





