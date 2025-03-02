const socket = io();
let body= document.querySelector("body");
let flag= document.querySelector("#flag");

     // console.log(msg);

     document.addEventListener("DOMContentLoaded",()=>{

        let msg=flag.innerText;
   
     if(msg){

   
        console.log(msg);
      
   
     if(msg==="Non-Suspicious"){
         body.style.backgroundColor="green";
     }
     else if(msg==="Suspicious"){
         
         body.style.backgroundColor="red";
         

     }

     }
    })  ;

   