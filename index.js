const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// required fixings
// MINUS score fix
const GAME_WIDTH = 800
const GAME_HEIGTH = 400

canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGTH

const board = document.getElementById("board");

bWidth = board.offsetWidth;
bHeight  = board.offsetHeight;
bposX = board.offsetLeft;
bposY = board.offsetTop;

cposX = canvas.offsetLeft;
cposY = canvas.offsetTop;

colors  = ['blue','yellow','red']

let score = 0

let theta = 1.5*Math.PI

let isDragging  = false;
let lockOn = false
let strike = false
let mouseX,mouseY
let resistanceAngle
let accX,accY
let lastX ,lastY

let offsetX = 400
let offsetY = 250
let speed = 0

let maxScore = 0

class Ball
{
  constructor(position,radius,color)
  {
    this.position = position
    this.color = color
    this.radius = radius
    this.force = 0
    this.friction = 0.05
    this.velocity = {x:0,y:0}
    this.mass = 1
    //this.speed = Math.sqrt(this.velocity.x**2+this.velocity.y**2)
    //this.resAngle = 0
  }
  draw()
  {
    c.beginPath()
    c.fillStyle = this.color
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fill()
    c.closePath()
    c.beginPath();
  }
  update(array)
  {
    this.draw()
    //this.velocity.x=this.force
    if(this.position.x+this.radius +this.velocity.x>bposX-cposX+bWidth||this.position.x-this.radius+this.velocity.x<bposX-cposX)
    {
      this.velocity.x = -this.velocity.x

    }
    if(this.position.y+this.radius+this.velocity.y > bposY-cposY+bHeight||this.position.y-this.radius+this.velocity.y<bposY-cposY)
    {
      this.velocity.y = -this.velocity.y
    }
    this.position.x+=this.velocity.x
    this.position.y+=this.velocity.y

    if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;

    speed = Math.sqrt(this.velocity.x**2+this.velocity.y**2)
    if(speed>0)
    {
      const resAngle = Math.atan2(-this.velocity.y,-this.velocity.x)
      accX = this.friction*Math.cos(resAngle)
      accY = this.friction*Math.sin(resAngle)
      this.velocity.x+=accX
      this.velocity.y+=accY
    }
    for(let i=0;i<array.length;i++)
    {
      if(this == array[i])continue
      else if(getDistance({x:this.position.x,y:this.position.y},{x:array[i].position.x,y:array[i].position.y})<=2*this.radius)
      {

        handleCollisions(this,array[i])
        resolveOverlap(this,array[i])
      }
    }

  }
}

const resetBtn = document.getElementById("reset");


  let balls = [new Ball({x:200,y:190},10,'orange'),new Ball({x:215,y:203},10,'blue'),new Ball({x:215,y:177},10,'blue'),new Ball({x:230,y:216},10,'orange'),
  new Ball({x:230,y:164},10,'orange'),new Ball({x:245,y:229},10,'blue'),new Ball({x:245,y:151},10,'blue'),new Ball({x:260,y:241},10,'orange')]

  let striker = new Ball({x:400,y:190},10,'red')
  let pockets = [{x:bposX-cposX,y:bposY-cposY},{x:bposX-cposX,y:(bposY-cposY)+bHeight},{x:bposX-cposX+bWidth,y:(bposY-cposY)+bHeight},{x:bposX-cposX+bWidth,y:bposY-cposY}]


