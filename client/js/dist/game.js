!function(e){function t(i){if(n[i])return n[i].exports;var c=n[i]={i:i,l:!1,exports:{}};return e[i].call(c.exports,c,c.exports,t),c.l=!0,c.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";!function(io,$,Vue){function updateException(e,t,n){var i=entities[e][t];"Player"===e&&("x"===n?i.xCenter=i.x+i.width/2:"y"===n&&(i.yCenter=i.y+i.height/2))}function update(){ctx.clearRect(0,0,width,height),drawMap(),drawEntities()}function drawMap(){for(var e=getRelativeCoors([0,0]),t=e[0],n=e[1],i=0;i<width;i+=480)for(var c=0;c<height;c+=480)ctx.drawImage(background,t+i,n+c,480,480)}function drawEntities(){Object.keys(entities).reduce(function(e,t){return e.concat(Object.keys(entities[t]).map(function(e){return entities[t][e]}))},[]).sort(function(e,t){return e.y+e.height>t.y+t.height}).forEach(function(e){var t=getRelativeCoors([e.x,e.y]),n=t[0],i=t[1];switch(e.type){case"Player":updatePosition(e),ctx.fillStyle="black",ctx.fillText(e.name,n+8,i-12),ctx.strokeRect(n,i,16,16),ctx.fillStyle=e.color,ctx.fillRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n-4,i-8,24,4),ctx.fillStyle="red",ctx.fillRect(n-4,i-8,24*e.hp/e.maxHp,4);break;case"Bullet":updatePosition(e),ctx.strokeRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n,i,16,16);break;case"Enemy":updatePosition(e),ctx.strokeRect(n,i,16,16),ctx.fillStyle="#922",ctx.fillRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n-4,i-8,24,4),ctx.fillStyle="red",ctx.fillRect(n-4,i-8,24*e.hp/e.maxHp,4),ctx.fillStyle="black",ctx.fillText(e.name,n+8,i-12);break;case"ItemDrop":updatePosition(e),ctx.strokeRect(n,i,16,16),ctx.fillStyle="pink",ctx.fillRect(n,i,16,16);break;default:console.warn("unrecognized type "+e.type)}})}function getRelativeCoors(e){return[e[0]-entities.Player[clientId].x+width/2,e[1]-entities.Player[clientId].y+height/2]}function updatePosition(e){e.x+=e.hspeed/2,e.y+=e.vspeed/2}var width=800,height=600,rightKey=68,upKey=87,leftKey=65,downKey=83,app=new Vue({el:"#game",data:{messages:[{type:"info",msg:"Welcome to the game!"}],items:[]}}),canvas=document.getElementById("viewport"),ctx=canvas.getContext("2d");ctx.textAlign="center";var textboxFocused=!1,entities={},map=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],clientId="",tileSize=16,background=new Image;background.src="../img/grass.png";var spritesheet=new Image;spritesheet.src="../img/spritesheet.png";var commands={help:function(){app.messages.push({type:"info",msg:"Commands:\n/help - List all commands"})},debug:function debug(variable){socket.emit("clientDebug",variable+": "+eval(variable))}},socket=io();socket.on("init",function(e){console.log(e),entities=e.entities,Object.keys(entities).forEach(function(e){Object.keys(entities[e]).forEach(function(t){entities[e][t].type=e,entities[e][t].id=t})}),map=map,clientId=e.clientId,setInterval(update,20)}),socket.on("update",function(e){console.log(e);var t=!0,n=!1,i=void 0;try{for(var c,o=e.removed[Symbol.iterator]();!(t=(c=o.next()).done);t=!0){var a=c.value;delete entities[a.type][a.id]}}catch(e){n=!0,i=e}finally{try{!t&&o.return&&o.return()}finally{if(n)throw i}}for(var r=Object.keys(e.entities),l=0;l<r.length;l++){var s=r[l];console.log(s);for(var u=Object.keys(e.entities[s]),f=0;f<u.length;f++)for(var p=u[f],d=Object.keys(e.entities[s][p]),y=0;y<d.length;y++){var x=d[y],h=e.entities[s][p][x];entities[s][p]?(entities[s][p][x]=h,updateException(s,p,x)):(entities[s][p]=e.entities[s][p],entities[s][p].type=s,entities[s][p].id=p)}}}),socket.on("chatMsg",function(e){app.messages=app.messages.concat([e])}),$(document).ready(function(){$("#viewport").on("mousedown",function(e){var t=canvas.getBoundingClientRect();socket.emit("click",{x:e.clientX-t.left-width/2+entities.Player[clientId].x,y:e.clientY-t.top-height/2+entities.Player[clientId].y})}),$("#game-cont").on("contextmenu",function(e){e.preventDefault()}),$("#chat-input, .login-input").on("focus",function(){textboxFocused=!0}).on("blur",function(){textboxFocused=!1}),$("#chat-cont").on("click",function(e){$("#chat-input").focus()}),$("#chat-form").on("submit",function(e){e.preventDefault();var t=$("#chat-input").val();if("/"===t.charAt(0)){var n=t.substr(1).split(" ");commands[n[0]]?commands[n[0]].apply(null,n.slice(1)):socket.emit("chatMsg",t.substr(0,140))}else socket.emit("chatMsg",t.substr(0,140));$("#chat-input").blur(),$("#chat-input").val(""),textboxFocused=!1})}).on("keydown",function(e){textboxFocused||(socket.emit("keyDown",{key:e.keyCode}),-1!==[68,87,65,83].indexOf(e.keyCode)&&e.preventDefault(),84===e.keyCode&&($("#chat-input").focus(),e.preventDefault()),191===e.keyCode&&$("#chat-input").focus())}).on("keyup",function(e){socket.emit("keyUp",{key:e.keyCode})})}(io,jQuery,Vue)}]);
//# sourceMappingURL=game.js.map