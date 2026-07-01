const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")


app.set("views", path.join(__dirname,"views")); //ejs
app.set("view engine","ejs"); //ejs

const sessionOption ={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};


app.use(session(sessionOption));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name ="anonymus"} = req.query;
    req.session.name = name
  
   if(name === "anonymus"){
      req.flash("error","user is not registered")
   }
 else{
 req.flash("success","user registered Successfully");
 }
    res.redirect("/hello")
})


app.get("/hello",(req,res)=>{
    res.locals.successMsg = req.flash("success");
     res.locals.errorMsg = req.flash("error")
    res.render("page.ejs",{ name:req.session.name})
})
 

app.listen(3000,()=>{
    console.log("Server is listing on port 3000")
});