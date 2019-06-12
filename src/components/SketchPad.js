import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Pencil, { TOOL_PENCIL } from './Pencil';
import PropTypes from 'prop-types';

export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
};

export default class SketchPad extends Component {

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
    onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
    onEveryItemChange: PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
    onDebouncedItemChange: PropTypes.func, // function(idStroke, points:Point[]) { ... }
    onCompleteItem: PropTypes.func, // function(stroke:Stroke) { ... }
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
    toolsMap,
    data: []
  };

  constructor(props) {
    super(props);
    this.initTool = this.initTool.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDebouncedMove = this.onDebouncedMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

  }


  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.initTool(this.props.tool);

  }

  // shouldComponentUpdate({ tool, items, data }, nextState){
  //   items
  //     .filter(item => this.props.items.indexOf(item) === -1)
  //     .forEach(item => {
  //       this.initTool(item.tool);
  //       this.tool.draw(item, this.props.animate);
  //     });

  //   this.initTool(tool);

  //   if(data && data.length){
  //     for (let obj of data){
  //       this.tool.draw(obj[0], this.props.animate);
  //     }
  //     return true
  //   }

  //   return false
  // }

  componentWillReceiveProps({ tool, items, data, currentItem }) {
    items
      .filter(item => this.props.items.indexOf(item) === -1)
      .forEach(item => {
        this.initTool(item.tool);
        this.tool.draw(item, this.props.animate);
      });
    this.initTool(tool);

    if(data && data.length){
      console.log('TT', data.length)
      for (let obj of data){
        
        this.tool.draw(obj[0], this.props.animate);
      }
    }

    // console.log('isin here', currentItem)
    // if(currentItem && currentItem.points !== undefined){
    //   this.tool.draw(currentItem, this.props.animate);
    // }
  }

  initTool(tool) {
    this.tool = this.props.toolsMap[tool](this.ctx);
  }

  onMouseDown(e) {
    const data = this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor);
    console.log('onMouseDown:data', data)
    data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data);
    
    if (this.props.onDebouncedItemChange) {
      this.interval = setInterval(this.onDebouncedMove, this.props.debounceTime);
    }
  }

  onDebouncedMove() {
    if (typeof this.tool.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove());
    }
  }

  onMouseMove(e) {
    const data = this.tool.onMouseMove(...this.getCursorPosition(e));
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);

    // this.setState({lastItem: data})
  }

  onMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
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
        ref={(canvas) => { this.canvasRef = canvas; }}
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
