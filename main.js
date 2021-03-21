// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 50, right: 100, bottom: 40, left: 100};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (2*MAX_WIDTH / 3) - 10, graph_1_height = 500;
let graph_2_width = (2*MAX_WIDTH / 3) - 10, graph_2_height = 500;
let graph_3_width = MAX_WIDTH / 4, graph_3_height = 575;

let svg_1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    // .call(d3.zoom().on("zoom", function() {
    //     svg_1.attr("transform", d3.event.transform)
    // }))
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("/data/football_clean_q1.csv").then(function(data) {
    let x_ax = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0,graph_2_width - margin.left - margin.right])
        .padding(0.1);
    
    let y_ax = d3.scaleLinear()
        .domain([d3.min(data, function(d) {return parseInt(d.tournament)}), d3.max(data, function(d) {return parseInt(d.tournament)})])
        .range([graph_2_height - margin.top - margin.bottom,0])

    svg_1.append("linearGradient")
        .attr('id', 'line_grad')
        .attr("x1","0%")
        .attr("y1","100%")
        .attr("x2","0%")
        .attr("y2","0%")
        .selectAll("stop")
            .data([
                {loc: "0%", color: "#ffffd9"},
                {loc: "12.5%", color: "#edf8b1"},
                {loc: "25%", color: "#c7e9b4"},
                {loc: "37.5%", color: "#7fcdbb"},
                {loc: "50%", color: "#41b6c4"},
                {loc: "62.5%", color: "#1d91c0"},
                {loc: "75%", color: "#225ea8"},
                {loc: "87.5%", color: "#253494"},
                {loc: "100%", color: "#081d58"}
            ])
        .enter().append("stop")
            .attr("offset", function(d) {return d.loc; })
            .attr("stop-color", function(d) {return d.color; })


    svg_1.append("g")
        // .attr("transform", `translate(0,-500)` )
        .call(d3.axisLeft(y_ax));
    
    svg_1.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,410)`)
        .call(d3.axisBottom(x_ax).tickValues([1872,1884,1896,1908,1920,1932,1944,1956,1968,1980,1992,2004,2016]));

    svg_1.append("path")
        .datum(data)
        .attr("fill","url(#line_grad)")
        .style("stroke","black")
        .attr("stroke-width",0.5)
        .attr("d", d3.line()
            .x(function(d) { return x_ax(parseInt(d.date))})
            .y(function(d) { return y_ax(parseInt(d.tournament))}))

    svg_1.append("text")
            .attr("x", (graph_2_width/6))
            .attr("y", -10)    // HINT: Place this at the top middle edge of the graph
            .style("text-anchor", "center")
            .style("font-size", 25)
            .text("Number of World Cup Games Per Year")



            
        


    svg_1.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - 50})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Year");

    svg_1.append("text")
        .attr("transform", `translate(${-60}, ${(graph_2_height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Games");


    }); 




let svg_2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${0},${margin.top})`);

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let title = svg_2.append("text")
    .attr("x", (graph_2_width/4))
    .attr("y", -10)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 25)
    
let legend_upper = svg_2.append("text")
    .attr("x", (margin.left + 85))
    .attr("y", 260)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)

let legend_lower = svg_2.append("text")
    .attr("x", (margin.left + 85))
    .attr("y", 445)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)
    

function setData(val) {

    d3.csv("/data/football_clean_q2.csv").then(function(data) {
    
        var map_q2 = d3.map()
    
        var outlines = d3.geoPath()
        var map_proj = d3.geoMercator().scale(110).center([-15,20]).translate([(graph_1_width / 2), graph_1_height / 1.7]);

        data = cleanData(data, compare, val);

        // console.log(data)


        var dataset = [
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            // d3.csv("/data/football_clean_q2.csv", function (d) {map_q2.set(d.country_code, +parseFloat(d.win_percent))})
            d3.map(data, function (d) {map_q2.set(d.country_code, +parseFloat(d.win_percent))})
        ]

        var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([d3.min(data, function(d) {return parseInt(d.win_percent)}), d3.max(data, function(d) {return parseInt(d.win_percent)})])
        // var color = d3.scaleOrdinal().domain([d3.min(data, function(d) {return parseInt(d.win_percent)}), d3.max(data, function(d) {return parseInt(d.win_percent)})]).range(d3.interpolateYlGnBu[9])
        // console.log(map_q2)

        Promise.all(dataset).then(execute)

        svg_2.append("linearGradient")
        .attr('id', 'line_grad')
        .attr("x1","0%")
        .attr("y1","100%")
        .attr("x2","0%")
        .attr("y2","0%")
        .selectAll("stop")
            .data([
                {loc: "0%", color: "#ffffd9"},
                {loc: "12.5%", color: "#edf8b1"},
                {loc: "25%", color: "#c7e9b4"},
                {loc: "37.5%", color: "#7fcdbb"},
                {loc: "50%", color: "#41b6c4"},
                {loc: "62.5%", color: "#1d91c0"},
                {loc: "75%", color: "#225ea8"},
                {loc: "87.5%", color: "#253494"},
                {loc: "100%", color: "#081d58"}
            ])
        .enter().append("stop")
            .attr("offset", function(d) {return d.loc; })
            .attr("stop-color", function(d) {return d.color; })

        svg_2.append("rect")
            .attr("width",25)
            .attr("height",200)
            .attr("fill","url(#line_grad)")
            .attr("transform", `translate(${margin.left + 50},${250})`);

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
                // console.log(d.total)
                return color(d.total);
                
            })
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);
        }

        title.text("Top"+" "+val+" "+"Most Winning Countries")
        legend_lower.text((d3.min(data, function(d) {return parseFloat(d.win_percent)})+"%"))
        legend_upper.text((d3.max(data, function(d) {return parseFloat(d.win_percent)})+"%"))
        
    });

}

let svg_3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width + 100)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left-50},${margin.top})`);

categories = ['total','win_percent','margin','total_games','opp_str']

d3.csv("/data/ques_3.csv").then(function(data) {

    let y = d3.scaleBand()
        .domain(data.map(function(d) {return d.home_team}))
        .range([margin.top, graph_3_height + margin.top - margin.bottom])
        .padding(0.1);

    let x = d3.scaleBand()
        .domain(categories)
        .range([0, graph_3_width])
        .padding(0.1)

    var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.5,1])

    svg_3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10))

    svg_3.append("g")
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10))

    svg_3.selectAll()
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) {return x(d.variable)})
        .attr("y", function(d) {return y(d.home_team)})
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {return color(d.value)})

})


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


