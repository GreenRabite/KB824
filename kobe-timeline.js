export const kobeTimeline = ()=>{

    var margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = $('#kobe-timeline').width() - margin.left - margin.right,
    height = $('#kobe-timeline').height() - margin.top - margin.bottom,
    height2 = $('#kobe-timeline').height() - margin2.top - margin2.bottom;

    var svg = d3.select("#kobe-timeline")
    .append("svg")
    .attr("height",height)
    .attr("width",width);
      debugger;
var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.PTS); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.PTS); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("./data/kobe-reg-games-log.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.PTS; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());


  let fixedData ={};
  let arr = [];
  data.forEach((d)=>{
    fixedData["date"] = d.date;
    fixedData["PTS"] = d.PTS;
    arr.push(fixedData);
    fixedData = {};
  });

  //
  focus.append("path")
      .datum(arr)
      .attr("class", "area")
      .attr("d", area);


  // draw dots
  focus.selectAll("circle")
      .data(data)
      .enter().append("circle").attr("r", (d)=>{return (d.PTS/8)})
        .attr("cx", (d)=>{return x(d.date)})
        .attr("cy", (d)=>{return y(d.PTS)})
        .style("fill", "#552583")
      //   .on("mouseover", function(d) {
      //     tooltip.transition()
      //          .duration(200)
      //          .style("opacity", .9);
      //     tooltip.html(d["date"] + "<br/> (" + xValue(d)
      //     + ", " + yValue(d) + ")")
      //          .style("left", (d3.event.pageX + 5) + "px")
      //          .style("top", (d3.event.pageY - 28) + "px");
      // })
      // .on("mouseout", function(d) {
      //     tooltip.transition()
      //          .duration(500)
      //          .style("opacity", 0);
      // });

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  focus.append("g")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);



    });

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  }

  function type(d) {
    // d.date = parseDate(d.date);
    // d.price = +d.price;
    // d.date = new Date(d.Date);
    d.date = Date.parse(d.Date);
    d.PTS = +d.PTS;
    return d;
  }
};
