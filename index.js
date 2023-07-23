import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var workTasks = [];
var personalTasks = [];

var today = new Date();
var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);


app.get("/", function(req, res)
{
  

    res.render("list", {listItems: workTasks, date: day, listOption: "Work List"});
});

app.get("/personal", function(req, res)
{
    res.render("list", {listItems: personalTasks, date: day, listOption: "Personal List"})
});

app.post("/", function (req, res){
    var item = req.body.task;

    console.log(req.body.button);
    if(req.body.button === "Personal List")
    {
        personalTasks.push(item);
        res.redirect("/personal");
    }
    else if(req.body.button === "Work List")
    {
        workTasks.push(item);
        res.redirect("/");
    }
        
});



app.listen(port, function(req, res)
{
    console.log("Server listening on port " + port);
});