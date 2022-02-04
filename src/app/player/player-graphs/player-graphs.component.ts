import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import {PlayerService} from "../services/player.service";
import {ActivatedRoute} from "@angular/router";
import {Graphs} from "../../../model/graphs";

import * as d3 from "d3-selection";
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from "d3-Axis";

@Component({
  selector: 'app-player-graphs',
  templateUrl: './player-graphs.component.html',
  styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {
  login!: string;
  graphs!: Graphs[]; //0-air_ab, 1-ground_ab, 2-air_rb and so on...

  constructor(private activatedRoute: ActivatedRoute, private playerService: PlayerService) {
    //getting login from url
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });

    //getting graphs form backend
    this.playerService.getPlayerGraphData(this.login).subscribe(
      graphs => {
        this.graphs = graphs;
      });
  }

  ngOnInit(): void {
    //show div with proper id
    setTimeout(() => {
      $('#ground_rb').prop('hidden', false);
      $('')
      this.drawGraphs();
    }, 1500)



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

  drawGraphs() {
    for (let graph of this.graphs) {
      let svg;

      svg = d3.select('#' + graph.mode).select('.battles-per-rank-graph');
      this.drawSingleBarChart(svg, graph.battlesPerRank, graph.ranks, 'battles');
      svg = d3.select('#' + graph.mode).select('.wr-per-rank-graph');
      this.drawSingleBarChart(svg, graph.wrPerRank, graph.ranks, 'wr');
      svg = d3.select('#' + graph.mode).select('.kd-per-rank-graph');
      this.drawSingleBarChart(svg, graph.kdPerRank, graph.ranks, 'kd');

      svg = d3.select('#' + graph.mode).select('.battles-per-nation-graph');
      this.drawSingleBarChart(svg, graph.battlesPerNation, graph.nations, 'battles');
      svg = d3.select('#' + graph.mode).select('.wr-per-nation-graph');
      this.drawSingleBarChart(svg, graph.wrPerNation, graph.nations, 'wr');
      svg = d3.select('#' + graph.mode).select('.kd-per-nation-graph');
      this.drawSingleBarChart(svg, graph.kdPerNation, graph.nations, 'kd');

      svg = d3.select('#' + graph.mode).select('.battles-per-class-graph');
      this.drawSingleBarChart(svg, graph.battlesPerClass, graph.classes, 'battles');
      svg = d3.select('#' + graph.mode).select('.wr-per-class-graph');
      this.drawSingleBarChart(svg, graph.wrPerClass, graph.classes, 'wr');
      svg = d3.select('#' + graph.mode).select('.kd-per-class-graph');
      this.drawSingleBarChart(svg, graph.kdPerClass, graph.classes, 'kd');
    }
  }

  drawSingleBarChart(svg: any, values: any[], xLabels: string[], valTypes: string) {
    let originalValues: number[];
    originalValues = [];
    //changing NaNs and Infinities into 0 - this will need rework
    for (let i = 0; i < values.length; i++) {
      originalValues.push(Number.parseFloat(values[i]));
      values[i] = (values[i] == 'NaN' || values[i] == 'Infinity') ? 0 : values[i];
    }

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = 500 - margin.left - margin.right,
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
    } else if (valTypes == "wr") {
      max = 1;
      yLabel = 'win ratio [%]';
      yAxisVals = function (x: number) {
        return (x * 100).toFixed(0)
      };
      yBarVals = function (x: number) {
        return (x * 100).toFixed(1)
      };
    } else if (valTypes == "kd") {
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
      yScale = d3Scale.scaleLinear().domain([0, max]).range([0, height]).clamp(true),
      xScale = d3Scale.scaleBand().domain(xLabels).range([0, width - margin.left - margin.right]).padding(0.4);

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
        return xScale(xLabels[i])
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
      .call(d3Axis.axisLeft(yScale).tickFormat(function (d: any) {
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
      .call(d3Axis.axisBottom(xScale))
  }

}

