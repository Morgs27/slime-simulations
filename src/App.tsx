
import './App.css'

type Agent = {
  position: {x: number, y: number},
  angle: number,
  trail: {x: number, y: number}[]
}


function App() {

  var agents: Agent[] = [];

  const agentTotal = 1;
  const agentSize = 2;
  const agentColour = 'rgba(255,255,255,1)';
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

  function updateAgentPositions(ctx: any){

    agents = agents.map((agent:Agent, index: number) => {

      // Update Position Based on angle
      let newPosX = agent.position.x + Math.cos(agent.angle) * moveSpeed; 
      let newPosY = agent.position.y + Math.sin(agent.angle) * moveSpeed;
      let newAngle = agent.angle

      // Update Position Based on trails
      function senseCone(x: number, y: number, angle: number){

        
        let senseAngle = Math.PI


      }

      function getPixelData(imageData: any, x: number, y:number) {
        var index = (x + y * imageData.width) * 4;
        return [
          imageData.data[index + 0],
          imageData.data[index + 1],
          imageData.data[index + 2],
          imageData.data[index + 3],
        ];
      }

      function getColorsInTriangle(x:number, y:number, size: number, angle:number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle - Math.PI / 2);
        var imageData = ctx.getImageData(-10, 0, 20, 10, {colourSpace: 'srbg'});
        ctx.restore();

        var colors = []
        for (var i = 0; i < imageData.width; i++) {
          for (var j = 0; j < imageData.height; j++) {
              colors.push(getPixelData(imageData, i, j));
          }
        }

        return colors;
      }

      // var colors = getColorsInTriangle(agent.position.x, agent.position.y, 10, agent.angle);
      // var colors = getColorsInTriangle(agent.position.x, agent.position.y, 100, agent.angle);
      // var colors = getColorsInTriangle(agent.position.x, agent.position.y, 100, agent.angle);


      if(index == 0){
        var colors = getColorsInTriangle(agent.position.x, agent.position.y, 10, agent.angle);
        console.log(colors)
      }

      // If the new Position is out of bounds give the agent a new random angle
      if (newPosX < 0|| newPosX >= screenDimensions.x  || newPosY < 0 || newPosY >= screenDimensions.y ){
       
        newPosX = Math.min(screenDimensions.x - 0.01, Math.max(0, newPosX))
        newPosY = Math.min(screenDimensions.y - 0.01, Math.max(0, newPosY))
        newAngle = Math.random() * 2 * Math.PI
       
      }

      return {position: {x: newPosX, y: newPosY}, angle: newAngle, trail: agent.trail}

    })


  }

  function animationLoop(){

    const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d");

    updateAgentPositions(ctx)

    // ctx?.clearRect(0,0,screenDimensions.x,screenDimensions.y)
    blurScreen(ctx)

    drawAgents(ctx)

    window.requestAnimationFrame(animationLoop)

  }


  function blurScreen(ctx: any) {

    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0,0,screenDimensions.x,screenDimensions.y);

  }


  function drawTriangle(x:number, y:number, size:number, angle:number, ctx:any) {

    ctx.fillStyle = 'rgba(255,255,0,0.1)'
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, size);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();


    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.fillStyle = 'rgba(255,0,0,0.1)'
    ctx.fillRect(-size, 0, size * 2, size);
    ctx.restore();
  }

  function drawAgents(ctx: any){

 
    agents.forEach((agent) => {

      let opacity = 0

      ctx.fillStyle = agentColour
      ctx.fillRect(agent.position.x,agent.position.y,agentSize,agentSize);

      // Draw Field of View
      drawTriangle(agent.position.x, agent.position.y, 100, agent.angle, ctx)

    })

  }

  function initAnimation(){

    initAgents()

    window.requestAnimationFrame(animationLoop)

  }

  initAnimation()

  return (
    <>
      <canvas id = 'canvas' width = {screenDimensions.x } height = {screenDimensions.y }></canvas>
    </>

  )
}

export default App
