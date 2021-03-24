// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 50, right: 100, bottom: 40, left: 100};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (7*MAX_WIDTH / 12) - 10, graph_1_height = 500;
let graph_2_width = (7*MAX_WIDTH / 12) - 10, graph_2_height = 500;
let graph_3_width = (3.5*MAX_WIDTH / 12), graph_3_height = 1000;

let svg_1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    // .call(d3.zoom().on("zoom", function() {
    //     svg_1.attr("transform", d3.event.transform)
    // }))
    .attr("transform", `translate(${margin.left+30},${margin.top})`);

d3.csv("/data/football_clean_q1.csv").then(function(data) {
    let x_ax = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0,graph_2_width - margin.left - margin.right])
        .padding(0.1);
    
    let y_ax = d3.scaleLinear()
        .domain([d3.min(data, function(d) {return parseInt(d.tournament)}), d3.max(data, function(d) {return parseInt(d.tournament)})])
        .range([graph_2_height - margin.top - margin.bottom,30])

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
        .attr("transform", `translate(0,${graph_1_height - margin.top - margin.bottom})`)
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
            .attr("x", (graph_1_width/6.8))
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
    .append("g").
    attr("transform", `translate(${margin.left-100},${margin.top})`);

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("border", "solid")
    .style("border-radius", "8px")
    .style("border-width", "1.5px")


let title = svg_2.append("text")
    .attr("x", (graph_2_width/3.1))
    .attr("y", -10)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 25)
    
let legend_upper = svg_2.append("text")
    .attr("x", (margin.left + 35))
    .attr("y", 260)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)

let legend_lower = svg_2.append("text")
    .attr("x", (margin.left + 35))
    .attr("y", 445)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)

let leg_disc = svg_2.append("text")
    .attr("x", (margin.left + 35))
    .attr("y", 340)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)
    .text("Win")

let leg_disc_2 = svg_2.append("text")
    .attr("x", (margin.left + 35))
    .attr("y", 360)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 15)
    .text("Percentage")

let lower_disc = svg_2.append("text")
    .attr("x", (margin.left + (graph_1_width/2)-50))
    .attr("y", 448)    // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "center")
    .style("font-size", 10)
    .text("Note: some small countries may  not be visible.")
    

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
            .attr("transform", `translate(${margin.left},${250})`);

        let mouseover = function(d) {
            let html = `<strong style="color: #cf6700;">${d.id}</strong><br><p style="color: #cf6700;">${d.total}% wins</p>`;  
            
            opac = 0
            
            if (d.total === undefined) {
                opac = 0
            } else {
                opac = 0.9
            }
            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX) - 20}px`)
                .style("top", `${(d3.event.pageY) - 45}px`)
                .transition()
                .duration(200)
                .style("opacity", opac)
                .style("background", color(d.total))
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .style("background", '#ffffff')
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
    .attr("transform", `translate(${margin.left},${margin.top})`);

svg_3.append("text")
        .attr("x", 40)
        .attr("y", -10)    // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "center")
        .style("font-size", 25)
        .text("Strongest World Cup Teams")

let tooltip_3 = d3.select("#graph3")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("border", "solid")
    .style("border-radius", "8px")
    .style("border-width", "1.5px")

categories = ['Total Score','Win Percent','Win Margin','Total Games','Opponent Win Pct']

d3.csv("/data/ques_3_total.csv").then(function(data) {

    let y = d3.scaleBand()
        .domain(data.map(function(d) {return d.home_team}))
        .range([margin.top, graph_3_height - margin.top - margin.bottom])
        .padding(0);

    let x = d3.scaleBand()
        .domain(categories)
        .range([0, graph_3_width])
        .padding(0)

    var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.5,1])

    var color_total = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.67,0.77])
    var color_win_percent = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.45,0.8])
    var color_margin = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.63,1])
    var color_total_games = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.48,1])
    var color_opp_str = d3.scaleSequential(d3.interpolateYlGnBu).domain([0.62,0.73])




    svg_3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
        .attr("transform", `translate(0,${-3.5})`);

    svg_3.append("g")
        .call(d3.axisTop(x).tickSize(0).tickPadding(10))
        .attr("transform", `translate(0,${margin.top})`);

    let mouseover_3 = function(d) {

        let html = ``

        if ((d.variable == 'Win Percent') || (d.variable == 'Opponent Win Pct')) {
            html = `<strong style="color: #000000;">${d.home_team}</strong><br><p style="color: #000000;">${d.variable}: ${d.raw}%</p>`; 
        } else {
            html = `<strong style="color: #000000;">${d.home_team}</strong><br><p style="color: #000000;">${d.variable}: ${d.raw}</p>`; 
        }

        
        

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip_3.html(html)
            .style("left", `${(d3.event.pageX) - graph_1_width - 100}px`)
            .style("top", `${(d3.event.pageY) - 75}px`)
            .transition()
            .duration(200)
            .style("opacity", 0.8)
            .style("background", "ffffff")
    };

    // Mouseout function to hide the tool on exit
    let mouseout_3 = function(d) {
        // Set opacity back to 0 to hide
        tooltip_3.transition()
            .style("background", '#ffffff')
            .duration(200)
            .style("opacity", 0)

    };

    svg_3.selectAll()
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) {return x(d.variable)})
        .attr("y", function(d) {return y(d.home_team)})
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {
            if (d.variable == "Win Percent") {return color_win_percent(d.value)} 
            else if (d.variable == "Total Score") {return color_total(d.value)}
            else if (d.variable == "Win Margin") {return color_margin(d.value)}
            else if (d.variable == "Total Games") {return color_total_games(d.value)}
            else if (d.variable == "Opponent Win Pct") {return color_opp_str(d.value)}

        })
        .on("mouseover", mouseover_3) // HINT: Pass in the mouseover and mouseout functions here
        .on("mouseout", mouseout_3);

    svg_3.append("line")
        .attr("x1",x.bandwidth())
        .attr("y1",margin.top-2)
        .attr("x2",x.bandwidth())
        .attr("y2",920)
        .style("stroke","white")
        .style("stroke-width",8)

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


