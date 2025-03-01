const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { AssemblyAI } = require("assemblyai");
const {OpenAI} =require("openai");
const app = express();
const path = require("path");
// const mongoose = require("mongoose");

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



  




app.get("/",(req,res)=>{
    res.render("index.ejs")
});









//Messaege
let msg="hello"; //output of the the audio file text format

//Convert Audio To Text

const client = new AssemblyAI({
    apiKey: "1ef19d2ee9e147edbcfa425d69228b6d"
  })
  
  const audioUrl = "http://localhost:3000/public/audio.mp3"
  
  const config = {
    audio_url: audioUrl
  }
  
  const run = async () => {
    const transcript = await client.transcripts.transcribe(config)
    console.log( "hi",transcript.text)

    //store output to msg
    msg=transcript.text;
  }

  run();
  









//NOTE :: my sussetion is use open ai api becouse it is faste and accurate , gemini ai not propery detected.
  



//gemini ai ai
  async function geminiAI() {
    const genAI = new GoogleGenerativeAI("AIzaSyAyEmH1mZmanVJQNI8oes_Vj3DbxG9hDpE"); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the following text and determine whether it is suspicious. make sure basic details like name and otehr witch does not harm consider.Consider phishing, scams, misleading information, or malicious intent. Respond with only one word: 'Suspicious' or 'Safe'. Text: ${msg}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text.trim()); // Ensure single-word output
    } catch (error) {
        console.error("Error:", error);
    }
}




//openai api
const openai = new OpenAI({
    apiKey: "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",
  });
  
  
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


// note:: Name Use Just remove comment

//api key is working
geminiAI();

//Need To Add Anather Api key
// openAI();         


app.listen(port, () => {
    console.log(`listning on ${port}`)
});



