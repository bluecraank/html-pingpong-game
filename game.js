const canvas = document.getElementById('game');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor(x = 0, y = 0, width = 0, height = 0, color = 'red') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const player = new Sprite(80 - 32, canvas.height / 2 - 100, 32, 200, 'blue');
const enemy = new Sprite(canvas.width - 80, canvas.height / 2 - 100, 32, 200, 'red');
const ball = new Sprite(canvas.width / 2, canvas.height / 2, 32, 32, 'white');

player.draw();
enemy.draw();
ball.draw();

const hitSound = new sound('hit.mp3')
const beamSound = new sound('beam.mp3')

let keysPressed = {};


let timer = 0;
let gameTimer = 30;
let speedX = 5;
let speedY = 5;


document.addEventListener('keydown', (event) => {
    keysPressed[event.keyCode] = true;
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.keyCode];
});

function incrementSeconds() {
    timer++;
    gameTimer++;
}
setInterval(incrementSeconds, 1000);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemy.draw();
    ball.draw();
    requestAnimationFrame(animate);

    if (keysPressed[87]) {
        if (player.y < 16 && player.y != 0)
            player.y -= 1;
        else if (player.y != 0)
            player.y -= 8;
    }

    if (keysPressed[83]) {
        if (player.y + player.height > canvas.height - 16 && player.y + player.height != canvas.height)
            player.y += 1;
        else if (player.y + player.height != canvas.height)
            player.y += 8;
    }

    if (keysPressed[38]) {
        if (enemy.y < 16 && enemy.y != 0)
            enemy.y -= 1;
        else if (enemy.y != 0)
            enemy.y -= 8;
    }

    if (keysPressed[40]) {
        if (enemy.y + enemy.height > canvas.height - 16 && enemy.y + enemy.height != canvas.height)
            enemy.y += 1;
        else if (enemy.y + enemy.height != canvas.height)
            enemy.y += 8;
    }


    moveBall();

    ctx.font = '30px Arial';
    let data = ctx.fillText(timer + ' | ' + player.points + ' : ' + enemy.points, canvas.width / 2, 30);
    ctx.textAlign = 'center';
}

function start(event) {
    animate();
    event.style.display = 'none';
    beamSound.play();
}

function moveBall() {

    console.log(speedX, speedY);

    // Erster Anstoß
    if (ball.x == canvas.width / 2 && ball.y == canvas.height / 2 && ball.lastDirection === undefined) {
        speedX = 5 + (Math.random() * 5);
        speedY = 5 + (Math.random() * 5);

        if (Math.random() > 0.5) {
            ball.x -= speedX;
            ball.y -= speedY;
            ball.lastDirection = 'left';
            ball.hoch = true;
        }
        else {
            ball.x += speedX;
            ball.y += speedY;
            ball.hoch = false;
            ball.lastDirection = 'right';
        }
    }

    let noInterrupt = checkCollisionWithWall();

    if (!noInterrupt) {
        if (ball.lastDirection == 'left') {
            ball.x -= speedX;
            if (ball.hoch) {
                ball.y -= speedY / 10;
            } else
                ball.y += speedY / 10;
        } else {
            ball.x += speedX;

            if (ball.hoch) {
                ball.y -= speedY / 10;
            } else
                ball.y += speedY / 10;
        }
    }

    checkCollision();

    checkWin();
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

let collided = false;
function checkCollision() {
        if (ball.x - (player.x + player.width) <= 1 && ball.y > (player.y - ball.height / 2) && ball.y < (player.y + player.height + ball.height / 2)) {
            ball.lastDirection = 'right';
            hitSound.play();
            
            if(!collided) speedY = 5 * (Math.random()*5);
            speedX += 0.5;
            collided = true;

        } else {
            collided = false;
        }

        if (enemy.x - (ball.x + ball.width) <= 1 && ball.y > (enemy.y - ball.height / 2) && ball.y < enemy.y + (enemy.height + ball.height / 2)) {
            ball.lastDirection = 'left';
            hitSound.play();
            if(!collided) speedY = 5 * (Math.random()*5);
            speedX += 0.5;
            collided = true;
            
        } else {
            collided = false;
        }
}

function checkWin() {
        if (ball.x < 0) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.lastDirection = undefined;
            enemy.points++;
            speedX = 5;
            speedY = 5;

            gameTimer = 0;
        }
        if (ball.x > canvas.width) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.lastDirection = undefined;
            player.points++;
            speedX = 5;
            speedY = 5;
            gameTimer = 0;
        }
}

function checkCollisionWithWall() {
        // top and bottom wall
        if (ball.y <= 3) {
            ball.y += 3 + (Math.random() * 3);
            ball.hoch = !ball.hoch;
            speedY += (Math.random() < 0.5 ? -3 : 3)

            return true;
        }
    
        if (ball.y + ball.height >= canvas.height) {
            ball.y -= 3 + (Math.random() * 3);
            speedY += (Math.random() < 0.5 ? -3 : 3)
            ball.hoch = !ball.hoch;
            return true;
        }
    
}