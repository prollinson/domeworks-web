import React from "react"

function TrailTemplate(props) {
  return (
    <div>
      <h1>Trail: {props.name}</h1>
      <p>{props.description}</p>
    </div>
  )
}

export default TrailTemplate