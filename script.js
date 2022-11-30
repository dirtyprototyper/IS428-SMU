// Margin Convention
let margins = { top: 20, right: 25, bottom: 80, left: 200 };
let outerWidth = 1300;
let outerHeight = 1300;
let innerWidth = 1100 - margins.left - margins.right;
let innerHeight = 1100 - margins.top - margins.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("div#graph svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight)
  .append("g")
  .attr("id", "plot-area")
  .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// read the data, then draw the graph using the draw function
d3.csv(
  "https://raw.githubusercontent.com/dirtyprototyper/assigmentD3js/master/data/temp_monthly.csv"
).then(draw);

function draw(data) {
  for (i = 0; i < data.length; i++) {
    theDate = data[i].date.split("-");
    data[i].year = theDate[0];
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

  // build color scale
  let colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([10, 34]);

  var tooltip = d3
    .select("#graph")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  //interaction with graph (hovering)
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
    .selectAll("rect")
    .data(data, function (d) {
      return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("x", (d) => {
      return xScale(d.month);
    })
    .attr("y", (d) => {
      return yScale(d.year);
    })
    .style("fill", function (d) {
      return colorScale(d.avg_temperature);
    })
    .style("stroke-width", 4)
    .style("stroke", "none")

    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .style("fill", (d) => colorScale(d.avg_temperature));

  continuous("#legend1", colorScale);

  function continuous(selector_id, colorscale) {
    var legendheight = 300,
      legendwidth = 400,
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
      .attr("id", "wow")

      .node();

    var ctx = canvas.getContext("2d");

    var legendscale = d3
      .scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());

    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    // var image = ctx.createImageData(1, legendheight);
    //width, height
    var image = ctx.createImageData(1, legendheight);

    d3.range(legendheight).forEach(function (i) {
      var c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4 * i] = c.r;
      image.data[4 * i + 1] = c.g;
      image.data[4 * i + 2] = c.b;
      image.data[4 * i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    //for the legend 10 14...
    var legendaxis = d3.axisRight().scale(legendscale).tickSize(10).ticks(10);

    var svg = d3
      .select(selector_id)
      .append("svg")
      .attr("height", legendheight + "px")
      .attr("width", legendwidth + "px")
      .attr("transform", "rotate(270)");

    // .style("position", "absolute")
    // .style("left", "0px")
    // .style("top", "0px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr(
        // "translate(" + (margin.left + legendwidth / 2) + "," + (1000 - 50) + ")"

        "transform",
        "translate(" + (legendwidth - 30) + "," + 0 + ")"
      )

      .call(legendaxis);
  }
  //end

  // Add subtitle to graph
  svg
    .append("text")
    .attr("x", 400)
    .attr("y", 1050)
    .attr("text-anchor", "left")
    .style("font-size", "2em")
    .style("fill", "black")
    .style("max-width", 400)
    .text("Month!");
  svg
    .append("text")
    .attr("x", 300)
    .attr("y", 0)
    .attr("text-anchor", "left")
    .style("font-size", "2em")
    .style("fill", "black")
    .style("max-width", 400)
    .text("Average Monthly Temperature!");

  svg
    .append("text")
    .attr("x", -500)
    .attr("y", -100)
    .attr("transform", "rotate(270)")
    .attr("text-anchor", "left")
    .style("font-size", "2em")
    .style("fill", "black")
    .text("Year!");

  rotateLegend();
}

function rotateLegend() {
  document.getElementById("wow").style.transform = "rotate(270deg)";

  // theLegend.attr("transform", "rotate(270)");
}
