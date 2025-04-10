const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/notes-db-app",{

       
UseNewUrlParser: true,

   })
.then(db=>console.log("db is connected"))
.catch(err=>console.error(err));
