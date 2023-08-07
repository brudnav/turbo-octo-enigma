

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1")
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d")

ctx.lineWidth = 4
ctx.fillStyle = "white"
ctx.strokeStyle = "white"


class Particle {
    constructor(effect){
        this.effect = effect;
        this.x = 0;
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX = 2
        this.speedY = 2
        this.history = [{x: this.x, y: this.y}]
        this.hue = Math.floor(Math.random() * 360);
        this.maxLength = Math.floor(Math.random() * 100 + 10);
        this.angle = 0;
    }

    draw(context){
        context.fillRect(this.x,this.y,2,2)
        context.beginPath();
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`
        ctx.lineWidth = 1
        context.moveTo(this.history[0].x,this.history[0].y)
        for (let i = 0; i < this.history.length; i++) {
           context.lineTo(this.history[i].x,this.history[i].y)
        }
        context.stroke()
    }

    update(){
        this.angle += 0.1
        let x = Math.floor(this.x / this.effect.cellSize)
        let y = Math.floor(this.y / this.effect.cellSize)
        let index = y * this.effect.cols;
        let index2 = x * this.effect.rows;

        this.x += this.effect.flowField[index] 
        this.y += this.effect.flowField[index2]

        this.history.push({x: this.x, y: this.y})

        if(this.history.length > this.maxLength){
            this.history.shift()
        }
    }
}

class Effect {
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.cellSize = 20;
        this.rows;
        this.cols;
        this.flowField = [];
        this.init();
    }

    init(){

        // create flow field
        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)
        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = Math.cos(x) + Math.sin(y)
                this.flowField.push(angle);
                
            }

        }
       
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    render(context){
        this.particles.forEach(particle =>{
            particle.draw(context)
            particle.update()
        })
    }
}

const effect = new Effect(canvas.width,canvas.height)



function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    effect.render(ctx)

    requestAnimationFrame(anim)
}

anim()

