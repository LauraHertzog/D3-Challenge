// @TODO: YOUR CODE HERE!
//set up margins

var svgWidth = 960; 
var svgHeight = 500; 

var margin = {
    top: 20, 
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right; 
var height = svgHeight - margin.top - margin.bottom; 

//Create a SVG wrapper, append an SVG group that will hold chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight); 

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

//Import Data
d3.csv("assets/data/data.csv").then(function(USCensusData) {

    //Parse Data
    USCensusData.forEach(function(data){
        data.healthcare = +data.healthcare; 
        data.poverty = +data.poverty;
        console.log(data)
    });

    //Create Scale Functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(USCensusData, d => d.poverty) - 1 , d3.max(USCensusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(USCensusData, d => d.healthcare) - 1, d3.max(USCensusData, d => d.healthcare)])
        .range([height, 0]); 

    //create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale); 
    var leftAxis = d3.axisLeft(yLinearScale); 

    //Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis); 

    chartGroup.append("g")
        .call(leftAxis);


//Create Circles 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(USCensusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".75"); 

//adding abbreviations
var textGroup = chartGroup.selectAll(null)
    .data(USCensusData)
    .enter()
    .append("text")
    .attr("class", "stateabbr")
    .attr("x", d=>xLinearScale(d.poverty))
    .attr("y", d=>yLinearScale(d.healthcare))
    .attr("text-anchor", "middle")
    .text(d => d.abbr);

//Initialize tool tip
 var toolTip = d3.tip()
    .attr("class", "toolTip")
    //.offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>In Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
    });

//Create tooltip in the chart
chartGroup.call(toolTip);

//Event listeners to display and hide the tooltip
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this); 
})
    .on("mouseout", function(data, index) {
        toolTip.hide(data); 
    });

textGroup.on("mouseover", function(data) {
    toolTip.show(data, this); 
})
    .on("mouseout", function(data, index) {
        toolTip.hide(data); 

}); 

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/2) -50)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("Lacks Healthcare (%)");

chartGroup.append("text")
    .attr("transform", `translate(${(width / 2) -50}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("In Poverty (%)");   
});