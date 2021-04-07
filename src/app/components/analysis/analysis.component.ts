import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  expenseList: Expense[];

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.expenseService.getExpenses().subscribe(response => {
      this.expenseList = response;
      this.pieChart();
      this.barChart(); 
      this.lineChart();
      this.average();
    });
    
  }

  processPieData() {
    let processedData = [];
    processedData.push({name: '<500', value: this.expenseList.filter(element => element.amount < 500).length});
    processedData.push({name: '1000-5000', value: this.expenseList.filter(element => element.amount > 1000 && element.amount < 5000).length});
    processedData.push({name: '>25000', value: this.expenseList.filter(element => element.amount > 25000).length});
    return processedData;
  }

  pieChart() {
    let data = this.processPieData();
    

    let color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    let width = 500;

    let height = Math.min(width, 500);

    let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

    let arcLabel:any = {}
    let radius = Math.min(width, height) / 2 * 0.8;
    arcLabel =  d3.arc().innerRadius(radius).outerRadius(radius);


    let pie = d3.pie()
    .sort(null)
    .value(d => d.value);

    let chart = { arcs: undefined, svg: undefined};
    chart.arcs = pie(data);
    
    chart.svg = d3.select(".pie")
          .attr("viewBox", [-width / 2, -height / 2, width, height]);
    
          chart.svg.append("g")
          .attr("stroke", "white")
        .selectAll("path")
        .data(chart.arcs)
        .join("path")
          .attr("fill", d => color(d.data.name))
          .attr("d", arc)
        .append("title")
          .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
    
          chart.svg.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
        .selectAll("text")
        .data(chart.arcs)
        .join("text")
          .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
          .call(text => text.append("tspan")
              .attr("y", "-0.4em")
              .attr("font-weight", "bold")
              .text(d => d.data.name))
          .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
              .attr("x", 0)
              .attr("y", "0.7em")
              .attr("fill-opacity", 0.7)
              .text(d => d.data.value.toLocaleString()));
    
      chart =  chart.svg.node();
    //}
  }

  barChart() {
    let data = [
      {name: "E", value: 0.12702},
      {name: "T", value: 0.09056},
      {name: "A", value: 0.08167},
      {name: "O", value: 0.07507},
      {name: "I", value: 0.06966},
      {name: "N", value: 0.06749},
      {name: "S", value: 0.06327},
      {name: "H", value: 0.06094},
      {name: "R", value: 0.05987},
      {name: "D", value: 0.04253},
      {name: "L", value: 0.04025},
      {name: "C", value: 0.02782},
      {name: "U", value: 0.02758},
      {name: "M", value: 0.02406},
      {name: "W", value: 0.0236},
      {name: "F", value: 0.02288},
      {name: "G", value: 0.02015},
      {name: "Y", value: 0.01974},
      {name: "P", value: 0.01929},
      {name: "B", value: 0.01492},
      {name: "V", value: 0.00978},
      {name: "K", value: 0.00772},
      {name: "J", value: 0.00153},
      {name: "X", value: 0.0015},
      {name: "Q", value: 0.00095},
      {name: "Z", value: 0.00074}
    ]
    
    let chart: any = {};

    let height = 500;
    let width = 500;
    let margin = ({top: 20, right: 0, bottom: 30, left: 40});

    

    chart.svg = d3.select(".bar")
          .attr("viewBox", [0, 0, width, height]);

    let x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])
      
      
    chart.bar = chart.svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .style("mix-blend-mode", "multiply")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("height", d => y(0) - y(d.value))
    .attr("width", x.bandwidth());

    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))

    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
      
    chart.gx = chart.svg.append("g")
    .call(xAxis);

    chart.gy = chart.svg.append("g")
    .call(yAxis);
    
    chart = Object.assign(chart.svg.node(), {
      update(order) {
        x.domain(data.sort(order).map(d => d.name));
  
        const t = chart.svg.transition()
            .duration(750);
  
            chart.bar.data(data, d => d.name)
            .order()
          .transition(t)
            .delay((d, i) => i * 20)
            .attr("x", d => x(d.name));
  
            chart.gx.transition(t)
            .call(xAxis)
          .selectAll(".tick")
            .delay((d, i) => i * 20);
      }
    });
    //}

    
    //let update = chart.update(order)
    
    
  }

  lineChart() { 

    let data: any = [
      {date: "2007-04-23", value: 93.24},
      {date: "2007-04-24", value: 95.35},
      {date: "2007-04-25", value: 98.84},
      {date: "2007-04-26", value: 99.92},
      {date: "2007-04-29", value: 99.8},
      {date: "2007-05-01", value: 99.47},
      {date: "2007-05-02", value: 100.39},
      {date: "2007-05-03", value: 100.4},
      {date: "2007-05-04", value: 100.81},
      {date: "2007-05-07", value: 103.92},
      {date: "2007-05-08", value: 105.06},
      {date: "2007-05-09", value: 106.88},
      {date: "2007-05-09", value: 107.34},
      {date: "2007-05-10", value: 108.74},
      {date: "2007-05-13", value: 109.36},
      {date: "2007-05-14", value: 107.52},
      {date: "2007-05-15", value: 107.34},
      {date: "2007-05-16", value: 109.44},
      {date: "2007-05-17", value: 110.02},
      {date: "2007-05-20", value: 111.98},
      {date: "2007-05-21", value: 113.54},
      {date: "2007-05-22", value: 112.89},
      {date: "2007-05-23", value: 110.69},
      {date: "2007-05-24", value: 113.62},
      {date: "2007-05-28", value: 114.35},
      {date: "2007-05-29", value: 118.77},
      {date: "2007-05-30", value: 121.19},
      {date: "2007-06-01", value: 118.4},
      {date: "2007-06-04", value: 121.33},
      {date: "2007-06-05", value: 122.67},
      {date: "2007-06-06", value: 123.64},
      {date: "2007-06-07", value: 124.07},
      {date: "2007-06-08", value: 124.49},
      {date: "2007-06-10", value: 120.19},
      {date: "2007-06-11", value: 120.38},
      {date: "2007-06-12", value: 117.5},
      {date: "2007-06-13", value: 118.75},
      {date: "2007-06-14", value: 120.5},
      {date: "2007-06-17", value: 125.09},
      {date: "2007-06-18", value: 123.66}
    ];

    let margin = ({top: 20, right: 30, bottom: 30, left: 40})
    let height = 500;
    let width = 500;

    let line = d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(new Date(d.date)))
    .y(d => y(d.value));

    let x = d3.scaleUtc()
    .domain(d3.extent(data, d => new Date(d.date)))
    .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
    
    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y));
    
    let chart: any = {};
    chart.svg = d3.select(".line")
      .attr("viewBox", [0, 0, width, height]);
    
    chart.svg.append("g")
    .call(xAxis);

    chart.svg.append("g")
    .call(yAxis);

    chart.svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

    chart = chart.svg.node();
  }

  movingAverage(values, N) {
    let i = 0;
    let sum = 0;
    const means = new Float64Array(values.length).fill(NaN);
    for (let n = Math.min(N - 1, values.length); i < n; ++i) {
      sum += values[i];
    }
    for (let n = values.length; i < n; ++i) {
      sum += values[i];
      means[i] = sum / N;
      sum -= values[i - N + 1];
    }
    return means;
  }

  average() {
    let chart: any = {};
    let height = 500;
    let width = 500;
    let margin = ({top: 20, right: 20, bottom: 30, left: 30})
    let parseDate = d3.timeParse("%Y%m%d")
    
    let data = [  {date: "2010-10-01T00:00", high: 59.5, low: 57},
    {date: "2010-10-02T00:00", high: 59.5, low: 53.4},
    {date: "2010-10-03T00:00", high: 59, low: 53.4},
    {date: "2010-10-04T00:00", high: 59.4, low: 54.7},
    {date: "2010-10-05T00:00", high: 58.3, low: 52.7},
    {date: "2010-10-06T00:00", high: 62.1, low: 54.5},
    {date: "2010-10-07T00:00", high: 60.8, low: 53.4},
    {date: "2010-10-08T00:00", high: 61, low: 52.5},
    {date: "2010-10-09T00:00", high: 62.4, low: 52.9},
    {date: "2010-10-10T00:00", high: 65.3, low: 54},
    {date: "2010-10-11T00:00", high: 70.3, low: 55},
    {date: "2010-10-12T00:00", high: 82.2, low: 58.6},
    {date: "2010-10-13T00:00", high: 75.6, low: 57.4},
    {date: "2010-10-14T00:00", high: 75.7, low: 57.7},
    {date: "2010-10-15T00:00", high: 68.4, low: 54.7},
    {date: "2010-10-16T00:00", high: 56.3, low: 52.7},
    {date: "2010-10-17T00:00", high: 54.3, low: 51.8},
    {date: "2010-10-18T00:00", high: 54.9, low: 51.4},
    {date: "2010-10-19T00:00", high: 54.7, low: 50.2},
    {date: "2010-10-20T00:00", high: 56.5, low: 50},
    {date: "2010-10-21T00:00", high: 62.6, low: 55.4},
    {date: "2010-10-22T00:00", high: 59.9, low: 53.8},
    {date: "2010-10-23T00:00", high: 62.2, low: 52.2},
    {date: "2010-10-24T00:00", high: 63, low: 57.9},
    {date: "2010-10-25T00:00", high: 58.5, low: 54.3},
    {date: "2010-10-26T00:00", high: 59.5, low: 51.3},
    {date: "2010-10-27T00:00", high: 59.4, low: 49.8},
    {date: "2010-10-28T00:00", high: 66.6, low: 55.8},
    {date: "2010-10-29T00:00", high: 64.9, low: 53.2},
    {date: "2010-10-30T00:00", high: 59.9, low: 52.3},
    {date: "2010-10-31T00:00", high: 60.4, low: 53.2},
    {date: "2010-11-01T00:00", high: 64.4, low: 54.1},
    {date: "2010-11-02T00:00", high: 66.6, low: 54.7},
    {date: "2010-11-03T00:00", high: 67.8, low: 57.2},
    {date: "2010-11-04T00:00", high: 73.2, low: 62.4},
    {date: "2010-11-05T00:00", high: 72.1, low: 54.1},
    {date: "2010-11-06T00:00", high: 59, low: 53.2},
    {date: "2010-11-07T00:00", high: 59.2, low: 56.1},
    {date: "2010-11-08T00:00", high: 57.4, low: 53.2},
    {date: "2010-11-09T00:00", high: 56.8, low: 47.1},
    {date: "2010-11-10T00:00", high: 59.4, low: 53.1},
    {date: "2010-11-11T00:00", high: 61.2, low: 51.8},
    {date: "2010-11-12T00:00", high: 59.2, low: 49.6},
    {date: "2010-11-13T00:00", high: 63.1, low: 50.7},
    {date: "2010-11-14T00:00", high: 72.1, low: 57},
    {date: "2010-11-15T00:00", high: 75.4, low: 62.4},
    {date: "2010-11-16T00:00", high: 65.5, low: 55.8},
    {date: "2010-11-17T00:00", high: 60.1, low: 52.5},
    {date: "2010-11-18T00:00", high: 55, low: 48.2},
    {date: "2010-11-19T00:00", high: 55, low: 48.9},
    {date: "2010-11-20T00:00", high: 54.3, low: 44.8},
    {date: "2010-11-21T00:00", high: 54.1, low: 47.8},
    {date: "2010-11-22T00:00", high: 54.5, low: 48.2},
    {date: "2010-11-23T00:00", high: 53.4, low: 50.2},
    {date: "2010-11-24T00:00", high: 49.6, low: 42.3},
    {date: "2010-11-25T00:00", high: 49.8, low: 43},
    {date: "2010-11-26T00:00", high: 50.9, low: 44.4},
    {date: "2010-11-27T00:00", high: 52.5, low: 47.7},
    {date: "2010-11-28T00:00", high: 50.5, low: 44.6},
    {date: "2010-11-29T00:00", high: 51.3, low: 41.9}]

    let x = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.date)))
    .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
    .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)]).nice(5)
    .range([height - margin.bottom, margin.top])

    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        )

    
    let area = d3.area()
    .curve(d3.curveStep)
    .x(d => x(new Date(d.date)))
    .y0(d => y(d.low))
    .y1(d => y(d.high))

  
    
    chart.svg = d3.select(".average")
    .attr("viewBox", [0, 0, width, height]);

    
    chart.svg.append("path")
    .datum(data)
    .attr("fill", "steelblue")
    .attr("d", area);

    chart.svg.append("g")
    .call(xAxis);

    chart.svg.append("g")
    .call(yAxis);

    chart = chart.svg.node();
  }
}
