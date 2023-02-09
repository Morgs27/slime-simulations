
import './App.css'

type Agent = {
  position: {x: number, y: number},
  angle: number,
  trail: {x: number, y: number}[]
}


function App() {

  var agents: Agent[] = [];

  const agentTotal = 2000;
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

  let sensorOffset = 7
  let sensorSize = 3
  let sensorOffsetAngle = Math.PI / 3
  let delayFactor = 0
  let turnSpeed = 0.6

  function updateAgentPositions(ctx: any){

    agents = agents.map((agent:Agent, index: number) => {

      // Update Position Based on angle
      let newPosX = agent.position.x + Math.cos(agent.angle) * moveSpeed; 
      let newPosY = agent.position.y + Math.sin(agent.angle) * moveSpeed;
      let newAngle = agent.angle

      // Update Position Based on trails
      let sensorCenter = {x:agent.position.x + Math.cos(agent.angle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle) * (sensorOffset + delayFactor)}
      let sensorRight = {x: agent.position.x + Math.cos(agent.angle + sensorOffsetAngle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle + sensorOffsetAngle) * (sensorOffset + delayFactor)}
      let sensorLeft = {x: agent.position.x + Math.cos(agent.angle - sensorOffsetAngle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle - sensorOffsetAngle) * (sensorOffset + delayFactor)}

      let scoreCenter = scoreCircle(sensorCenter, ctx);
      let scoreRight = scoreCircle(sensorRight, ctx);
      let scoreLeft = scoreCircle(sensorLeft, ctx);

      let randomSteerStrength = Math.random() * (Math.PI / 3) * turnSpeed;

      // Stay Straight
      if (scoreCenter < scoreRight && scoreCenter < scoreRight){

      }
      // Random Direction
      else if (scoreCenter > scoreRight && scoreCenter > scoreRight){
        if (Math.random() > 0.5){
          newAngle = agent.angle + randomSteerStrength;
        }
        else {
          newAngle = agent.angle - randomSteerStrength;
        }
      }
      // Turn Right
      else if (scoreRight < scoreRight){
        newAngle = agent.angle - randomSteerStrength;
      }
      // Turn Left
      else if (scoreLeft < scoreRight){
        newAngle = agent.angle + randomSteerStrength;
      }
      else {

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

  function scoreCircle(center: {x: number, y: number}, ctx: any){

    var imageData = ctx.getImageData(center.x - sensorSize, center.y - sensorSize, sensorSize * 2, sensorSize * 2, {});
    var score = 0;
    // console.log(imageData)
    for (var i = 0; i < imageData.width; i++) {
      for (var j = 0; j < imageData.height; j++) {
        var distance = Math.sqrt((i - sensorSize) * (i - sensorSize) + (j - sensorSize) * (j - sensorSize));
        if (distance <= sensorSize) {

          // if (Math.random() < 0.0001){
          //   console.log(getPixelData(imageData, i, j))
          // }
          score += Math.sqrt(
            Math.pow( (imageData.data[(( i + j * imageData.width) * 4) + 0] ) - 255, 2) +
            Math.pow( (imageData.data[(( i + j * imageData.width) * 4) + 1] ) - 255, 2) +
            Math.pow( (imageData.data[(( i + j * imageData.width) * 4) + 2] ) - 255, 2)
          )
        }
      }
    }
    return score;
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


  function animationLoop(){

    const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d", {willReadFrequently: true});

    blurScreen(ctx)

    updateAgentPositions(ctx)

    // ctx?.clearRect(0,0,screenDimensions.x,screenDimensions.y)

    drawAgents(ctx)

    window.requestAnimationFrame(animationLoop)

  }


  function blurScreen(ctx: any) {

    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0,0,screenDimensions.x,screenDimensions.y);

  }


  function drawTriangle(x:number, y:number, size:number, angle:number, ctx:any) {


    let sensorCenter = {x: x + Math.cos(angle) * sensorOffset, y: y + Math.sin(angle) * sensorOffset}
    let sensorRight = {x: x + Math.cos(angle + sensorOffsetAngle) * sensorOffset, y: y + Math.sin(angle + sensorOffsetAngle) * sensorOffset}
    let sensorLeft = {x: x + Math.cos(angle - sensorOffsetAngle) * sensorOffset, y: y + Math.sin(angle - sensorOffsetAngle) * sensorOffset}

    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.beginPath();
    ctx.arc(sensorCenter.x , sensorCenter.y , sensorSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,255,0,1)';
    ctx.beginPath();
    ctx.arc(sensorLeft.x , sensorLeft.y , sensorSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,255,1)';
    ctx.beginPath();
    ctx.arc(sensorRight.x , sensorRight.y , sensorSize, 0, 2 * Math.PI);
    ctx.fill();
  }

  function drawAgents(ctx: any){

 
    agents.forEach((agent) => {

      let opacity = 0

      ctx.fillStyle = agentColour
      ctx.fillRect(agent.position.x,agent.position.y,agentSize,agentSize);

      // Draw Field of View
      // drawTriangle(agent.position.x, agent.position.y, 100, agent.angle, ctx)

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
