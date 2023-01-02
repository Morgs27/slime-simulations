import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'


function App() {

  const canvas = useRef(null)



  return (

   <canvas id="myCanvas" style = {{backgroundColor: 'rgba(50,50,50)'}} width = {700} height = {700} ref = {canvas}></canvas>

  )
}

export default App
