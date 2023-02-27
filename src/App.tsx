
import './App.css'

type Agent = {
  position: {x: number, y: number},
  angle: number,
}


function App() {

  var agents: Agent[] = [];

  // Agent Config
  const agentTotal = 20000;
  const agentSize = .5;
  const agentColour = 'rgba(255,255,255,1)';
  const moveSpeed = 1;
  const blurAmount = 0.05;

  // Sensor Config
  const sensorOffset = 7
  const sensorSize = 3
  const sensorOffsetAngle = Math.PI / 3
  const delayFactor = 0
  const turnSpeed = 0.5

  const turnDelay = 2000

  // Add Delay at start where agents do not sense each other
  var turn = false;
  setTimeout(() => {
    turn = true;
  }, turnDelay);

  // Screen Dimensions
  const screenDimensions = {x: window.innerWidth, y: window.innerHeight}

  // Initialise Agents With Random Angle
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

      /// Update Position Based on trails ///
      if(turn){
      
      // Get the midpoint for the 3 sensor circles
      let sensorCenter = {x:agent.position.x + Math.cos(agent.angle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle) * (sensorOffset + delayFactor)}
      let sensorRight = {x: agent.position.x + Math.cos(agent.angle + sensorOffsetAngle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle + sensorOffsetAngle) * (sensorOffset + delayFactor)}
      let sensorLeft = {x: agent.position.x + Math.cos(agent.angle - sensorOffsetAngle) * (sensorOffset + delayFactor), y: agent.position.y + Math.sin(agent.angle - sensorOffsetAngle) * (sensorOffset + delayFactor)}

      // Run helper function to score the sensor circles 
      let scoreCenter = scoreCircle(sensorCenter, ctx);
      let scoreRight = scoreCircle(sensorRight, ctx);
      let scoreLeft = scoreCircle(sensorLeft, ctx);

      let randomSteerStrength = Math.random() * (Math.PI / 3) * turnSpeed;

      // Function to turn the agent left or right randomly
      function turnRandomly(){
        if (Math.random() > 0.5){
          newAngle = agent.angle + randomSteerStrength;
        }
        else {
          newAngle = agent.angle - randomSteerStrength;
        }
      }

      // 
      if (scoreCenter < scoreRight && scoreCenter < scoreRight){

        if (Math.random() > 0.9){

          turnRandomly();

        }

      }

      // Random Direction
      else if ( scoreCenter > scoreRight && scoreCenter > scoreRight){
        turnRandomly();
      }

      // Turn Right
      else if (scoreRight < scoreRight){
        newAngle = agent.angle + randomSteerStrength;
      }

      // Turn Left
      else if (scoreLeft < scoreRight){
        newAngle = agent.angle - randomSteerStrength;
      }

      else {
        turnRandomly();
      }
    }

      // If the new Position is out of bounds give the agent a new random angle
      if (newPosX < 0|| newPosX >= screenDimensions.x  || newPosY < 0 || newPosY >= screenDimensions.y ){
       
        newPosX = Math.min(screenDimensions.x - 0.01, Math.max(0, newPosX))
        newPosY = Math.min(screenDimensions.y - 0.01, Math.max(0, newPosY))
        newAngle = Math.random() * 2 * Math.PI
       
      }

      return {position: {x: newPosX, y: newPosY}, angle: newAngle}

    })


  }

  // Helper Function for giving a sensor circle a score
  function scoreCircle(center: {x: number, y: number}, ctx: any){

    var imageData = ctx.getImageData(center.x - sensorSize, center.y - sensorSize, sensorSize * 2, sensorSize * 2, {});
    var score = 0;

    for (var i = 0; i < imageData.width; i++) {
      for (var j = 0; j < imageData.height; j++) {
        var distance = Math.sqrt((i - sensorSize) * (i - sensorSize) + (j - sensorSize) * (j - sensorSize));
        if (distance <= sensorSize) {

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

  // Main Animation Loop
  function animationLoop(){

    const canvasElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvasElm?.getContext("2d", {willReadFrequently: true});

    blurScreen(ctx)

    updateAgentPositions(ctx)

    // ctx?.clearRect(0,0,screenDimensions.x,screenDimensions.y)

    drawAgents(ctx)

    window.requestAnimationFrame(animationLoop)

  }

  // Helper Function to blur screen every frame
  function blurScreen(ctx: any) {

    ctx.fillStyle = 'rgba(0,0,0,' + blurAmount + ')';
    ctx.fillRect(0,0,screenDimensions.x,screenDimensions.y);

  }

  // Helper Function for drawing agents
  function drawAgents(ctx: any){

    agents.forEach((agent) => {

      ctx.fillStyle = agentColour
      ctx.fillRect(agent.position.x,agent.position.y,agentSize,agentSize);

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