function animate()
{
  requestAnimationFrame(animate)
  c.clearRect(0,0,innerWidth,innerHeight)
// c.fillStyle = 'green'
  //c.fillRect(0,0,700,300)//-400,-250
//console.log(canvas.offsetLeft,bHeight)
//console.log(speed);
 updateScore()

drawQuaterCircle({x:bposX-cposX,y:bposY-cposY},4,40)
drawQuaterCircle({x:bposX-cposX,y:(bposY-cposY)+bHeight},1,40)
drawQuaterCircle({x:bposX-cposX+bWidth,y:(bposY-cposY)+bHeight},2,40)
drawQuaterCircle({x:bposX-cposX+bWidth,y:bposY-cposY},3,40)
balls.forEach((ball) => {
  ball.update(balls)
});

if(Math.pow((striker.velocity.x**2+striker.velocity.y**2),0.5)<0.05 && !isDragging)
{
  blinkAnimation(striker)
  //console.log('hello')
}

striker.update(balls)

const rect = canvas.getBoundingClientRect()
for(let i=0;i<balls.length;i++)
{
  if(getDistance(balls[i].position,{x:pockets[0].x,y:pockets[0].y})<=40||getDistance(balls[i].position,{x:pockets[1].x,y:pockets[1].y})<=40||getDistance(balls[i].position,{x:pockets[2].x,y:pockets[2].y})<=40||
  getDistance(balls[i].position,{x:pockets[3].x,y:pockets[3].y})<=40)
  {
  //  let index = balls.indexOf(balls[i])
  //
  balls[i].velocity.x = 0
  balls[i].velocity.y = 0
  balls[i].radius-=0.3
  if(balls[i].radius<1)
  {
    balls.splice(i,1)
    score+=10;
  }

  }

}
if(getDistance(striker.position,{x:pockets[0].x,y:pockets[0].y})<=40||getDistance(striker.position,{x:pockets[1].x,y:pockets[1].y})<=40||getDistance(striker.position,{x:pockets[2].x,y:pockets[2].y})<=40||
getDistance(striker.position,{x:pockets[3].x,y:pockets[3].y})<=40)
{
  striker.velocity.x = 0
  striker.velocity.y = 0
  striker.radius-=0.3
  if(striker.radius<1)
  {
    striker.radius = 10;
    striker.position = {x:400,y:150}
    score = Math.max(0,score-10)

  }
}

if(isDragging &&speed<0.05)
{
  drawLine({x:striker.position.x,y:striker.position.y},{x:mouseX,y:mouseY})
  //console.log('hello')
}


if(lockOn &&speed<0.05)
{
  let dx = mouseX - striker.position.x;
  let dy = mouseY - striker.position.y;
let r = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.5, 45);
let colorIndex = Math.floor(r/16) // in js simple division gives decimal and not integers so we use floor function
  c.beginPath()
  c.strokeStyle = colors[colorIndex]
  c.arc(striker.position.x,striker.position.y,r,0,Math.PI*2)
  c.stroke()

}



//  c.beginPath()
//  c.fillStyle = 'black'
//  c.strokeStyle = 'black'
//  c.arc(200,250,20,(Math.PI/2)*3,0)
//  c.stroke()
//drawQuaterCircle({x:200,y:200},4,40)
}

animate()



function drawQuaterCircle(centre,quadrant,radius)
{
  let x1,y1=centre.y,x2=centre.x,y2
  let startAngle = (4-quadrant)*(Math.PI/2)
  let endAngle = ((5-quadrant)%4)*(Math.PI/2)
  c.beginPath()
  c.fillStyle = '#5A3E36'
  c.strokeStyle = '#5A3E36'
  c.arc(centre.x,centre.y,radius,startAngle,endAngle)
  c.fill()
  c.closePath()
  if(quadrant==1||quadrant==4)
  {
    x1 = centre.x+radius
    y2= centre.y + Math.pow(-1,quadrant)*radius
  }
  else {
    x1 = centre.x-radius
    y2= centre.y - Math.pow(-1,quadrant)*radius
  }

  c.beginPath()
  c.moveTo(centre.x,centre.y)
  c.lineTo(x1,y1)
  c.lineTo(x2,y2)
  c.closePath()
  c.fillStyle = '#5A3E36'
  c.fill()

}

function updateScore()
{
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("best").innerText = "Personal Best: "+ maxScore;
}

function drawLine(coord1,coord2)
{
  angle = Math.atan2((coord1.y-coord2.y),(coord1.x-coord2.x))
//  resistanceAngle = Math.atan2((coord2.y-coord1.y),(coord2.x-coord1.x))
  c.beginPath()
  c.strokeStyle ='black'
   c.lineWidth = 2;
  c.moveTo(coord1.x,coord1.y)
  c.lineTo(coord1.x+Math.cos(angle)*35,coord1.y+Math.sin(angle)*35)
  c.stroke()
  //console.log('hello')
}

function getDistance(coordinate,otherCoordinate) // gives distance between two objects
{
  let diffX = otherCoordinate.x - coordinate.x
  let diffY = otherCoordinate.y - coordinate.y
  let dist = Math.sqrt(diffX**2+diffY**2)
  return dist
}

function handleCollisions(object,otherObject)
{
  // very good formulation for 2d collisions study it
    const m1 = object.mass
    const m2 = otherObject.mass

    const dx = object.position.x - otherObject.position.x
    const dy = object.position.y - otherObject.position.y
    const dist = getDistance({x:object.position.x,y:object.position.y},{x:otherObject.position.x,y:otherObject.position.y})

    const nx = dx/dist // normal unit vector derived from velocity in x direction
    const ny = dy/dist // normal unit vector derived from velocity in y direction

    const tx = ny // tangential unit vector derived from velocity in x direction
    const ty = -nx// tangential unit vector derived from velocity in y direction

// velocities in x and y direction before Collision
    const u1 = {x:object.velocity.x,y:object.velocity.y}
    const u2 = {x:otherObject.velocity.x,y:otherObject.velocity.y}

// velocity along the line of impact(normal)
    const u1n = u1.x*nx + u1.y*ny
    const u2n = u2.x*nx + u2.y*ny

//velocities perpendicular to the line of impact(tangential)
    const u1t = u1.x*tx+u1.y*ty
    const u2t = u2.x*tx+u2.y*ty



// velocities after Collision
    const v1 = (u1n*(m1-m2)+2*m2*u2n)/(m1+m2)
    const v2 = (u2n*(m2-m1)+2*m1*u1n)/(m1+m2)

    object.velocity.x = v1*nx + u1t*tx
    object.velocity.y = v1*ny + u1t*ty

    otherObject.velocity.x = v2*nx + u2t*tx
    otherObject.velocity.y = v2*ny + u2t*ty
    //}
}

