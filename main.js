    let svg2 = d3.select(".svg2");

    // var projection = d3.geoAlbersUsa()
    //   .scale(200)
    //   .translate([width / 2, height / 2]);

    let projection = d3.geoAlbersUsa();
    // .fitSize([900,600],)
    //
    // let path = d3.geoPath();
    var path = d3.geoPath()
    .projection(projection);


      d3.json("data/us.json", function(error, us) {
        if (error) throw error;


    // let projection = d3.geoAlbersUsa()
    //   .fitSize([0,0],[700,300],us)
    //
    // let path = d3.geoPath();
    // .projection(projection);

    svg2.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path);

    svg2.append("path")
    .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) {
          return a !== b; })));

          d3.csv("data/NBA-teams2.csv", (data) => {

        svg2.selectAll(".map-circles")
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
            .attr("fill", "#FDB927")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("cursor", "pointer")
                    .style("opacity", .9);
                tooltip.html(`${d.place} ${d.teamname}`)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", (d) => {
                updateTeamTable(d);
            });


    //Adding paths

    function startMap(){
        let links = [];
              for(let i=0; i < data.length-1; i++){
        // (note: loop until length - 1 since we're getting the next
        //  item with i+1)
        links.push({
            coordinates: [
                [data[i].lon, data[i].lat],
                [data[i + 1].lon, data[i + 1].lat]
            ]
        });
    }

    // Standard enter / update

              for (let i = 0; i < links.length; i++) {
        svg2.selectAll(`line${i}`)
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
            .style("stroke", "#552583")
            .style("stroke-width", "2");

    }
  }

  //Start the Map
  const mapBtn = document.querySelector("#conquest-btn-container button");
  mapBtn.addEventListener('click',startMap);

});

});
