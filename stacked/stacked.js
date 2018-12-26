// First undefine 'stacked' so we can easily reload this file.
require.undef('stacked');

define('stacked', ['d3'], function (d3) {

    const margin = ({top: 0, right: 0, bottom: 10, left: 0})
    var layout = 'stacked';

    function draw(container, data, width, height) {

        // Prepare chart data
        const n = data.length
        const m = data[0].length
        const xz = d3.range(m)
        const yz = data

        const y01z = d3.stack()
            .keys(d3.range(n))
            (d3.transpose(yz)) // stacked yz
            .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

        const yMax = d3.max(yz, y => d3.max(y))
        const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))

        const x = d3.scaleBand()
            .domain(xz)
            .rangeRound([margin.left, width - margin.right])
            .padding(0.08)

        const y = d3.scaleLinear()
            .domain([0, y1Max])
            .range([height - margin.bottom, margin.top])

        const z = d3.scaleSequential(d3.interpolateBlues)
            .domain([-0.5 * n, 1.5 * n])

        const xAxis = svg => svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""))


        width = width || 500;
        height = height || 500;
        var svg = d3.select(container).append("svg")
            .attr('width', width)
            .attr('height', height);

      const rect = svg.selectAll("g")
        .data(y01z)
        .enter().append("g")
            .attr("fill", (d, i) => z(i))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", height - margin.bottom)
            .attr("width", x.bandwidth())
            .attr("height", 0);

        svg.append("g")
            .call(xAxis);

        function transitionGrouped() {
            y.domain([0, yMax]);

            rect.transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("x", (d, i) => x(i) + x.bandwidth() / n * d[2])
                .attr("width", x.bandwidth() / n)
                .transition()
                    .attr("y", d => y(d[1] - d[0]))
                    .attr("height", d => y(0) - y(d[1] - d[0]));
        }

        function transitionStacked() {
            y.domain([0, y1Max]);

            rect.transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .transition()
                    .attr("x", (d, i) => x(i))
                    .attr("width", x.bandwidth());
        }

        function update() {
            if (layout === "stacked") {
                transitionStacked();
                layout = 'grouped'
            }
            else {
                transitionGrouped();
                layout = 'stacked'
            }
        }

        svg.on("click", function() {
            update()
        });

        update();

    }
    return draw;
});

element.append('<small>&#x25C9; &#x25CB; &#x25EF; Loaded stacked.js &#x25CC; &#x25CE; &#x25CF;</small>');
