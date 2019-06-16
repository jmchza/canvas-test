import React, { Component } from 'react';
import Pencil, { TOOL_PENCIL } from './Pencil';
import PropTypes from 'prop-types';

export default class Pad extends Component {

  tool = null;
  interval = null;

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    items: PropTypes.array.isRequired,
    animate: PropTypes.bool,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    fillColor: PropTypes.string,
    size: PropTypes.number,
    tool: PropTypes.string,
    toolsMap: PropTypes.object,
    onItemStart: PropTypes.func, 
    onEveryItemChange: PropTypes.func, 
    onDebouncedItemChange: PropTypes.func, 
    onCompleteItem: PropTypes.func, 
    debounceTime: PropTypes.number,
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
    tool: TOOL_PENCIL,
    data: []
  };

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById('miCanvas')
    this.ctx = this.canvas.getContext('2d');
    this.tool = Pencil(this.ctx)
  }

  shouldComponentUpdate({ tool, items, data, currentItem }){
    if(currentItem && currentItem.length){
      data.pop()
      this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height)

      for (let obj of data){
        this.tool.draw(obj[0], this.props.animate);
      }
      
      this.props.resetCurrent()
      return true
    }
    
    if(data && data.length){
      for (let obj of data){
        this.tool.draw(obj[0], this.props.animate);
      }
      return true
    }

    return false
  }

  onMouseDown(e) {
    this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor);
  }

  onMouseMove(e) {
    this.tool.onMouseMove(...this.getCursorPosition(e));
  }

  onMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    
    this.props.onNewClickHandler(this.props.current, data)
  }

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  render() {
    const { width, height, canvasClassName } = this.props;
    return (
      <canvas
        id="miCanvas"
        className={canvasClassName}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        width={width}
        height={height}
        
      />
    );
  }
}
