import * as React from 'react'
import PropTypes from 'prop-types'

export default function Button(props){
    Button.propTypes = {
              value: PropTypes.string,
              onClickHandlker: PropTypes.func,
              isEnable: PropTypes.bool,
              type: PropTypes.string
  }

  return (<button type="button" className={props.type} 
                  disabled={!props.isEnable}
                  onClick={() => props.onClickHandlker()}>{props.value}
                  </button>)
}