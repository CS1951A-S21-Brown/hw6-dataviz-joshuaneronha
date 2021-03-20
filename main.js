// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 50, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 500;
let graph_2_width = (2*MAX_WIDTH / 3) - 10, graph_2_height = 500;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg_2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(50,30)`);

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let title = svg_2.append("text")
    .attr("x", (graph_2_width/4))
    .attr("y", -10)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 25)
    

function setData(val) {

    d3.csv("/data/football_clean_q2.csv").then(function(data) {
    
        var map_q2 = d3.map()
    
        var outlines = d3.geoPath()
        var map_proj = d3.geoMercator().scale(110).center([-15,20]).translate([(graph_1_width / 2), graph_1_height / 1.7]);

        data = cleanData(data, compare, val);

        console.log(data)


        var dataset = [
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            // d3.csv("/data/football_clean_q2.csv", function (d) {map_q2.set(d.country_code, +parseFloat(d.win_percent))})
            d3.map(data, function (d) {map_q2.set(d.country_code, +parseFloat(d.win_percent))})
        ]

        var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([d3.min(data, function(d) {return parseInt(d.win_percent)}), d3.max(data, function(d) {return parseInt(d.win_percent)})])
        // var color = d3.scaleOrdinal().domain([d3.min(data, function(d) {return parseInt(d.win_percent)}), d3.max(data, function(d) {return parseInt(d.win_percent)})]).range(d3.interpolateYlGnBu[9])
        console.log(map_q2)

        Promise.all(dataset).then(execute)

        let mouseover = function(d) {
            let html = `<strong style="color: #cf6700;">${d.id}</strong><br><p style="color: #cf6700;">${d.total}% wins</p>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX) - 20}px`)
                .style("top", `${(d3.event.pageY) - 45}px`)
                .transition()
                .duration(200)
                .style("opacity", 0.9)
                .style("background", color(d.total))
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .style("background", '#dbe1eb')
                .duration(200)
                .style("opacity", 0)

        };

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
                
            })
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);
        }

        title.text("Top"+" "+val+" "+"Most Winning Countries")

        
    });

}

function compare(a, b) {
    a = parseInt(a.win_percent)
    b = parseInt(b.win_percent)
    return b - a
 }

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
 function cleanData(data, comparator, numExamples) {
    sliced_data = data.sort(comparator).slice(0,numExamples)
    
    return sliced_data   
    }

setData(10)


