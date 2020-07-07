const w = 1000,
  h = 600,
  padding = 100;

const toolTip = d3.select('#container').append('div').attr('id', 'tooltip');
const row1 = toolTip.append('p').html('Row 1');
const row2 = toolTip.append('p').html('Row 2');
const row3 = toolTip.append('p').attr('class', 'row3').html('Row 3');

svg = d3.select('#container').append('svg').attr('width', w).attr('height', h);

svg
  .append('text')
  .text('Time in Minutes')
  .attr('x', (h / 2) * -1)
  .attr('y', padding - 50)
  .attr('transform', 'rotate(-90)');

const legend = svg
  .append('g')
  .attr('id', 'legend')
  .attr('transform', 'translate(' + (w - padding - 20) + ', ' + h / 2 + ')');
legend
  .append('text')
  .attr('class', 'small')
  .text('No doping allegations')
  .attr('text-anchor', 'end')
  .attr('y', 2);
legend
  .append('text')
  .attr('class', 'small')
  .text('Riders with doping allegations')
  .attr('y', 22)
  .attr('text-anchor', 'end');
legend
  .append('rect')
  .attr('width', 16)
  .attr('height', 16)
  .attr('x', 4)
  .attr('y', -11)
  .attr('fill', 'rgba(0, 255, 0, 0.5)')
  .attr('stroke', 'black')
  .attr('stroke-width', 1);
legend
  .append('rect')
  .attr('width', 16)
  .attr('height', 16)
  .attr('x', 4)
  .attr('y', 10)
  .attr('fill', 'rgba(255, 0, 0, 0.5)')
  .attr('stroke', 'black')
  .attr('stroke-width', 1);

svg
  .append('text')
  .text('Doping in Professional Bicycle Racing')
  .attr('class', 'big')
  .attr('id', 'title')
  .attr('x', '50%')
  .attr('y', 40)
  .attr('text-anchor', 'middle');

svg
  .append('text')
  .text("35 Fastest times up Alpe d'Huez")
  .attr('class', 'medium')
  .attr('id', 'sub-heading')
  .attr('x', '50%')
  .attr('y', 60)
  .attr('text-anchor', 'middle');

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then((data) => {
  createScatterPlot(data);
});

function createScatterPlot(obj) {
  const specifier = '%M:%S';
  const parsedMinutes = obj.map((d) => {
    return d3.timeParse(specifier)(d.Time);
  });
  console.log(parsedMinutes[0]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(parsedMinutes))
    .range([0, h - padding * 2]);

  const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
    return d3.timeFormat(specifier)(d);
  });

  const yearsArray = obj.map((d) => d.Year);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(yearsArray) - 1, d3.max(yearsArray) + 1])
    .range([0, w - padding * 2]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ', ' + padding + ')')
    .attr('id', 'y-axis')
    .call(yAxis);
  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ', ' + (h - padding) + ')')
    .attr('id', 'x-axis')
    .call(xAxis);

  svg
    .selectAll('circle')
    .data(obj)
    .enter()
    .append('circle')
    .attr('cy', (d, i) => yScale(parsedMinutes[i]) + padding)
    .attr('cx', (d, i) => xScale(yearsArray[i]) + padding)
    .attr('r', 6)
    .attr('class', 'dot')
    .attr('data-xvalue', (d, i) => yearsArray[i])
    .attr('data-yvalue', (d, i) => parsedMinutes[i])
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', (d) =>
      d.Doping !== '' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)'
    )
    .on('mouseover', (d, i) => {
      row1.html(d.Name + ': ' + d.Nationality);
      row2.html('Year: ' + d.Year + ', Time: ' + d.Time);
      if (d.Doping !== '') {
        row3.html(d.Doping).attr('class', 'row3 visible');
      } else {
        row3.attr('class', 'row3 hidden');
      }
      toolTip
        .style('left', xScale(yearsArray[i]) + padding + 20 + 'px')
        .style(
          'top',
          yScale(parsedMinutes[i]) +
            padding -
            toolTip.node().getBoundingClientRect().height / 2 +
            'px'
        )
        .attr('class', 'visible')
        .attr('data-year', yearsArray[i]);
    })
    .on('mouseleave', (d) => {
      toolTip.attr('class', '');
    });
}
