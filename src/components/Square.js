import React from 'react'

export default function Square(props) {
  return (
    //When we click, we call props.onClick event
    <button className={props.value?'btn disabled': 'btn'} onClick={props.onClick}>
        {props.value}
    </button>
  )
}
