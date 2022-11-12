// Margin Convention
let margins = { top: 20, right: 25, bottom: 80, left: 80 };
let outerWidth = 1500;
let outerHeight = 1500;
let innerWidth = 900 - margins.left - margins.right;
let innerHeight = 900 - margins.top - margins.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("div#graph svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight)
  .append("g")
  .attr("id", "plot-area")
  .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// read the data, then draw the graph
// d3.csv(
//   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
// ).then(draw);

d3.csv(
  "https://raw.githubusercontent.com/dirtyprototyper/assigmentD3js/master/data/temp_monthly.csv"
).then(draw);

// d3.csv("/data/employees.csv", function(data) {
//   for (var i = 0; i < data.length; i++) {
//       console.log(data[i].Name);
//       console.log(data[i].Age);
//   }

// function draw(data) {
//   console.log(data);
// }

function draw(data) {
  for (i = 0; i < data.length; i++) {
    theDate = data[i].date.split("-");
    data[i].year = theDate[0];
    //  data[i].month = theDate[1];
    //  console.log( typeof(theDate[1]))
    if (theDate[1] == "01") {
      data[i].month = "January";
    } else if (theDate[1] == "02") {
      data[i].month = "Febraury";
    } else if (theDate[1] == "03") {
      data[i].month = "March";
    } else if (theDate[1] == "04") {
      data[i].month = "April";
    } else if (theDate[1] == "05") {
      data[i].month = "May";
    } else if (theDate[1] == "06") {
      data[i].month = "June";
    } else if (theDate[1] == "07") {
      data[i].month = "July";
    } else if (theDate[1] == "08") {
      data[i].month = "August";
    } else if (theDate[1] == "09") {
      data[i].month = "September";
    } else if (theDate[1] == "10") {
      data[i].month = "October";
    } else if (theDate[1] == "11") {
      data[i].month = "November";
    } else if (theDate[1] == "12") {
      data[i].month = "December";
    }

    totalsum = 0;
    maxnumber = 0;
    minnumber = 0;

    totalsum = Number(data[i].avg_temperature) + totalsum;

    if (maxnumber < data[i].avg_temperature) {
      maxnumber = data[i].avg_temperature;
    }

    if (minnumber > data[i].avg_temperature) {
      minnumber = data[i].avg_temperature;
    }
  }

  console.log("minnumber");
  console.log(minnumber);
  console.log("maxnumber");
  console.log(maxnumber);
  console.log(totalsum / data.length);

  //month
  var groups = d3.map(data, (d) => d.month).keys();

  //year
  var vars = d3.map(data, (d) => d.year).keys();
  console.log(vars.reverse());

  // build x scale and axis:
  var xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, innerWidth])
    .padding(0.05);

  svg
    .append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(xScale).tickSize(0))
    .select(".domain") // remove horizontal line from axis
    .remove();

  // Build y scale and axis:
  var yScale = d3
    .scaleBand()
    .domain(vars)
    .range([innerHeight, 0])
    .padding(0.05);

  svg
    .append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(yScale).tickSize(0))
    .select(".domain") // remove vertical line from axis
    .remove();

  //**
  svg
    .append("text")
    .attr("x", 265)
    .attr("y", 240)
    .style("text-anchor", "middle")
    .text("Year");

  // build color scale
  let colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([10, 34]);

  var tooltip = d3
    .select("#graph")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  var mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.avg_temperature)
      .style("left", d3.mouse(this)[0] + 70 + "px")
      .style("top", d3.mouse(this)[1] + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 1);
  };

  // add the squares
  svg
    .append("g")
    .attr("transform", "translate(2, 2)")
    // .attr("stroke", "black")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("x", (d) => {
      return xScale(d.month);
    })
    .attr("y", (d) => {
      return yScale(d.year);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .style("fill", (d) => colorScale(d.avg_temperature));

  continuous("#legend1", colorScale);

  function continuous(selector_id, colorscale) {
    var legendheight = 200,
      legendwidth = 80,
      margin = { top: 10, right: 60, bottom: 10, left: 2 };

    var canvas = d3
      .select(selector_id)
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "relative")
      .append("canvas")
      .attr("height", legendheight - margin.top - margin.bottom)
      .attr("width", 1)
      .style("height", legendheight - margin.top - margin.bottom + "px")
      .style("width", legendwidth - margin.left - margin.right + "px")
      .style("border", "1px solid #000")
      .style("position", "absolute")
      .style("top", margin.top + "px")
      .style("left", margin.left + "px")
      .node();

    var ctx = canvas.getContext("2d");

    var legendscale = d3
      .scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());

    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    var image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(function (i) {
      var c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4 * i] = c.r;
      image.data[4 * i + 1] = c.g;
      image.data[4 * i + 2] = c.b;
      image.data[4 * i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
    // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
    /*
    d3.range(legendheight).forEach(function(i) {
      ctx.fillStyle = colorscale(legendscale.invert(i));
      ctx.fillRect(0,i,1,1);
    });
    */

    var legendaxis = d3.axisRight().scale(legendscale).tickSize(10).ticks(10);

    var svg = d3
      .select(selector_id)
      .append("svg")
      .attr("height", legendheight + "px")
      .attr("width", legendwidth + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr(
        "transform",
        "translate(" +
          (legendwidth - margin.left - margin.right + 3) +
          "," +
          margin.top +
          ")"
      )
      .call(legendaxis);
  }

  svg
    .append("text")
    .attr("x", 400)
    .attr("y", 850)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "black")
    .style("max-width", 400)
    .text("Title of the world2.");
  // Add subtitle to graph
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "black")
    .style("max-width", 400)
    .text("Title of the world.");

  svg
    .append("text")
    .attr("x", -500)
    .attr("y", 0)
    .attr("transform", "rotate(270)")
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "black")
    .style("max-width", 400)
    .text("Title of the world3  .");
}
