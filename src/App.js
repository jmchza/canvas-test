import React, { Component } from 'react';
import Pad from './components/Pad'
import {TOOL_PENCIL} from './components/Pencil'
import Button from './components/Button'

export default class App extends Component
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
      currentItem:{},
      enableUndo: false
    }

    this.saveHandler = this.saveHandler.bind(this);
    this.undoLastDrawing = this.undoLastDrawing.bind(this);
    this.onNewClickHandler= this.onNewClickHandler.bind(this)
  }

  componentDidMount() {
    const history = JSON.parse(localStorage.getItem('history'))
    const total = localStorage.getItem('total')

    if(history && history.length){
      this.setState({total: total ? total : 0, data: history})
    }
    this.setState({total: total ? total : 0})
  }

  onNewClickHandler = (current, data) => {
    let records = [...this.state.data]
    const val = current + 1;

    if(data) {
      records.push(data)
      
      this.setState({clicks: val, data: records, enableUndo: true})
    }else{
      this.setState({clicks: val})
    }

  }

  saveHandler (){
    
    localStorage.setItem('total', parseInt(this.state.clicks, 10))
    localStorage.setItem('history', JSON.stringify(this.state.data))

    this.setState({total: parseInt(this.state.clicks, 10)})
  }

  undoLastDrawing () {
    const currentItem = this.state.data[this.state.data.length -1]
    
    this.setState({currentItem})
  }

  resetCurrent = () =>{
    this.setState({currentItem: [], enableUndo: false})
  }

  render() {
    const { size, color, items, clicks, data, currentItem, enableUndo } = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch',}}>
          <div style={{  flexGrow: 1, }}>
            <label>Pencil color:</label>
            <Button isEnable={true} type="btn btn-success button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'green'})}/>
            <Button isEnable={true} type="btn btn-danger button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'red'})}/>
            <Button isEnable={true} type="btn btn-dark button" value="&nbsp;" onClickHandlker={(e) => this.setState({color: 'black'})}/>
            
            <Button type="btn btn-outline-success button" value="Undo last click" 
              onClickHandlker={this.undoLastDrawing} isEnable={enableUndo}/>
            <Button isEnable={true} type="btn btn-outline-success button" value="save" 
              onClickHandlker={this.saveHandler}/>
          </div>
          <div style={{flexGrow: 8}}>
            <div>
              <label>click total:</label>{parseInt(this.state.total, 10)}
            </div>
            <div>
              <label>clicks this session:</label>{this.state.clicks}
            </div>
          </div>
        </div>
        <div style={{marginRight:20, marginLeft: 20, border:'1px solid #d3d3d3'}}>
          <Pad
            width={1200}
            height={500}
            size={size}
            color={color}
            items={items}
            current={clicks}
            onNewClickHandler={this.onNewClickHandler}
            data={data}
            currentItem={currentItem}
            resetCurrent={this.resetCurrent}
          />
        </div>
        
      </div>
    );
  }
}
