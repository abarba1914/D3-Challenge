// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Poverty";
var chosenYAxis = "Healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }
  
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// Function used for updating y-scale var upon click on axis label.
function yScale(data, chosenYAxis, height) {
  // Create scales.
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * .8,
          d3.max(data, d => d[chosenYAxis]) * 1.2])
      .range([height, 0]);
  return yLinearScale;
}

// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));  
    return circlesGroup;
  }

// Function used for updating text in circles group with a transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  return circletextGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    var xLabel;
  
    if (chosenXAxis === "poverty") {
      xLabel = "In Poverty (%)";
    }
    else if (chosenXAxis ===  "age"){
      xLabel = "Age (Median)";
    }
    else {
      xLabel = "Household Income";
    }
  // Conditional for Y Axis.
    var yLabel; 
    if (chosenYAxis === "healthcare") {
      yLabel = "Lacks Healthcare";
    } 
    else if (chosenYAxis === "smokes") {
      yLabel = "Smokers"
    } 
    else {
      yLabel = "Obesity"
}

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([120, -60])
      .html(function(d) {
        if (chosenXAxis === "age") {
          // All yAxis tooltip labels presented and formated as %.
          // Display Age without format for xAxis.
          return (`${d.state}<hr>${xLabel} ${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}%`);
          } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
          // Display Income in dollars for xAxis.
          return (`${d.state}<hr>${xLabel}$${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}%`);
          } else {
          // Display Poverty as percentage for xAxis.
          return (`${d.state}<hr>${xLabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
          }
  });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    textGroup
      .on("mouseover", function(data) {
          toolTip.show(data, this);
      })
      .on("mouseout", function(data) {
          toolTip.hide(data);
      });
  return circlesGroup;
}
function makeResponsive() {
  // Select div by id.
  var svgArea = d3.select("#scatter").select("svg");
  // Clear SVG.
  if (!svgArea.empty()) {
      svgArea.remove();
  }
  //SVG params.
  var svgHeight = window.innerHeight/1.2;
  var svgWidth = window.innerWidth/1.7;
  // Margins.
  var margin = {
      top: 50,
      right: 50,
      bottom: 100,
      left: 80
  };

 // Chart area minus margins.
 var chartHeight = svgHeight - margin.top - margin.bottom;
 var chartWidth = svgWidth - margin.left - margin.right;
 // Create an SVG wrapper, append an SVG group that will hold our chart,
 // and shift the latter by left and top margins.
 var svg = d3
 .select("#scatter")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight);
 // Append an SVG group
 var chartGroup = svg.append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale and yLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis, width);
  var yLinearScale = yScale(healthData, chosenYAxis, height);

  
 // Create initial axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 // append x axis
 var xAxis = chartGroup.append("g")
   .classed("x-axis", true)
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);

  // Append y axis.
  var yAxis = chartGroup.append("g")
  .call(leftAxis);
// Set data used for circles.
var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData);
// Bind data.
var elemEnter = circlesGroup.enter();
// Create circles.
var circle = elemEnter.append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 15)
  .classed("stateCircle", true);
// Create circle text.
var circleText = elemEnter.append("text")            
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("dy", ".35em") 
  .text(d => d.abbr)
  .classed("stateText", true);
// Update tool tip function above csv import.
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
   
 // Create group for two x-axis labels
 var xLabelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

 var povertyLabel = xLabelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 20)
 .attr("value", "poverty") // value to grab for event listener
 .classed("active", true)
 .text("In Poverty (%)");
var ageLabel = xLabelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "age") // value to grab for event listener
 .classed("inactive", true)
 .text("Age (Median)");
var incomeLabel = xLabelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 60)
 .attr("value", "income") // value to grab for event listener
 .classed("inactive", true)
 .text("Household Income (Median)");
// Add y labels group and labels.
var yLabelsGroup = chartGroup.append("g")
 .attr("transform", "rotate(-90)");
var healthcareLabel = yLabelsGroup.append("text")
 .attr("x", 0 - (height / 2))
 .attr("y", 40 - margin.left)
 .attr("dy", "1em")
 .attr("value", "healthcare")
 .classed("active", true)
 .text("Lacks Healthcare (%)");
var smokesLabel = yLabelsGroup.append("text")
 .attr("x", 0 - (height / 2))
 .attr("y", 20 - margin.left)
 .attr("dy", "1em")
 .attr("value", "smokes")
 .classed("inactive", true)
 .text("Smokes (%)");
var obeseLabel = yLabelsGroup.append("text")
 .attr("x", 0 - (height / 2))
 .attr("y", 0 - margin.left)
 .attr("dy", "1em")
 .attr("value", "obesity")
 .classed("inactive", true)
 .text("Obese (%)");



// X labels event listener.
xLabelsGroup.selectAll("text")
.on("click", function() {
    // Grab selected label.
    chosenXAxis = d3.select(this).attr("value");
    // Update xLinearScale.
    xLinearScale = xScale(healthData, chosenXAxis, width);
    // Render xAxis.
    xAxis = renderXAxes(xLinearScale, xAxis);
    // Switch active/inactive labels.
    if (chosenXAxis === "poverty") {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
    } else if (chosenXAxis === "age") {
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
    } else {
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true)
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
    }
    // Update circles with new x values.
    circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    // Update tool tips with new info.
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
    // Update circles text with new values.
    circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
});
// Y Labels event listener.
yLabelsGroup.selectAll("text")
.on("click", function() {
    // Grab selected label.
    chosenYAxis = d3.select(this).attr("value");
    // Update yLinearScale.
    yLinearScale = yScale(healthData, chosenYAxis, height);
    // Update yAxis.
    yAxis = renderYAxes(yLinearScale, yAxis);
    // Changes classes to change bold text.
    if (chosenYAxis === "healthcare") {
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);
    } else if (chosenYAxis === "smokes"){
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);
    } else {
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        obeseLabel
            .classed("active", true)
            .classed("inactive", false);
    }
 // Update circles with new y values.
 circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 // Update circles text with new values.
 circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 // Update tool tips with new info.
 circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
});
}).catch(function(err) {
console.log(err);
});
}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
