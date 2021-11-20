import Mouse from "./mouse.mjs";

const random = max => Math.random()*max |0;
const randomArrayElem = arr => arr[ random(arr.length) ];

class Arkanoid
{
    constructor(canvasId)
    {
        const canvas = this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.mouse = new Mouse(this.canvas);

        const map = this.map = {
            bricks: [],
            brickWidth: 50,
            brickHeight: 25,
            mapX: 70,
            mapY: 150, 
        };

        this.platform = {
            x: canvas.width/2, 
            y: canvas.height - 100, 
            width: 100, 
            height: 25,
        }

        this.ball = {
            x: this.platform.x, 
            y: this.platform.y - 11, 
            width: 20, 
            height: 20,
            dx: 2,
            dy: -4,
        }

        this.state = 'pause';

        this.restart();
    }

    run()
    {
        this.mouse.on('mousedown', e => this.onMouseDown(e));
        this.mouse.on('mousemove',   e => this.onMouseMove(e));
        this.unpause();
    }

    pause()
    {
        this.state = 'pause';
    }

    unpause()
    {
        this.state = 'running';
        this.render();
    }

    onMouseDown(e)
    {
    }

    onMouseMove(e)
    {
    
    }

    restart()
    {
        this.generateNewMap();
    }

    generateNewMap()
    {
        const { map } = this;
        const bricks = map.bricks = [];
        const { brickWidth, brickHeight, mapX, mapY} = map;

        for(let row = 0; row < 10; ++row)
        {
            for(let col = 0; col < 10; ++col)
            {
                if(random(5) !== 0)
                {
                    bricks.push({
                        x: mapX + col*(brickWidth+1), 
                        y: mapY + row*(brickHeight+1), 
                        width: brickWidth, 
                        height: brickHeight,
                    });
                }
            }
    
        }
    }

    render()
    {
        if(this.state !== 'pause')
        {
            this.clearScreen();
            
            this.movePlatform();
            this.moveBall();

            this.checkCollisions();
            
            this.renderMap();
            this.renderPlatform();
            this.renderBall();

            window.requestAnimationFrame(() => this.render());
        }
    }
    
    clearScreen()
    {
        const { ctx, canvas } = this;
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
    }

    checkWalls()
    {
        const { ball, canvas } = this;
        const {x, y, width, height, dx, dy } = ball;
        
        // check walls
        if(ball.x <= width/2)
        {   
            ball.x = width/2;
            ball.dx = -ball.dx;
        }
        if(ball.y <= height/2)
        {   
            ball.y = height/2;
            ball.dy = -ball.dy;
        }
        if(ball.x >= canvas.width - width/2)
        {   
            ball.x = canvas.width - width/2;
            ball.dx = -ball.dx;
        }
        if(ball.y >= canvas.height - height/2)
        {   
            ball.y = canvas.height - height/2;
            ball.dy = -ball.dy;
        }
    }

    collideRect(rect1, rect2)
    {
        // Такой вариант возможен, но он менее эффективен
        //    x1 <= x2 + w2  && x2 <= x1 + w1  
        // && y1 <= y2 + h2  && y2 <= y1 + h1  

        const { x: x1, y: y1, width: w1, height: h1  } = rect1;
        const { x: x2, y: y2, width: w2, height: h2  } = rect2;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dw = (w1 + w2)/2 - Math.abs(dx);
        const dh = (h1 + h2)/2 - Math.abs(dy);

        return {collided: dw >= 0 && dh >= 0, intersection: {dx, dy, dw, dh} };
    }

    handleCollision(collisionInfo, obj)
    {
        const {dw, dh} = collisionInfo.intersection;

        if(dw > dh)
        {
            obj.dy = -obj.dy;
        }
        else
        {
            obj.dx = -obj.dx;
        }
    }

    checkPlatformCollision()
    {
        const { ball, platform } = this;
        const collision = this.collideRect(ball, platform);

        if(collision.collided)
        {
            console.log(collision);
            this.handleCollision(collision, ball);
        }    
    }

    checkBrickCollision()
    {
        const { map: { bricks }, ball } = this;

        const collided = false;
        for(let b = 0; b < bricks.length && !collided; ++b)
        {
            const collision = this.collideRect(ball, bricks[b]);
            if(collision.collided)
            {
                this.handleCollision(collision, ball);
                this.map.bricks.splice(b, 1);
            }    
        }
    }

    checkCollisions()
    {
        this.checkWalls();
        this.checkPlatformCollision();
        this.checkBrickCollision();
        
        // check platform
    }

    renderMap()
    {
        const {  map, ctx } = this;
        const {  bricks } = map;

        bricks.forEach(({x, y, width, height}) => {
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, width, height);
        })
    }
    
    movePlatform()
    {
        const { platform } = this;
        const diff = this.mouse.x - platform.x;
        const absDiff = Math.abs(diff);
        const speed = 20;
        const delta = diff === 0 
            ? 0 
            : (absDiff < speed ? diff : diff/absDiff * speed);
        platform.x += delta;
    }
    
    moveBall()
    {
        const { ball } = this;
        const { dx, dy } = ball;

        ball.x += dx;
        ball.y += dy;
    }

    renderPlatform()
    {
        const { platform: {x, y, width, height}, ctx } = this;

        ctx.fillStyle = "black";
        ctx.fillRect(x, y, width, height);

    }

    renderBall()
    {
        const { ball: {x, y, width, height}, ctx } = this;

        ctx.fillStyle = "red";
        ctx.fillRect(x, y, width, height);

    }
}

export default Arkanoid;