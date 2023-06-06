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

const player = new Sprite(80-32, canvas.height/2-100, 32, 200, 'blue');
const enemy = new Sprite(canvas.width-80, canvas.height/2-100, 32, 200, 'red');
const ball = new Sprite(canvas.width/2, canvas.height/2, 32, 32, 'white');

player.draw();
enemy.draw();
ball.draw();


let keysPressed = {};


let timer = 0;


document.addEventListener('keydown', (event) => {
   keysPressed[event.keyCode] = true;
   console.log(keysPressed);
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.keyCode];
 });

    function incrementSeconds() {
        timer++;
    }
    setInterval(incrementSeconds, 1000);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemy.draw();
    ball.draw();
    requestAnimationFrame(animate);

    if(keysPressed[87]) {
        if(player.y < 16 && player.y != 0)
            player.y -= 1;
        else if(player.y != 0)
            player.y -= 8;
    }
 
     if(keysPressed[83]) {
        if(player.y + player.height > canvas.height - 16 && player.y + player.height != canvas.height)
            player.y += 1;
        else if(player.y + player.height != canvas.height)
            player.y += 8;
     }
 
     if(keysPressed[38]) {
        if(enemy.y < 16 && enemy.y != 0)
            enemy.y -= 1;
        else if(enemy.y != 0)
            enemy.y -= 8;
     }
 
     if(keysPressed[40]) {
        if(enemy.y + enemy.height > canvas.height - 16 && enemy.y + enemy.height != canvas.height)
            enemy.y += 1;
        else if(enemy.y + enemy.height != canvas.height)
            enemy.y += 8;
     }


     moveBall();

     ctx.font = '30px Arial';
     let data = ctx.fillText(timer + ' | ' + player.points + ' : ' + enemy.points, canvas.width/2, 30);
     ctx.textAlign = 'center';
}

function start(event) {
    animate();
    event.style.display = 'none';
}

function moveBall() {
    let speed = 5 * timer/20;

    if(ball.x == canvas.width/2 && ball.y == canvas.height/2 && ball.lastDirection === undefined) {
        if(Math.random() > 0.5) {
            ball.x -= speed;
            ball.y -= speed * 2 / Math.random();
            ball.lastDirection = 'left';
            ball.hoch = true;
        }
        else {
            ball.x += speed;
            ball.y += speed * 2 / Math.random();
            ball.hoch = false;
            ball.lastDirection = 'right';
        }
    }

    let noInterrupt = false;
    // top and bottom wall
    if(ball.y <= 3) {
        ball.y += 3 + (Math.random() * 3);
        ball.hoch = !ball.hoch;
        noInterrupt = true;
    }

    if(ball.y+ball.height >= canvas.height) {
        ball.y -= 3 + (Math.random() * 3);
        ball.hoch = !ball.hoch;
        noInterrupt = true;
    }

    if(!noInterrupt) {
        if(ball.lastDirection == 'left') {
            ball.x -= speed;
            if(ball.hoch) {
                ball.y -= timer / 10;
                // ball.hoch = true;
            } else
                ball.y += timer / 10;
                // ball.hoch = false
        } else {
            ball.x += speed;

            if(ball.hoch) {
                ball.y -= timer / 10;
                // ball.hoch = true;
            } else
                ball.y += timer / 10;
                // ball.hoch = false;
        }
    }

    if(ball.x - (player.x+player.width) <= 1 && ball.y > player.y && ball.y < player.y + player.height) {
        ball.lastDirection = 'right';
        if(ball.hoch) {
            ball.y -= Math.random() * 3;
        } else
            ball.y += Math.random() * 3;

    }

    if(enemy.x - (ball.x+ball.width) <= 1 && ball.y+16 > enemy.y && ball.y+16 < enemy.y + enemy.height) {
        ball.lastDirection = 'left';

        if(ball.hoch) {
            ball.y -= Math.random() * 3;
        }
        else
            ball.y += Math.random() * 3;
    }

    // stop animation
    if(ball.x < 0) {
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.lastDirection = undefined;
        enemy.points++;
        timer = 0;
    }

    if(ball.x > canvas.width) {
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.lastDirection = undefined;
        player.points++;
        timer = 0;
    }

    
    console.log(ball.lastDirection, ball.hoch)
}