const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const { AssemblyAI } = require("assemblyai");
const {OpenAI} =require("openai");
const app = express();
const path = require("path");
// const mongoose = require("mongoose");

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



const assemblyAIKey = process.env.ASSEMBLYAI_API_KEY;
const openAIKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;




app.get("/",(req,res)=>{
    res.render("index.ejs")
});









//Messaege
let msg="Hello! There's an issue with your account, please verify your card details.What issue? Your access is restricted for security reasons, confirm details to restore it.Why do you need that? It's a standard verification, or you may lose access. I'll check directly first. Act fast, or the issue may escalate!"; //output of the the audio file text format

//Convert Audio To Text

const client = new AssemblyAI({
    apiKey: assemblyAIKey
  })
  
  const audioUrl = "https://boat-viii-floors-penalty.trycloudflare.com/test.mp3"         //public url
  
  const config = {
    audio_url: audioUrl
  }
  
  const run = async () => {
    const transcript = await client.transcripts.transcribe(config)
    console.log( "Call Content : ",transcript.text)
    
    //store output to msg
    msg=transcript.text;
  }

  
  



  app.get('/audio', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'audio.mp3');
    console.log("File path being served:", filePath);
    // Check if file exists
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('File not found or error sending file.');
            console.log("File path being served:", filePath);
        }
    });
});





//NOTE :: my sussetion is use open ai api becouse it is faste and accurate , gemini ai not propery detected.
  



//gemini ai ai
  async function geminiAI() {
    const genAI = new GoogleGenerativeAI(geminiKey); 
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
    apiKey: openAIKey,
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


run().then(()=>{
  openAI();
})


// note:: Name Use Just remove comment

//api key is working
// geminiAI();

//Need To Add Anather Api key
// openAI();         


app.listen(port, () => {
    console.log(`listning on ${port}`)
});



