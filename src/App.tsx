
import './App.css'

type Agent = {
  position: {x: number, y: number},
  angle: number,
  trail: {x: number, y: number}[]
}


function App() {

  var agents: Agent[] = [];

  const agentTotal = 30;
  const agentSize = 4;
  const agentColour = '#ffffff';
  const agentTrailLength = 500
  const opacityInterval = 99 / agentTrailLength
  const moveSpeed = 2;

  const screenDimensions = {x: window.innerWidth, y: window.innerHeight}

  function initAgents(){

    agents = Array(agentTotal).fill('').map(() => {
      return {
        position: {x: screenDimensions.x / 2, y: screenDimensions.y / 2},
        angle: Math.random() * Math.PI * 2,
        trail: []
      }
    })

  }

  function updateAgentPositions(){

    agents = agents.map((agent:Agent, index: number) => {

      // Add previous point to agents trail
      let newTrail = agent.trail;
      newTrail.push({x: agent.position.x, y: agent.position.y})
      if (newTrail.length > agentTrailLength){
        newTrail.shift()
      }

      // Update Position Based on angle
      let newPosX = agent.position.x + Math.cos(agent.angle) * moveSpeed; 
      let newPosY = agent.position.y + Math.sin(agent.angle) * moveSpeed;
      let newAngle = agent.angle

      // If the new Position is out of bounds give the agent a new random angle
      if (newPosX < 0|| newPosX >= screenDimensions.x  || newPosY < 0 || newPosY >= screenDimensions.y ){
       
        newPosX = Math.min(screenDimensions.x - 0.01, Math.max(0, newPosX))
        newPosY = Math.min(screenDimensions.y - 0.01, Math.max(0, newPosY))
        newAngle = Math.random() * 2 * Math.PI
       
      }

      return {position: {x: newPosX, y: newPosY}, angle: newAngle, trail: newTrail}

    })


  }

  function animationLoop(){

    const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d");

    updateAgentPositions()

    ctx?.clearRect(0,0,screenDimensions.x,screenDimensions.y)
    // blurScreen(ctx)

    drawAgents(ctx)

    window.requestAnimationFrame(animationLoop)

  }

  // function blurScreen(ctx: any) {

  //   ctx.filter = 'blur(8px)'

  // }

  function drawAgents(ctx: any){

 
    agents.forEach((agent) => {

      let opacity = 0

      ctx.fillStyle = agentColour
      ctx.fillRect(agent.position.x,agent.position.y,agentSize,agentSize);

      // ctx.lineWidth = agentSize;

      // // ctx.moveTo(agent.position.x,agent.position.y);
      
      agent.trail.forEach((point, index) => {

        opacity+= 0.005
        ctx.fillStyle = 'rgba(255,255,255,' + opacity + ')'
        ctx.fillRect(point.x,point.y,agentSize,agentSize);

      })


    })

  }

  function initAnimation(){

    initAgents()

    window.requestAnimationFrame(animationLoop)

  }

  initAnimation()


  return (
    <>
      <canvas id = 'canvas' width = {screenDimensions.x} height = {screenDimensions.y}></canvas>
    </>

  )
}

export default App
