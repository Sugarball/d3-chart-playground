import React, { Component } from 'react'
import * as d3 from "d3"
import _ from 'lodash'
import { styles } from './index.css'

class AreaLineChart extends Component {

  componentDidMount() {
    
    
    var svg = d3.select(this.mainSvg).attr('class', 'main-svg'),
      svgPosition = svg.node().getBoundingClientRect(),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svgPosition.width - margin.left - margin.right,
      height = +svgPosition.height - margin.top - margin.bottom,
      // g1 = svg.append('foreignObject').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').append('svg'),
      g1 = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
      g2 = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
      innerSvg = g1.append('foreignObject').append('svg');
    
    
    
    
    var x = d3.scaleTime()
      .rangeRound([0, width])
    
    var y = d3.scaleLinear()
      .rangeRound([height, 0])
    
    var area = d3.area()
      .x(function(d) { return x(d.date) })
      .y1(function(d) { return y(d.close) })
    
    var line = d3.area()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.close) })    
    
    
    let dataSet = dataGenerator(3)
    
    let offsetX = dataSet[0][4].date
    
    // let color = d3.scaleOrdinal(d3.schemeCategory20c)
    
    let color = d3.scaleLinear().domain([1, dataSet.length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#f72c2c"), d3.rgb('#f7af2c')])
    
    x.domain(d3.extent(dataSet[0], function(d) { return d.date }))
    y.domain([0, d3.max(_.flatten(dataSet), function(d) { return d.close })])
    
    area.y0(y(0))
    
    
    let yAxis = g1.append('g')
      .call(d3.axisLeft(y).ticks(5))
    yAxis.selectAll('.domain').attr('stroke', 'white')
    yAxis.selectAll('line').attr('stroke', 'lightgrey').attr('x2', width).attr('opacity', .2)
    yAxis.selectAll('.tick text').attr('fill', 'lightgrey')
    yAxis.selectAll('.domain')
    yAxis.select('.domain')
      .remove()
    
    innerSvg.attr('width', 0)
      .attr('height', height)
    
    dataSet.forEach((data, index) => {
      data.forEach(d => {
        d.date = d.date
        d.close = Number(d.close)
      })
    
      let _color = color(index)
      g2.append('path')
        .datum(data)
        .attr('stroke', _color)
        .attr('fill', 'transparent')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-dasharray', '5, 10')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', line)
        
      innerSvg.append('path')
        .datum(data)
        .attr('fill', _color)
        .attr('fill-opacity', .2)
        .attr('stroke', _color)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', area)
    
      
    })
    
    
    let dragLine = g1.append('path')
      .attr('class', 'drag-line')
      .attr('d', `M${0},${y(0)}L${0},0`)
      .attr('stroke', 'lightgrey')
      .attr('stroke-width', 3)
      
    dragLine.call(
      d3.drag()
        .on('start', function(){ return d3.select(this).raise() })
        .on('drag', function(){
          let dx = d3.event.sourceEvent.clientX
          let _x = dx - margin.left
          let _base = 0
          let _width = width
          let _offset = _x < _base ? _base : _x > _width ? _width : _x
          innerSvg.attr('width', _offset)
          d3.select(this)
            .attr('transform', () => {
              return `translate(${_offset})`
            })
        })
      )
    innerSvg
      .transition()  
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('width', x(offsetX))
    
    dragLine
      .transition()  
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('transform', `translate(${x(offsetX)})`)
  }

  render() {
    return (
      <div className={styles}>
        <svg width='100%' height='300' ref={mainSvg => this.mainSvg = mainSvg}></svg>
      </div>
    )
  }
}

function dataGenerator(_num) {
  let output = []
  let dateList = d3.scaleTime()
    .domain([new Date(2000, 0, 1, 0), new Date(2000, 0, 1, 2)])
  dateList = dateList.ticks(d3.timeMinute.every(15))
    

  for (let i = 0; i < _num; i++) {
    let _o = []
    dateList.forEach((_date, _i) => {
      _o.push({
        date: _date,
        close: Math.floor(d3.randomUniform(100)())
      })
    })
    output.push(_o)
  } 
  console.log('output', output)
  return output
}

export default AreaLineChart
