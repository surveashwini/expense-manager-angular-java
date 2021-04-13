import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  expenseList: Expense[] = [];
  showCharts: boolean;

  constructor(private expenseService: ExpenseService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showCharts = false;
    this.expenseService.getExpenses().subscribe(response => {
      this.expenseList = response;
      if(this.expenseList.length > 0) {
        this.showCharts = true;
        setTimeout(() => {
          this.pieChart();
          this.barChart(); 
          this.lineChart();
          this.average();
          this.cdr.detectChanges();
        },1000)
      } else {
        this.showCharts = false;
      }
    });
    
  }

  processData() {
    let processedData = [];
    processedData.push({name: '1000-5000', value: this.expenseList.filter(element => element.amount > 1000 && element.amount < 5000).length});
    processedData.push({name: '>25000', value: this.expenseList.filter(element => element.amount > 25000).length});
    return processedData;
  }

  pieChart() {
    let data = this.processData();
    
    if(data.length > 0) {
      let color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

      let width = 400;

      let height = Math.min(width, 400);

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
    } else {
      this.showCharts = false;
    }
  }

  barChart() {
    let data = this.processData()
    if(data.length > 0) {
      let chart: any = {};

      let height = 400;
      let width = 400;
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
      
      chart = chart.svg.node() && Object.assign(chart.svg.node(), {
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
    } else {
      this.showCharts = false;
    }
    
  }

  lineChart() { 
    let data: any = this.processLineData();

    if(data.length > 0) {
      let margin = ({top: 20, right: 30, bottom: 30, left: 40})
      let height = 400;
      let width = 400;
  
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
    } else {
      this.showCharts = false;
    }
  }

  processLineData() {
    let processedData = [];
    this.expenseList.forEach(element => {
      if(new Date(element.expenseDate) <= new Date) {
        processedData.push({date: element.expenseDate, value: element.amount});
      }
    });
    return processedData;
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
    let height = 400;
    let width = 400;
    let margin = ({top: 20, right: 20, bottom: 30, left: 50})
    let parseDate = d3.timeParse("%Y%m%d")
    
    let data = this.processAverageData();

    if(data.length > 0) {
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
    } else {
      this.showCharts = false;
    }
  }

  processAverageData() {
    let processedData = [];
    this.expenseList.forEach(element => {
      if(new Date(element.expenseDate) <= new Date) {
        processedData.push({date: element.expenseDate, high: element.amount, low: (element.amount / 10)});
      }
    });
    return processedData;
  }
}
