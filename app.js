const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


main().then(() => {
    console.log("connection successfuly");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/scam-call")
};


// const stdSchema = mongoose.Schema({

//     email: {
//         type: String,

//         maxLength: 50,
//     },
//     name: {
//         type: String,

//     },
//     phone_no: {
//         type: Number,
//         required: true,
//         //min:[1,"prise is to low "],       -this is used to print custome errors usig aray
//     },
//     colledge_name: {

//         type: String,
//     },
//     address: {
//         type: String,
//         //emum is array wich allow accept value only if in this present.
//     },
//     trade: {
//         type: String,
//     }

// });


// const Std_Data = mongoose.model("Std_Data", stdSchema);



//let count = 0;




app.get("/",(req,res)=>{
    res.render("index.ejs")
});

app.listen(port, () => {
    console.log(`listning on ${port}`)
});



