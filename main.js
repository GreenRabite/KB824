const LAKER_GOLD = "#FDB927";

const LAKER_PURPLE = "#552583";

document.addEventListener("DOMContentLoaded", () => {
  let svg2 = d3.select(".svg2");

  // var projection = d3.geoAlbersUsa()
  //   .scale(200)
  //   .translate([width / 2, height / 2]);

  let projection = d3.geoAlbersUsa();
  // .fitSize([900,600],)
  //
  // let path = d3.geoPath();
  var path = d3.geoPath().projection(projection);

  d3.json("data/us.json", function (error, us) {
    if (error) throw error;

    // let projection = d3.geoAlbersUsa()
    //   .fitSize([0,0],[700,300],us)
    //
    // let path = d3.geoPath();
    // .projection(projection);

    svg2
      .append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path);

    svg2
      .append("path")
      .attr("class", "state-borders")
      .attr(
        "d",
        path(
          topojson.mesh(us, us.objects.states, function (a, b) {
            return a !== b;
          })
        )
      );

    d3.csv("data/NBA-teams2.csv", (data) => {
      svg2
        .selectAll(".map-circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "map-circles")
        .attr("cx", function (d) {
          const pixelLoc = projection([d.lon, d.lat]);
          return pixelLoc[0];
        })
        .attr("cy", function (d) {
          const pixelLoc = projection([d.lon, d.lat]);
          return pixelLoc[1];
        })
        .attr("r", "7px")
        .attr("fill", LAKER_GOLD)
        .on("mouseover", function (d) {
          tooltip
            .transition()
            .duration(200)
            .style("cursor", "pointer")
            .style("opacity", 0.9);
          tooltip
            .html(`${d.place} ${d.teamname}`)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", (d) => {
          updateTeamTable(d);
        });

      //Adding paths

      function startMap() {
        let links = [];
        for (let i = 0; i < data.length - 1; i++) {
          // (note: loop until length - 1 since we're getting the next
          //  item with i+1)
          links.push({
            coordinates: [
              [data[i].lon, data[i].lat],
              [data[i + 1].lon, data[i + 1].lat],
            ],
          });
        }

        // Standard enter / update

        for (let i = 0; i < links.length; i++) {
          svg2
            .selectAll(`line${i}`)
            .data(links)
            .enter()
            .append(`line`)
            .attr("x1", projection(links[i].coordinates[0])[0])
            .attr("y1", projection(links[i].coordinates[0])[1])
            .attr("x2", projection(links[i].coordinates[0])[0])
            .attr("y2", projection(links[i].coordinates[0])[1])
            .transition()
            .duration(1000)
            .delay(1000 * i)
            .attr("x2", projection(links[i].coordinates[1])[0])
            .attr("y2", projection(links[i].coordinates[1])[1])
            .style("stroke", LAKER_PURPLE)
            .style("stroke-width", "2");
        }
      }

      //Start the Map
      const mapBtn = document.querySelector("#conquest-btn-container button");
      mapBtn.addEventListener("click", startMap);
    });
  });

  $("#splash-page").fadeOut(3500);

  var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 110, left: 40 },
    margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

  var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

  var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

  var brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height2],
    ])
    .on("brush end", brushed);

  var zoom = d3
    .zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoomed);

  var area = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function (d) {
      return y(d.PTS);
    });

  // var area2 = d3.area()
  //     .curve(d3.curveMonotoneX)
  //     .x(function(d) { return x2(d.date); })
  //     .y0(height2)
  //     .y1(function(d) { return y2(d.PTS); });

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("./data/kobe-reg-games-log.csv", type, function (error, data) {
    if (error) throw error;
    // console.log(data);
    x.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.PTS;
      }),
    ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    let totalPoints = {};
    let homeAwaySplits = new Proxy(
      {},
      {
        get: function (object, property) {
          return object.hasOwnProperty(property) ? object[property] : 0;
        },
      }
    );
    let teamSplits = new Proxy(
      {},
      {
        get: function (object, property) {
          return object.hasOwnProperty(property) ? object[property] : 0;
        },
      }
    );
    let teamGames = new Proxy(
      {},
      {
        get: function (object, property) {
          return object.hasOwnProperty(property) ? object[property] : 0;
        },
      }
    );
    let teamAvg = {};
    let arr = [];
    data.forEach((d) => {
      if (d.vs === "@") {
        homeAwaySplits["road"] += d.PTS;
        homeAwaySplits["roadGames"] += 1;
      } else {
        homeAwaySplits["home"] += d.PTS;
        homeAwaySplits["homeGames"] += 1;
      }
      teamSplits[`${d.Opp}`] += d.PTS;
      teamGames[`${d.Opp}`] += 1;
    });
    //Kobe Home/Road Avgerages
    homeAwaySplits["homeAvg"] =
      homeAwaySplits["home"] / homeAwaySplits["homeGames"];
    homeAwaySplits["roadAvg"] =
      homeAwaySplits["road"] / homeAwaySplits["roadGames"];
    // Team Splits
    Object.keys(teamSplits).forEach((d) => {
      teamAvg[`${d}`] = teamSplits[`${d}`] / teamGames[`${d}`];
    });

    //Kobe points against every arena
    let sortedArenaPoints = [];
    for (let team in teamAvg) {
      sortedArenaPoints.push([team, teamAvg[team]]);
    }

    sortedArenaPoints.sort(function (a, b) {
      return a[1] - b[1];
    });

    //
    // focus.append("path")
    //     .datum(arr)
    //     .attr("class", "area")
    //     .attr("d", area);

    // *** Parse the date / time
    var formatTime = d3.timeFormat("%H:%M:%S");

    // draw dots
    focus
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "gameEvent")
      // .attr("class", "area")
      .attr("r", (d) => {
        return d.PTS / 6;
      })
      .attr("cx", (d) => {
        return x(d.date);
      })
      .attr("cy", (d) => {
        return y(d.PTS);
      })
      .attr("fill", LAKER_PURPLE)
      .on("click", (d) => {
        updateTable(d);
      })
      .on("mouseover", function (d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `Kobe scored ${d.PTS} points against the ${d.Opp} on ${d.Date}.`
          )
          .style("left", d3.event.pageX + 5 + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    focus
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    focus.append("g").attr("class", "axis axis--y").call(yAxis);

    // context.append("path")
    //     .datum(data)
    //     .attr("class", "area")
    //     .attr("d", area2);

    // context.append("g")
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(0," + height2 + ")")
    //     .call(xAxis2);

    // context.append("g")
    //     .attr("class", "brush")
    //     .call(brush)
    //     .call(brush.move, x.range());

    // focus.append("g")
    //     .attr("class", "zoom")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //     .call(zoom);

    /**
     * Install event listeners on each of the buttons
     * First argument: HTML class name of the button
     * second argument: key identifier used to find the key value pair
     * third argument: radius - affects how big the circle is
     */
    [
      [".rebs", "TRB", 1.6],
      [".pts", "PTS", 6],
      [".asts", "AST", 1.3],
      [".blks", "BLK", 0.4],
      [".stls", "STL", 0.6],
      [".gmsc", "GmSc", 5],
      [".tovs", "TOV", 1],
    ].forEach(([className, keyIdentifer, radius]) => {
      // On click, update with new data
      d3.select(className) //TRB
        .on("click", function () {
          y.domain([
            0,
            d3.max(data, function (d) {
              return d[keyIdentifer];
            }),
          ]);
          // yScale.domain([0, d3.max(dataset, function(d) {
          //     return d[1]; })]);

          // Update circles
          svg
            .selectAll("circle")
            .data(data) // Update with new data
            .transition() // Transition from old to new
            .duration(1000) // Length of animation
            .on("start", function () {
              // Start animation
              d3.select(this) // 'this' means the current element
                // .style("fill", LAKER_PURPLE)
                .attr("fill", LAKER_GOLD) // Change color
                .attr("r", 5); // Change size
            })
            .delay(function (d, i) {
              return (i / data.length) * 500; // Dynamic delay (i.e. each item delays a little longer)
            })
            //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
            .attr("cx", function (d) {
              return x(d.date); // Circle's X
            })
            .attr("cy", function (d) {
              return y(d[keyIdentifer]); // Circle's Y
            })
            .on("end", function () {
              // End animation
              d3.select(this) // 'this' means the current element
                .transition()
                .duration(500)
                .attr("fill", LAKER_PURPLE)
                // .attr("fill", "black")  // Change color
                .attr("stroke", "black")
                .attr("stroke-width", "0")
                .attr("r", (d) => {
                  return d[keyIdentifer] / radius;
                }); // Change radius
            });

          // Update X Axis
          svg.select(".axis--x").transition().duration(1000).call(xAxis);

          // Update Y Axis
          svg.select(".axis--y").transition().duration(100).call(yAxis);
        });
    });
  });

  let teamLogo = {
    ATL: "app/assets/images/9168_atlanta_hawks-primary-2016.png",
    BRK: "app/assets/images/137_brooklyn-nets-primary-2013.png",
    CHA: "app/assets/images/1926_charlotte__hornets_-primary-2015.png",
    CHO: "app/assets/images/1926_charlotte__hornets_-primary-2015.png",
    DET: "app/assets/images/2164_detroit_pistons-primary-2018.png",
    SAS: "app/assets/images/2547_san_antonio_spurs-primary-2018.png",
    NOH: "app/assets/images/2681_new_orleans_pelicans-primary-2014.png",
    NOP: "app/assets/images/2681_new_orleans_pelicans-primary-2014.png",
    DAL: "app/assets/images/3463_dallas_mavericks-primary-2018.png",
    SAC: "app/assets/images/4043_sacramento_kings-primary-2017.png",
    PHO: "app/assets/images/4370_phoenix_suns-primary-2014.png",
    TOR: "app/assets/images/4578_toronto_raptors-primary-2016.png",
    IND: "app/assets/images/4812_indiana_pacers-primary-2018.png",
    LAC: "app/assets/images/5462_los_angeles_clippers-primary-2016.png",
    WAS: "app/assets/images/5671_washington_wizards-primary-2016.png",
    CLE: "app/assets/images/6921_cleveland_cavaliers-primary-2018.png",
    PHI: "app/assets/images/7034_philadelphia_76ers-primary-2016.png",
    MIL: "app/assets/images/8275_milwaukee_bucks-primary-2016.png",
    MIN: "app/assets/images/9669_minnesota_timberwolves-primary-2018.png",
    POR: "app/assets/images/9725_portland_trail_blazers-primary-2018.png",
    BOS: "app/assets/images/boston.png",
    CHI: "app/assets/images/bulls.png",
    DEN: "app/assets/images/denver.gif",
    MEM: "app/assets/images/grizz.gif",
    MIA: "app/assets/images/heat.gif",
    NYK: "app/assets/images/knicks.gif",
    ORL: "app/assets/images/magics.gif",
    OKC: "app/assets/images/okc.png",
    HOU: "app/assets/images/rockets.gif",
    GSW: "app/assets/images/warriors.png",
    UTA: "app/assets/images/utah-jazz-logo.png",
    NOH: "app/assets/images/NOH.gif",
    SEA: "app/assets/images/sonics.gif",
    VAN: "app/assets/images/van-grizz.gif",
    NJN: "app/assets/images/NJN.gif",
    NOK: "app/assets/images/NOH.gif",
    CHH: "app/assets/images/1926_charlotte__hornets_-primary-2015.png",
  };

  function updateTable(d) {
    let pts = document.getElementById("tb-pts");
    let trb = document.getElementById("tb-rebs");
    let asts = document.getElementById("tb-asts");
    let stls = document.getElementById("tb-stls");
    let blks = document.getElementById("tb-blks");
    let tovs = document.getElementById("tb-tovs");
    let fg = document.getElementById("tb-fg");
    let threept = document.getElementById("tb-threept");
    let ft = document.getElementById("tb-ft");
    let oppImg = document.getElementById("oppImg");
    pts.innerText = d.PTS;
    trb.innerText = d.TRB;
    asts.innerText = d.AST;
    stls.innerText = d.STL;
    blks.innerText = d.BLK;
    tovs.innerText = d.TOV;
    fg.innerText = `${((d.FG / d.FGA) * 100).toFixed(1) + "%"}`;
    threept.innerText = `${((d["3P"] / d["3PA"]) * 100).toFixed(1) + "%"}`;
    ft.innerText = `${((d.FT / d.FTA) * 100).toFixed(1) + "%"}`;
    oppImg.src = teamLogo[d.Opp];
  }

  function updateTeamTable(d) {
    let teamPts = document.getElementById("teams-pts");
    let teamGames = document.getElementById("teams-games");
    let teamCity = document.getElementById("teams-city");
    let teamName = document.getElementById("teams-name");
    let opp2Img = document.getElementById("opp2Img");
    teamPts.innerText = `${d.pts} PPG`;
    teamGames.innerText = `${d.games} G`;
    teamCity.innerText = `${d.place}`;
    teamName.innerText = `${d.teamname}`;
    // fg.innerText = `${((d.FG / d.FGA) * 100).toFixed(1) + "%"}`;
    // threept.innerText = `${((d["3P"] / d["3PA"]) * 100).toFixed(1) + "%"}`;
    // ft.innerText = `${((d.FT / d.FTA) * 100).toFixed(1) + "%"}`;
    opp2Img.src = `${teamLogo[d.abb]}`;
  }

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg
      .select(".zoom")
      .call(
        zoom.transform,
        d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
      );
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
    d.TRB = +d.TRB;
    d.AST = +d.AST;
    d.GmSc = +d.GmSc;
    return d;
  }
});
