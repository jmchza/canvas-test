import React, { useState, useEffect } from 'react';
import Pencil, { TOOL_PENCIL } from './Pencil';
import PropTypes from 'prop-types';

export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
};

export default function Pad(props){
  const [tool, setTool] = useState(null);
  const [interval, setInterval] = useState(null);

  useEffect(() =>{
    const g = document.getElementById('myCanvas')
    const ctx = g.getContext('2d');
    setTool(Pencil(ctx))
  }, [])
  
  function getCtx(){
    const g = document.getElementById('myCanvas')
    return g.getContext('2d');
  }

  useEffect(()=>{
    if(props.currentItem && props.currentItem.length){
      props.data.pop()
      getCtx().clearRect(0,0, props.width, props.height)
  
      for (let obj of props.data){
        tool.draw(obj[0], props.animate);
      }
      
      props.resetCurrent()
    }
    
  }, [props.currentItem])

  useEffect(() => {
    if(props.data && props.data.length){
      for (let obj of props.data){
        tool.draw(obj[0], props.animate);
      }
    }
  }, [props.data])

  useEffect(() => {
    props.items
    .filter(item => props.items.indexOf(item) === -1)
    .forEach(item => {
      // tool(item.tool);
      tool.draw(item, props.animate);
    }, [props.items]);
  })

  function getCursorPosition(e) {
    const { top, left } = document.getElementById('myCanvas').getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  // function onDebouncedMove() {
  //   if (typeof tool.onDebouncedMouseMove == 'function' && props.onDebouncedItemChange) {
  //     props.onDebouncedItemChange.apply(null, tool.onDebouncedMouseMove());
  //   }
  // }

  function onMouseUp(e) {
    const data = tool.onMouseUp(...getCursorPosition(e));
    
    data && data[0] && props.onCompleteItem && props.onCompleteItem.apply(null, data);
    if (props.onDebouncedItemChange) {
      clearInterval(interval);
      setInterval(null)
    }
    
    props.onNewClickHandler(props.current, data)
  }

  function onMouseMove(e) {
    tool.onMouseMove(...getCursorPosition(e));

  }

  function onMouseDown(e) {
    tool.onMouseDown(...getCursorPosition(e), props.color, props.size, props.fillColor);
  }

    const { width, height, canvasClassName } = props;
    return (
      <canvas id="myCanvas"
        // ref={props.canvasRef}
        className={canvasClassName}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseUp}
        onMouseUp={onMouseUp}
        width={width}
        height={height}
        
      />
    );
}


Pad.propTypes = {
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

Pad.defaultProps = {
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