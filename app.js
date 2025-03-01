const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { AssemblyAI } = require("assemblyai");
const {OpenAI} =require("openai");
const app = express();
const path = require("path");
// const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const upload = multer({ dest: "uploads/" });

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"));  // ✅ Add this line
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


let text;

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
      return res.render("index", { transcription: null, error: "No file uploaded" });
  }

  try {
      // Step 1: Upload file to AssemblyAI
      const audioFile = fs.createReadStream(req.file.path);
      const uploadResponse = await axios.post("https://api.assemblyai.com/v2/upload", audioFile, {
          headers: { "Authorization": process.env.ASSEMBLYAI_API_KEY }
      });

      const audioUrl = uploadResponse.data.upload_url;

      // Step 2: Request transcription
      const transcriptResponse = await axios.post("https://api.assemblyai.com/v2/transcript", {
          audio_url: audioUrl
      }, {
          headers: { "Authorization": process.env.ASSEMBLYAI_API_KEY }
      });

      const transcriptId = transcriptResponse.data.id;

      // Step 3: Poll until transcription is complete
      let transcriptData;
      while (true) {
          await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
          transcriptData = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
              headers: { "Authorization": process.env.ASSEMBLYAI_API_KEY }
          });

          if (transcriptData.data.status === "completed") break;
          if (transcriptData.data.status === "failed") throw new Error("Transcription failed.");
      }

      fs.unlinkSync(req.file.path); // Delete file after processing
      console.log(transcriptData.data.text);
      text=transcriptData.data.text;
      res.render("index", { transcription: transcriptData.data.text, error: null });
  } catch (error) {
      console.log(error);
      console.error("Error:", error.response ? error.response.data : error.message);
      res.render("index", { transcription: null, error: "Error transcribing audio" });
  }
});
  




app.get("/",(req,res)=>{
  res.render("index", { transcription: null, error: null });
});










//NOTE :: my sussetion is use open ai api becouse it is faste and accurate , gemini ai not propery detected.
  



//gemini ai ai
  async function geminiAI() {
    const genAI = new GoogleGenerativeAI("AIzaSyAyEmH1mZmanVJQNI8oes_Vj3DbxG9hDpE"); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the following text and determine whether it is suspicious. make sure basic details like name and otehr witch does not harm consider.Consider phishing, scams, misleading information, or malicious intent. Respond with only one word: 'Suspicious' or 'Safe'. Text: ${text}`;

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
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  
   async function openAI(){
            
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
        { "role": "system", "content": "Classify the given text as either 'Suspicious' or 'Non-Suspicious'. Only return one of these two words." },
        { "role": "user", "content": text }
    ],
    
  
  });
   responce=completion.choices[0].message.content;

  
 console.log(responce);



}


// note:: Name Use Just remove comment

//api key is working
// geminiAI();

//Need To Add Anather Api key
// openAI();         


app.listen(port, () => {
    console.log(`listning on ${port}`)
});



