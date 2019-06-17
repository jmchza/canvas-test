import React, { useState, useEffect } from 'react';
import Pencil, { TOOL_PENCIL } from './Pencil';
import PropTypes from 'prop-types';

export default function Pad(props){
  const {currentItem, data, width, height, canvasClassName} = props
  const [tool, setTool] = useState(props.tool);
  // const [interval, setInterval] = useState(null);

  useEffect(() =>{
    setTool(Pencil(getCtx()))
  }, [])
  
  function getCtx(){
    const g = document.getElementById('myCanvas')
    return g.getContext('2d');
  }

  useEffect(()=>{
    if(currentItem && currentItem.length){
      data.pop()
      getCtx().clearRect(0,0, width, height)
  
      for (let obj of data){
        tool.draw(obj[0], props.animate);
      }
      
      props.resetCurrent()
    }
    
  }, [currentItem])

  useEffect(() => {
    if(data && data.length){
      for (let obj of data){
        tool.draw(obj[0], props.animate);
      }
    }
  }, [data])


  function getCursorPosition(e) {
    const { top, left } = document.getElementById('myCanvas').getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  function onMouseUp(e) {
    const data = tool.onMouseUp(...getCursorPosition(e));
    
    props.onNewClickHandler(data)
  }

  function onMouseMove(e) {
    tool.onMouseMove(...getCursorPosition(e));

  }

  function onMouseDown(e) {
    tool.onMouseDown(...getCursorPosition(e), props.color, props.size, props.fillColor);
  }

    return (
      <canvas id="myCanvas"
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
  canvasClassName: PropTypes.string,
  color: PropTypes.string,
  fillColor: PropTypes.string,
  size: PropTypes.number,
  current: PropTypes.number,
  data: PropTypes.array,
  onNewClickHandler: PropTypes.func
};

Pad.defaultProps = {
  width: 500,
  height: 500,
  color: 'green',
  size: 5,
  fillColor: '',
  canvasClassName: 'canvas',
  debounceTime: 1000,
  data: []
};