import React, { Component } from 'react';
import SketchPad from './SketchPad'
import {TOOL_PENCIL} from './Pencil'
import Button from './Button'

export default class SketchExample extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      tool:TOOL_PENCIL,
      size: 2,
      color: 'green',
      fill: false,
      fillColor: '#FFF',
      items: [],
      clicks: 0,
      total: 0,
      data: [],
      currentItem:{}
    }
  }

  componentDidMount() {
    const history = JSON.parse(localStorage.getItem('history'))
    const total = localStorage.getItem('total')

    console.log('jhistory', history)
    if(history && history.length){
      this.setState({total: total ? total : 0, data: history})
    }
    this.setState({total: total ? total : 0})
  }

  onNewClickHandler = (current, data) => {
    console.log('D', current, data)
    
    let {data: records} = this.state
    const val = current + 1;

    if(data) {
      records.push(data)
      console.log('Length', records.length)
      this.setState({clicks: val, data: records})
    }else{
      this.setState({clicks: val})
    }

  }

  saveHandler = (e) => {
    
    localStorage.setItem('total', parseInt(this.state.clicks, 10))
    localStorage.setItem('history', JSON.stringify(this.state.data))

    this.setState({total: parseInt(this.state.clicks, 10)})
  }

  undoLastDrawing = (e) =>{
    const {currentItem} = this.state

    currentItem[0].color= 'white'
    console.log('currentItem', currentItem[0])
  }

  render() {
    const { tool, size, color, items, clicks, data, currentItem } = this.state;
    const rwidth = window.innerWidth - 600
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch',}}>
          <div style={{flexGrow: 1, }}>
            <label>color:</label>
            <Button isEnable={true} type="btn btn-success button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'green'})}/>
            <Button isEnable={true} type="btn btn-danger button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'red'})}/>
            <Button isEnable={true} type="btn btn-dark button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'black'})}/>
            
            <Button isEnable={true} type="btn btn-outline-success button" value="Undo last click" 
              onClickHandlker={this.undoLastDrawing}/>
            <Button isEnable={true} type="btn btn-outline-success button" value="save" 
              onClickHandlker={this.saveHandler}/>
          </div>
          <div style={{flexGrow: 8, marginLeft: rwidth}}>
            <div>
              <label>click total:</label>{parseInt(this.state.total, 10)}
            </div>
            <div>
              <label>clicks this session:</label>{this.state.clicks}
            </div>
          </div>
        </div>
        <div style={{float:'left', marginRight:20, border:'1px solid #d3d3d3'}}>
          <SketchPad
            width={1400}
            height={500}
            size={size}
            color={color}
            // fillColor={fill ? fillColor : ''}
            items={items}
            tool={tool}
            current={clicks}
            onNewClickHandler={this.onNewClickHandler}
            data={data}
            currentItem={currentItem}
          />
        </div>
        
      </div>
    );
  }
}
