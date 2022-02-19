import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../services/player.service";
import {GameModeOverall} from "../../../model/GameModeOverall";
import * as d3 from 'd3';
import * as $ from "jquery";

@Component({
  selector: 'app-player-overall-stats',
  templateUrl: './player-overall-stats.component.html',
  styleUrls: ['./player-overall-stats.component.css']
})
export class PlayerOverallStatsComponent implements OnInit {
  login!: string;
  data!: GameModeOverall[];

  constructor(private activatedRoute: ActivatedRoute, private playerService: PlayerService) {}

  ngOnInit(): void {
    //getting login from url
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });

    //getting graphs form backend
    this.playerService.getGameModeOverallData(this.login).subscribe(
      data => {
        this.data = data;
      });
    setTimeout(() => {
      this.drawCharts();
    }, 1000)
  }

  compareModes = function(m1:GameModeOverall,m2:GameModeOverall)
    {return m2.battles-m1.battles};

  drawCharts(){
    let svg;
    svg = d3.select('#battles-pie-chart');
    this.drawPieChart(svg, this.data)
  }

  drawPieChart(svg:any, data:GameModeOverall[]) {
    let battles: number[];
    battles = [];
    let sumOfBattles = 0.0;

    for (let i of data){
      battles.push(i.battles);
      sumOfBattles += i.battles;
    }

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 0, bottom: 10, left: 50},
      width = 450 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let
      innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
      outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
      labelRadius = (innerRadius * 0.2 + outerRadius * 0.8); // center radius of labels

    let g = svg.append("g")
      .attr("transform", "translate(" +width/3 + ","+ (margin.top+height/2) +")");

    let color = d3.scaleOrdinal()
      .range(["#3554af", "#ffa101", "#7b6888",
        "#01afec", "#c21296", "#fe4728"]);

    // Generate the pie
    let pie = d3.pie();

    // Generate the arcs
    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius),
      arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // Compute the position of each group on the pie:


    //Generate groups
    let arcs = g.selectAll("arc")
      .data(pie(battles))
      .enter()
      .append("g")
      .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
      .attr("fill", function(d:any, i:any) {
        return color(i);
      })
      .attr("d", arc)
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    g.selectAll('arc')
      .data(pie(battles))
      .enter()
      .append('text')
      .text(function(d:any,i:any){return (battles[i]/sumOfBattles*100)<5? '' : (battles[i]/sumOfBattles*100).toFixed(0)+'%'})
      .attr("transform", function(d:any) { return "translate(" + arcLabel.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17);

    // Add one dot in the legend for each name.
    var size = 20
    svg.selectAll("dots")
      .data(battles)
      .enter()
      .append("rect")
      .attr("x", width/1.5)
      .attr("y", function(d:any,i:any){ return 50 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d:any,i:any){ return color(i)})
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", 0.7);

// Add one dot in the legend for each name.
    svg.selectAll("labels")
      .data(data)
      .enter()
      .append("text")
      .attr("x", width/1.5 + size*1.2)
      .attr("y", function(d:any,i:any){ return 50 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function(d:any){ return d.mode.toUpperCase()+' '+d.type})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

  }
}

