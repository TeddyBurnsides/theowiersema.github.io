var number=0;
var timer;
var currentMultiplier=1;
var newMultipler=1;
var currentAdder=1;
var newAdder;
var counterText=document.getElementById("counter");
var multiplierText=document.getElementById("multipler");

function start(newMultiplier) {
   if (currentMultiplier*newMultiplier<=500) {
      currentMultiplier=currentMultiplier*newMultiplier;
      currentAdder=1;
   } else if (currentMultiplier*newMultiplier>1000) {
      currentAdder=currentAdder*10;
   }
   clearInterval(timer);
   timer=setInterval(addValue,1000/currentMultiplier,currentAdder);
   multiplierText.innerHTML=currentMultiplier;

}
function pause() {
   clearInterval(timer);
}
function reset() {
   clearInterval(timer);
   number=0;
   currentMultiplier=1;
   counterText.innerHTML=number;
   multiplierText.innerHTML=currentMultiplier;
}
function addValue(currentAdder) {
   number=number+currentAdder;
   console.log(name);
   counterText.innerHTML=number;
   return number;
}
