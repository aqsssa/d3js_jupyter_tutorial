// First undefine 'treemap' so we can easily reload this file.
require.undef('treemap');

define('treemap', ['d3'], function (d3) {


    /**
     * Generates a GUID string.
     * @returns {String} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser (slavik@meltser.info).
     * @link http://slavik.meltser.info/?p=142
     */
    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }


    function draw(container, data, width, height) {

        const treemap = data => d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true)
            (d3.hierarchy(data)
                .sum(d => d.size)
                .sort((a, b) => b.height - a.height || b.value - a.value))

        const format = d3.format(",d")

        const color = d3.scaleOrdinal().range(d3.schemeCategory10)

        const root = treemap(data);

        const svg = d3.select(container).append("svg")
            .style("font", "9px sans-serif")
            .attr('width', "100%")
            .attr('height', height);

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
                .attr("transform", d => `translate(${d.x0},${d.y0})`);

        leaf.append("title")
            .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

        leaf.append("rect")
            .attr("id", d => (d.leafUid = "leaf" + guid()).id)
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", 0.6)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        leaf.append("clipPath")
            .attr("id", d => (d.clipUid = "clip" + guid()).id)
            .append("use")
                .attr("xlink:href", d => d.leafUid.href);

        leaf.append("text")
            .attr("clip-path", d => d.clipUid)
            .selectAll("tspan")
                .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
                .enter().append("tspan")
                    .attr("x", 3)
                    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                    .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                    .text(d => d);

    }
    return draw;
});

element.append('<small>&#x25C9; &#x25CB; &#x25EF; Loaded treemap.js &#x25CC; &#x25CE; &#x25CF;</small>');
