// First undefine 'circles' so we can easily reload this file.
require.undef('donut');

define('donut', ['d3'], function (d3) {

    function draw(container, data, width, height) {

        var dataset = data

        var pie=d3.pie()
            .value(function(d){return d.percent})
            .sort(null)
            .padAngle(.03);

        var w=width, h=height;
        var outerRadius=w/2;
        var innerRadius=100;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
 
        var arc=d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        var svg = d3.select(container).append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('class', 'shadow')
            .append('g')
            .attr('transform', 'translate('+w/2+','+h/2+')');

        var path=svg.selectAll('donut')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d,i){return color(d.data.name);});
 
        path.transition()
            .duration(1000)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });
 
 
        var restOfTheData=function(){

            var text=svg.selectAll('text')
                .data(pie(dataset))
                .enter()
                .append("text")
                .transition()
                .duration(200)
                .attr("transform", function (d) {
                     return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".4em")
                .attr("text-anchor", "middle")
                .text(function(d){
                    return d.data.percent+"%";
                })
	        .style('fill', '#fff')
                .style('font-size', '10px');
 
            var legendRectSize=20;
            var legendSpacing=7;
            var legendHeight=legendRectSize+legendSpacing;
 
            var legend=svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr(
                    'transform', function(d,i){
                        //Just a calculation for x & y position
                        return 'translate(-35,' + ((i*legendHeight)-65) + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .attr('rx', 20)
                .attr('ry', 20)
                .style('fill', color)
                .style('stroke', color);
 
            legend.append('text')
                .attr('x', 30)
                .attr('y', 15)
                .text(function(d){
                    return d;
                }).style('fill', '#929DAF')
                .style('font-size', '14px');
        };
 
        setTimeout(restOfTheData,1000);

    }
    return draw;
});

element.append('<small>&#x25C9; &#x25CB; &#x25EF; Loaded donut.js &#x25CC; &#x25CE; &#x25CF;</small>');
