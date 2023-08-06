let board;
let boardwidth=640;
let boardheight=640;
let context;

//bird
let birdwidth=65; // width/height ratio = 13/5
let birdheight=25;
let birdy=boardheight/2;
let birdx=boardwidth/8;
let birdimg;

let bird = {
    y : birdy,
    x : birdx,
    width : birdwidth,
    height : birdheight
}

//background
let backgroungimg;
let backgroundarray=[];
let backgroundwidth = boardwidth;
let backgroundheight = boardheight;

// pipe
let topPipeImg;
let bottomPipeImg;
let pipearray = [];
let pipiewidth = 60;
let pipeheight = 350;
let pipex = boardwidth;
let pipey =0;

// physics
let velocityx = -2;
let velocityY=0;
let gravity = 0.2;

//gameover
let gameover = true;

// score
let score = 0;
let best_score = 0;

//increase speed
let addspeed_temp =0;
let addspeed = 0;

// sound tracks
let crashSound = new Audio('/Flappy_bird/sounds/crash.mp3');
let ingameSound = new Audio('/Flappy_bird/sounds/ingameSoundTrack.mp4');



window.onload = function(){
    board=document.getElementById("board");
    board.width=boardwidth;
    board.height=boardheight;
    context=board.getContext("2d");

    crashSound.onload = function(){
        crashSound.play();
    }

    // draw bird

    // context.fillStyle = "Green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    birdimg= new Image();
    birdimg.src = "/Flappy_bird/images/bird2.png";
    birdimg.onload = function(){
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height)

    }


    topPipeImg = new Image();
    topPipeImg.src = "/Flappy_bird/images/top_pipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "/Flappy_bird/images/bottom_pipe.png";

    requestAnimationFrame(update);
    setInterval(placepipes,2000);
    // setInterval(placeback, 2000);

    document.addEventListener('keydown', birdmove);

}

function update(){
    requestAnimationFrame(update);


    if(gameover || bird.y+bird.height/2>boardheight){
        ingameSound.pause();
        context.font="50px cursive";
        context.fillText("Start", boardwidth/4, boardheight/2);
        context.font = "25px cursive";
        context.fillStyle = "black";
        context.fillText("Press jump key to start", boardwidth/4, boardheight/2+(30) );
        gameover = true;
        document.addEventListener("keydown", restart);
        return; 
    }

    context.clearRect(0, 0, boardwidth, boardheight); 


    // bird
    velocityY+=gravity;   
    // bird.y+=velocityY;


    bird.y = Math.max(bird.y+velocityY, 0);  //limiting bird.y to the canvas top
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    //pipes
    for(let i=0;i<pipearray.length;i++){
        let pipe=pipearray[i];
        pipe.x+=velocityx; //+addspeed;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5; // 0.5 becuz it updates for 2 pipes
            addspeed_temp+=0.5;
            // if(addspeed_temp==3){
            //     addspeed-=0.5;
            //     addspeed_temp=0;
            // }

            pipe.passed = true;
            best_score = Math.max(score, best_score);
            
        }
        //detecting collision
        if(detectCollision(bird, pipe)){
            gameover = true;
        }    

    }

    //remove the pipes from the array that has gone out of the canvas
    while(pipearray.length>0 && pipearray[0].x+pipearray[0].width<0){
        pipearray.shift();
        // console.log(pipearray.length);
    }

    //score
    context.fillStyle = "White";
    context.font="45px Cursive";
    context.fillText(score, 10 , 45);
    context.fillStyle = "white";
    context.font = "40px cursive";
    context.fillText(best_score, boardwidth/2, 45 );
    context.fillText("Best:", boardwidth/3, 45);

    if(!gameover){
        ingameSound.autoBuffer = "true";
        ingameSound.play();
    }

    
}

//restart
function restart(e){
    if(gameover && (e.code=="Space" || e.code=="ArrowUp" || e.key== "x" || e.key =="X")){
        bird.y = birdy;
        pipearray = [];
        gameover = false;
        addspeed = 0;
        addspeed_temp = 0;
        score = 0;
    }
}

function placepipes(){
    if(gameover){
        return;
    }

    let randomHeight = pipeheight - Math.random()*(pipeheight/2);
    let opening = pipeheight/3;
    let toppipe = {
        img : topPipeImg,
        x : pipex,
        y : 0,
        width : pipiewidth,
        height : randomHeight,
        passed : false
    }

    pipearray.push(toppipe);
    let bottompipe = {
        img : bottomPipeImg,
        x : pipex,
        y : randomHeight+opening,
        width : pipiewidth,
        height: pipeheight,
        passed : false

    }

    pipearray.push(bottompipe);
    // console.log(pipearray.length);

}

function birdmove(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.key== "x" || e.key =="X"){
        velocityY = -3;
    }

}
                                       
// function detectcollision (a,b){
//     if(a.x+a.width>b.x && a.x<b.x+b.width && a.y+a.height<b.height+b.y && a.y<b.y+b.height){
//         return true;
//     }
// }

function detectCollision(a,b){
    if(a.x+a.width>b.x &&
        a.x<b.x+b.width &&
        a.y+a.height>b.y &&
        a.y<b.y+b.height){
            crashSound.play();          
        return true;
    }
}
