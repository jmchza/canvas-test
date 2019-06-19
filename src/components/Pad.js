import React, { Component } from 'react';
// import Pencil, { TOOL_PENCIL } from './Pencil';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';

export default class Pad extends Component {

  tool = null;
  interval = null;
  stroke
  points = [];

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    items: PropTypes.array.isRequired,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    current: PropTypes.number,
    data: PropTypes.array
  };

  static defaultProps = {
    width: 500,
    height: 500,
    color: 'green',
    size: 5,
    canvasClassName: 'canvas',
    data: []
  };

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    
  }

  shouldComponentUpdate({  data, currentItem }){

    if(currentItem && currentItem.length){
      data.pop()
      this.getCtx().clearRect(0,0, this.props.width,this.props.height)

      for (let obj of data){
        this.draw(obj[0], this.props.animate);
      }
      
      this.props.resetCurrent()
      return true
    }
    
    if(data && data.length){
      for (let obj of data){
        this.draw(obj[0], this.props.animate);
      }
      return true
    }

    return false
  }

  draw = (item) => {

    for (let i = 0; i < item.points.length; i++) {
      if (!item.points[i - 1]) continue;
      this.drawLine(item, item.points[i - 1], item.points[i]);
    }
  };


  drawLine = (item, start, { x, y }) => {
    const context = this.getCtx()
    context.save();
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.globalCompositeOperation = 'source-over';
    context.moveTo(start.x, start.y);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
  };

  onMouseDown(e) {
    const [x, y] = this.getCursorPosition(e)
    
    this.stroke = {
      id: v4(),
      tool: 'pencil',
      color: this.props.color,
      size: this.props.size,
      points: [{ x, y }]
    };
    return [this.stroke];

  }


  onMouseMove(e) {
    this.move(...this.getCursorPosition(e));
  }

  move = (x, y) => {
    if (!this.stroke) return [];
    const newPoint = { x, y };
    const start = this.stroke.points.slice(-1)[0];
    
    this.drawLine(this.stroke, start, newPoint);
    this.stroke.points.push(newPoint);
    this.points.push(newPoint);
    
    return [this.stroke];
  };

  mouseUp = (x, y) => {
    if (!this.stroke) return;
    this.move(x, y);
    this.points = [];
    const item = this.stroke;
    this.stroke = null;
    return [item];
  };

  onMouseUp(e) {
    
    const item = this.mouseUp(...this.getCursorPosition(e));
    
    this.props.onNewClickHandler(this.props.current, item)
  }

  getCursorPosition(e) {
    const { top, left } = this.refCanvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  getCtx(){
    return this.refCanvas.getContext('2d')
  }

  render() {
    const { width, height, canvasClassName } = this.props;
    return (
      <canvas
        className={canvasClassName}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        width={width}
        height={height}
        onClick={this.props.toggle}
        ref={(canvas)=>{this.refCanvas = canvas}}
      />
    );
  }
}
