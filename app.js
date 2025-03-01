const express = require("express");
const {OpenAI} =require("openai");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const openai = new OpenAI({
    apiKey: "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",
  });
  
  


// main().then(() => {
//     console.log("connection successfuly");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/scam-call")
// };



app.get("/",(req,res)=>{
    res.render("index.ejs")
});




let msg="hello send me your pssword";

  async function openAI(){
            
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
        { "role": "system", "content": "Classify the given text as either 'Suspicious' or 'Non-Suspicious'. Only return one of these two words." },
        { "role": "user", "content": msg }
    ],
    
  
  });
   responce=completion.choices[0].message.content;

  
 console.log(responce);



}

openAI()


app.listen(port, () => {
    console.log(`listning on ${port}`)
});



