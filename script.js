const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let mood="calm";
let immersion=false;

const world={
calm:{c:"0,220,255",s:0.4},
anxiety:{c:"255,80,160",s:1.6},
tired:{c:"180,180,180",s:0.3},
chaos:{c:"255,0,200",s:2.2}
};

let mouse={x:0,y:0};

window.addEventListener("mousemove",e=>{
mouse.x=e.clientX;
mouse.y=e.clientY;
});

function setMood(m){mood=m;}

function toggleMusic(){
const m=document.getElementById("music");
m.paused?m.play():m.pause();
}

function toggleImmersion(){
immersion=!immersion;
document.querySelector(".panel").style.display=immersion?"none":"block";
document.querySelector(".title").style.display=immersion?"none":"block";
}

function generate(){
const e=document.getElementById("energy").value;
const w=world[mood];

typeWriter(
`宇宙状态生成完成

情绪：${mood}
能量：${e}

系统结论：
现实正在被观测者重构。`
);
}

function typeWriter(t){
let i=0;
const el=document.getElementById("output");
el.innerHTML="";
(function run(){
if(i<t.length){
el.innerHTML+=t[i++];
setTimeout(run,12);
}
})();
}

let p=[];
for(let i=0;i<350;i++){
p.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:(Math.random()-0.5),
vy:(Math.random()-0.5)
});
}

function animate(){

const w=world[mood];

ctx.fillStyle=immersion?"rgba(0,0,0,0.06)":"rgba(0,0,0,0.12)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.globalCompositeOperation="lighter";
ctx.fillStyle=`rgba(${w.c},0.75)`;

p.forEach(o=>{

let dx=mouse.x-o.x;
let dy=mouse.y-o.y;

o.vx+=dx*0.00002;
o.vy+=dy*0.00002;

o.vx*=0.96;
o.vy*=0.96;

o.x+=o.vx*w.s;
o.y+=o.vy*w.s;

if(o.x<0)o.x=canvas.width;
if(o.x>canvas.width)o.x=0;
if(o.y<0)o.y=canvas.height;
if(o.y>canvas.height)o.y=0;

ctx.beginPath();
ctx.arc(o.x,o.y,2.6,0,Math.PI*2);
ctx.fill();
});

requestAnimationFrame(animate);
}

animate();
