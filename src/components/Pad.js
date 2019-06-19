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
    animate: PropTypes.bool,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    // tool: PropTypes.object,
    current: PropTypes.number,
    data: PropTypes.array
  };

  static defaultProps = {
    width: 500,
    height: 500,
    color: 'green',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
    debounceTime: 1000,
    animate: true,
    // tool: TOOL_PENCIL,
    data: []
  };

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    
  }

  shouldComponentUpdate({ items, data, currentItem }){
    // if(!this.tool){
    //   this.ctx = this.getCtx();
    // }

    console.log('data', data, items)

    if(currentItem && currentItem.length){
      data.pop()
      this.getCtx().clearRect(0,0, this.props.width,this.props.height)

      for (let obj of data){
        this.draw(obj, this.props.animate);
      }
      
      this.props.resetCurrent()
      return true
    }
    
    if(data && data.length){
      for (let obj of data){
        this.draw(obj, this.props.animate);
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
    // console.log(item, start, { x, y })
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
    if (!this.stroke) return [];
    const newPoint = {...this.getCursorPosition(e)};
    const start = this.stroke.points.slice(-1)[0];
    console.log('move', newPoint, start)
    this.drawLine(this.stroke, start, newPoint);
    this.stroke.points.push(newPoint);
    this.points.push(newPoint);
    
    return [this.stroke];
  }

  onMouseUp(e) {
    if (!this.stroke) return;
    this.onMouseMove(...this.getCursorPosition(e));
    this.points = [];
    const item = this.stroke;
    this.stroke = null;
    
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
        ref={(canvas)=>{this.refCanvas = canvas}}
      />
    );
  }
}
