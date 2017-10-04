// In de variabele stop in de SVG, aan de svg geef ik een margin die hij afrekent van de breedte en de hoogte van de SVG
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Voor zowel de X als Y as pas gebruik ik de scale. Dit pakt de data en zet het om in positie en lengte.
// ScaleBand helpt met de geography van de bars.
// RangeRound zorgt voor het geheel van de top en bottom, dat het niet pixelated wordt. Het zit tussen de 0 en de breedte/hoogte van het object.
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

//In de variabele wordt de class "g" toegevoegd aan de svg. De positie van de X as wordt door middel van translate bepaald met de margins.
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// In de tooltip variabele pak ik de body waar ik een div aan toevoeg met de class toolTip.
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// In deze functie wordt de data gerenderd van speakers. Door = + te doen komt er een positief getal uit die aansluit op de waardes van speakers.
// De data wordt daarna uitgevoerd en gedisplayed als er geen error is.
d3.tsv("languages.tsv", function(d) {
  d.speakers = +d.speakers;
  return d;
},function(error, data) {
  if (error) throw error;

// De data wordt verzameld en bepaald voor de X as en Y as.
  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return d.speakers; })]);

// De SVG's voor de X as wordt gegrouped. Er wordt ook aangegeven wat de X as is.
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Door middel van ticks wordt gezegd hoe precies het aantal moet zijn (werkt per 5 tal) en met format zeg ik dat hij het hoge getal moet verkleinen in Miljoenen.
  g.append("g")
    .call(d3.axisLeft(y).ticks(30).tickFormat(d3.format(".3s")))

// Alle SVG's krijgen de class bar.
// Op de X as is een functie waar hij de language data moet returnen. Dit geldt ook voor de Y as.
// De breedte van de SVG as staat gelijk aan de breedte van de X as
// Als de muis over de bar heen gaat dan wordt de positie bepaald van de div en wat erin moet komen te staan (de data van speakers). Dit wordt in de HTML gezet.
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("y", function(d) { return y(d.speakers); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.speakers); })
      .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.language) + "<br>" + "" + (d.speakers));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
    });
