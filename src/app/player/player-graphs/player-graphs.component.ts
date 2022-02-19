import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import {PlayerService} from "../services/player.service";
import {ActivatedRoute} from "@angular/router";
import {GameModeDetails} from "../../../model/GameModeDetails";

import * as d3 from "d3";

@Component({
  selector: 'app-player-graphs',
  templateUrl: './player-graphs.component.html',
  styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {
  login!: string;
  graphs!: GameModeDetails[]; //0-air_ab, 1-ground_ab, 2-air_rb and so on...

  constructor(private activatedRoute: ActivatedRoute, private playerService: PlayerService) {

  }

  ngOnInit(): void {
    //getting login from url
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });

    //getting graphs form backend
    this.playerService.getGameModeDetails(this.login).subscribe(
      graphs => {
        this.graphs = graphs;
      });

    //show div with proper id
    setTimeout(() => {
      $('#rb_ground').prop('hidden', false);
      this.drawCharts();
    }, 1000)



  }

  changeMode(el: HTMLLIElement) {
    $(el).siblings().each(function () {
      $(this).removeClass("tab-active");
    })

    $(el).addClass("tab-active");

    //hiding all divs with graphs
    let id = el.getAttribute('value');
    $('.mode-container').each((i, el) => {
      el.hidden = true;
    });

    //show div with proper id
    $('#' + id).prop('hidden', false);
  }

  drawCharts() {
    for (let graph of this.graphs) {
      let svg;

      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.battles-per-rank-graph');
      this.drawBarChart(svg, graph.battlesPerRank, graph.ranks, 'battles');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.wr-per-rank-graph');
      this.drawBarChart(svg, graph.wrPerRank, graph.ranks, 'wr');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.kd-per-rank-graph');
      this.drawBarChart(svg, graph.kdPerRank, graph.ranks, 'kd');

      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.battles-per-nation-graph');
      this.drawBarChart(svg, graph.battlesPerNation, graph.nations, 'battles');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.wr-per-nation-graph');
      this.drawBarChart(svg, graph.wrPerNation, graph.nations, 'wr');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.kd-per-nation-graph');
      this.drawBarChart(svg, graph.kdPerNation, graph.nations, 'kd');

      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.battles-per-class-graph');
      this.drawBarChart(svg, graph.battlesPerClass, graph.classes, 'battles');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.wr-per-class-graph');
      this.drawBarChart(svg, graph.wrPerClass, graph.classes, 'wr');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.kd-per-class-graph');
      this.drawBarChart(svg, graph.kdPerClass, graph.classes, 'kd');

      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.battles-per-status-graph');
      this.drawBarChart(svg, graph.battlesPerStatus, graph.statuses, 'battles');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.wr-per-status-graph');
      this.drawBarChart(svg, graph.wrPerStatus, graph.statuses, 'wr');
      svg = d3.select('#' + graph.mode+'_'+graph.type).select('.kd-per-status-graph');
      this.drawBarChart(svg, graph.kdPerStatus, graph.statuses, 'kd');

      // svg = d3.select('#' + graph.mode+'_'+graph.type).select('.battles-br-nation-heatmap');
      // this.drawHeatmap(svg, graph.battlesBrNationHeatMap, graph.battleRatings, graph.nations, 'battles');
      // svg = d3.select('#' + graph.mode+'_'+graph.type).select('.wr-br-nation-heatmap');
      // this.drawHeatmap(svg, graph.wrBrNationHeatmap, graph.battleRatings, graph.nations, 'wr');
      // svg = d3.select('#' + graph.mode+'_'+graph.type).select('.kd-br-nation-heatmap');
      // this.drawHeatmap(svg, graph.kdBrNationHeatmap, graph.battleRatings, graph.nations, 'kd');
    }
  }

  drawBarChart(svg: any, values: any[], xLabels: string[], valTypes: string) {
    let originalValues: number[];
    originalValues = [];
    //changing NaNs and Infinities into 0 - this will need rework
    for (let i = 0; i < values.length; i++) {
      originalValues.push(Number.parseFloat(values[i]));
      values[i] = (values[i] == 'NaN' || values[i] == 'Infinity') ? 0 : values[i];
    }

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = 470 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    // set the scale for values
    let max = 0, yLabel = "", yAxisVals: any, yBarVals: any;
    if (valTypes == "battles") {
      max = 20_000;
      yLabel = 'battles [1000]';
      yAxisVals = function (x: number) {
        return (x / 1000).toFixed(0)
      }; //values on y axis
      yBarVals = function (x: number) {
        return x
      }; //values seen above bar
    }
    else if (valTypes == "wr") {
      max = 1;
      yLabel = 'win ratio [%]';
      yAxisVals = function (x: number) {
        return (x * 100).toFixed(0)
      };
      yBarVals = function (x: number) {
        return (x * 100).toFixed(1)
      };
    }
    else if (valTypes == "kd") {
      max = 4;
      yLabel = 'k/d ratio';
      yAxisVals = function (x: number) {
        return x.toFixed(1)
      }
      yBarVals = function (x: number) {
        return x.toFixed(2)
      };
    }

    max = Math.max(max, ...values);
    //setting max value to bars with infinity value
    for (let i = 0; i < values.length; i++) {
      values[i] = originalValues[i] == Infinity ? max : values[i];
    }

    let
      yScale = d3.scaleLinear().domain([0, max]).range([0, height]).clamp(true),
      xScale = d3.scaleBand().domain(xLabels).range([0, width-10]).padding(0.65);

    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //drawing bars
    g.selectAll("div.rect")
      .data(values).enter()
      .append("rect").attr("width", 20)
      .attr("height", function (d: any) {
        return yScale(d)
      })
      .attr("x", function (d: any, i: any) {
        return xScale(xLabels[i]);
      })
      .attr("y", function (d: any) {
        return height - yScale(d)
      })

    //adding values to the bars
    g.selectAll("text.bar")
      .data(values).enter().append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", function (d: any, i: any) { // @ts-ignore
        return xScale(xLabels[i]) + 10
      })
      .attr("y", function (d: any) {
        return height - yScale(d) - 2
      })
      .text(function (d: any, i: any) {
        return yBarVals(originalValues[i]);
      });

    //setting label for y axis
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel);

    //settingy y axis and values
    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(function (d: any) {
        return yAxisVals(max - d);
      }).ticks(10))
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    //setting x axis and values
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
  }

  drawHeatmap(svg:any, values:any[][], xLabels: string[], yLabels:string[], valTypes:string) {
    console.log(values);
    let originalValues: number[][];
    originalValues = [];
    //changing NaNs and Infinities into 0 - this will need rework
    for (let i = 0; i < values.length; i++) {
      originalValues.push([]);
      for (let j = 0; j < values[i].length; j++) {
        originalValues[i].push(Number.parseFloat(values[i][j]));
        values[i][j] = (values[i][j] == 'NaN' || values[i][j] == 'Infinity') ? 0 : values[i];
      }
    }

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = 470 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    // set the scale for values
    let max = 0, yLabel = "", yAxisVals: any, yBarVals: any;
    if (valTypes == "battles") {
      max = 20_000;
      yLabel = 'battles [1000]';
      yAxisVals = function (x: number) {
        return (x / 1000).toFixed(0)
      }; //values on y axis
      yBarVals = function (x: number) {
        return x
      }; //values seen above bar
    }
    else if (valTypes == "wr") {
      max = 1;
      yLabel = 'win ratio [%]';
      yAxisVals = function (x: number) {
        return (x * 100).toFixed(0)
      };
      yBarVals = function (x: number) {
        return (x * 100).toFixed(1)
      };
    }
    else if (valTypes == "kd") {
      max = 4;
      yLabel = 'k/d ratio';
      yAxisVals = function (x: number) {
        return x.toFixed(1)
      }
      yBarVals = function (x: number) {
        return x.toFixed(2)
      };
    }

    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  }

  typePerRank = 'battles';
  typePerNation = 'battles';
  typePerClass = 'battles';
  typePerStatus = 'battles';
  brNationHeatmap = 'battles';

  setGraph(type:string ,value:string){
    switch (type) {
      case 'rank' :
        this.typePerRank = value;
        break;
      case 'nation' :
        this.typePerNation = value;
        break;
      case 'class' :
        this.typePerClass = value;
        break;
      case 'status' :
        this.typePerStatus = value;
        break;
      case 'heatmap' :
        this.brNationHeatmap = value;
        break;
    }
    //$('.per-rank .btn-active').removeClass('btn-active');
    $('.per-'+type+' .btn-active').removeClass('btn-active');
    $('.per-'+type+' .'+value).addClass('btn-active');
    }
}

