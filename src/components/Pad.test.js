import React from 'react'
import { shallow, mount, render } from 'enzyme';
import Pad from './Pad'
import sinon from 'sinon';
import chai from 'chai'
// import { expect } from 'chai';
import sinonChai from 'sinon-chai'

const expect = chai.expect;
chai.use(sinonChai);

/**
 * This test are to be run with cahi expect and not jest expect
 */

describe('Pad test with sinon + sinonChai + chai', ()=>{

  it('test Pad contains a unique child element, canvas ', () => {
    
    const wrapper = shallow(<Pad items={[]} />);
    expect(wrapper.find('canvas')).to.have.lengthOf(1)
    
  })

  it('test Pad contains canvas class with Chai', () => {
    
    const wrapper = shallow(<Pad items={[]} />);
    expect(wrapper.find('.canvas')).to.have.lengthOf(1)
    // expect(wrapper.props.items).to.equal('items')
  })

  function testMe(cb){
    cb()
  }

  it('callback called once with sinon + chai',  ()=>{
    let callbackSpy = sinon.spy()
    testMe(callbackSpy)
    expect(callbackSpy).to.have.been.calledOnce

  })

})