function resolveOverlap(object,otherObject)
{
  const xDist = otherObject.position.x - object.position.x
  const yDist = otherObject.position.y- object.position.y

  const dist  = getDistance({x:object.position.x,y:object.position.y},{x:otherObject.position.x,y:otherObject.position.y})
  let overlap = (object.radius+otherObject.radius)-dist
  if(overlap>0)
  {
  correctionX = (xDist/dist)*(overlap/2)
  correctionY = (yDist/dist)*(overlap/2)

  object.position.x -=correctionX
  object.position.y -= correctionY

  otherObject.position.x+=correctionX
  otherObject.position.y+=correctionY
  }
}
function blinkAnimation(object)
{


    c.beginPath()
    c.fillStyle = 'rgba(150,150,150,0.5)'

    r = 12.5 + (2.5)*Math.sin(theta)
    let expand = false;
    c.arc(object.position.x,object.position.y,r,0,Math.PI*2)
    c.fill()
    c.closePath()
    theta+=0.10;


}
// Mouse Events for Desktop
resetBtn.addEventListener('click',(e)=>{
  maxScore = Math.max(score,maxScore)
    score = 0;
    balls = [new Ball({x:200,y:190},10,'orange'),new Ball({x:215,y:203},10,'blue'),new Ball({x:215,y:177},10,'blue'),new Ball({x:230,y:216},10,'orange'),
    new Ball({x:230,y:164},10,'orange'),new Ball({x:245,y:229},10,'blue'),new Ball({x:245,y:151},10,'blue'),new Ball({x:260,y:241},10,'orange')]

   striker = new Ball({x:400,y:190},10,'red')
})

canvas.addEventListener('mousedown',(e)=>{
  isDragging = true;
  //striker.velocity.x = 5;
  //console.log('Mouse is down')

})

canvas.addEventListener('mousemove',(e)=>{
  if(!isDragging) return;
  //console.log('mouse is moving')
  lockOn = true;
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  c.beginPath()
  c.strokeStyle = 'black'
  c.arc(striker.position.x,striker.position.y,Math.abs(mouseX-striker.position.x)*0.5,0,Math.PI*2)
  c.stroke()
  //console.log(e.clientX,e.clientY);

})

canvas.addEventListener('mouseup',(e)=>{
 isDragging = false
 lockOn = false
 const rect = canvas.getBoundingClientRect();

 let mouse1X = e.clientX - rect.left
 let mouse1Y = e.clientY - rect.top
 let dx = (striker.position.x - mouse1X)
 let dy = (striker.position.y - mouse1Y)
 let mag = Math.sqrt(dx**2+dy**2)
//console.log(e.clientX,e.clientY)

 let scale = 0.2
 if(mag>60)mag = 60

 //console.log(force*0.05)

if(speed<0.05)
{
  striker.velocity.x = (dx/(Math.sqrt(dx*dx+dy*dy)))*mag*scale
  striker.velocity.y = (dy/(Math.sqrt(dx*dx+dy*dy)))*mag*scale
}
})


// Touch Events for touchscreens

canvas.addEventListener('touchstart',(e)=>{
e.preventDefault();
isDragging = true;
})

canvas.addEventListener('touchmove',(e)=>{
  if(!isDragging) return;
  e.preventDefault()
  lockOn = true;
  const rect  = canvas.getBoundingClientRect()
  let touch = e.touches[0];
  mouseX = touch.clientX  - rect.left
  mouseY = touch.clientY - rect.top
  c.beginPath()
  c.strokeStyle = 'black'
  c.arc(striker.position.x,striker.position.y,Math.abs(mouseX-striker.position.x)*0.5,0,Math.PI*2)
  c.stroke()
})

canvas.addEventListener('touchend',(e)=>{
  isDragging = false;
  lockOn = false;

  const rect = canvas.getBoundingClientRect();
  let touch = e.changedTouches[0]; // last finger lifted
  let mouse1X = touch.clientX - rect.left;
  let mouse1Y = touch.clientY - rect.top;

  let dx = (striker.position.x - mouse1X);
  let dy = (striker.position.y - mouse1Y);
  let mag = Math.sqrt(dx**2 + dy**2);

  let scale = 0.2;
  if (mag > 60) mag = 60;

  if (speed < 0.05) {
    striker.velocity.x = (dx / mag) * mag * scale;
    striker.velocity.y = (dy / mag) * mag * scale;
  }
})
