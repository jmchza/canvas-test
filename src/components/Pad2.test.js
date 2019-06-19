import React from 'react'
import { shallow, mount, render } from 'enzyme';
import Pad from './Pad'
import sinon from 'sinon';

/**
 * These are test to be run with jest and not mocha nor chai.
 * This is because they expect a different expect sintaxis
 */


describe('Pad Tests', () => {
  it('draw function', () => {
    const wrapper = shallow(<Pad
          width={1200}
          height={500}
          items={[]}
        />);
    const obj = wrapper.find('.canvas')
    expect(obj.length).toBe(1)
  })

        
  it('test Pad event::onClick with Jest + Sinon',  ()=>{
    let spyingTo = sinon.spy()
    const wrapper = mount(<Pad width={1200} height={500} items={[]} toggle={spyingTo} />);
    
    expect(wrapper).toMatchSnapshot()
    wrapper.find("canvas").simulate("click")
    expect(spyingTo.called).toBe(true)

  })

  it('test Pad event::mouseUp with Jest + sinon',  ()=>{
    let spyingTo = sinon.spy()
    const wrapper = mount(<Pad onNewClickHandler={spyingTo} items={[]} />);
    
    expect(wrapper).toMatchSnapshot()
    wrapper.find("canvas").simulate("mouseUp")
    expect(spyingTo.called).toBe(true)

  })

}); 