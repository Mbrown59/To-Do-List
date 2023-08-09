import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var addedList = [];
//var personalTasks = [];

//create new database
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");

//schema
const itemsSchema = new mongoose.Schema({
  name: String,
});

//model
const Item = mongoose.model("item", itemsSchema);

//new document
const task1 = new Item({
  name: "Welcome to your todolist!",
});

const task2 = new Item({
  name: "Hit the + button to add a new task.",
});

const task3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [task1, task2, task3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

const work = new List({
  name: "Work",
  items: defaultItems,
});

const personal = new List({
  name: "Personal",
  items: defaultItems,
});

const defaultList = [work, personal];

var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
var day = today.toLocaleDateString("en-US", options);

app.get("/", function (req, res) {
  List.find()
    .then(function (lists) {
      if (lists.length === 0) {
        //insert default items into database
        List.insertMany(defaultList)
          .then(function (lists) {
            console.log("successfully inserted many"); //success
            
          })
          .catch(function (error) {
            console.log(error); //failure
          });
        res.redirect("/");
      }
    else{
        List.find({name: "Work"}).then(function(Wlists)
        {
            //console.log(Wlists[0].items);
        
            res.render("list", {
                listItems: Wlists[0].items,
                date: day,
                listOption: Wlists[0].name + " List",
                listButton: lists,
              });
        })
        
    }
    })
    .catch(function (err) {
      console.log(err);
    });
});

//If items collections is not empty, then do not add default items again
//find all items and print them out
// Item.find()
//   .then(function (items) {
//     //console.log(items);
//     if (items.length === 0) {
//       //insert default items into database
//       Item.insertMany(defaultItems)
//         .then(function (items) {
//           console.log("successfully inserted many"); //success
//         })
//         .catch(function (error) {
//           console.log(error); //failure
//         });
//       res.redirect("/");
//     } else {

//}

//close connection
//mongoose.connection.close();
// Success

//     }).catch(function (error) {
//     console.log(error); // Failure
//   });

// else
// {

//     res.render("list", {
//         listItems: lists.items,
//         date: day,
//         listOption: "Work List",
//         listButton: lists,
// });

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  //if there is not a list with this name, the create a button and a list
  List.findOne({ name: customListName })
    .then(function (list) {
      if (!list) {
        console.log("Doesn't exist");
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();

        addedList.push(customListName);
        res.redirect("/");
      } else {
        //show button
        console.log("Exist");

        if(list.name == "Work")
        {
            console.log("go to home page");
            List.find().then(function (lists) {
                console.log(work.items)
            res.render("list", {
                listItems: work.items,
                date: day,
                listOption: work.name + " List",
                listButton: lists,
              });
            });
        }
        else
        {
            List.find().then(function (lists) {
                res.render("list", {
                  listItems: list.items,
                  date: day,
                  listOption: list.name + " List",
                  listButton: lists,
                });
              });
            }
        }

        
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  var itemName = req.body.task;
  var l = req.body.list;
  var listName = "";

  if(l == "/")
  {
     listName = "Work";
  }
  else
  {
   listName = l.split(" ")[0]

  }

  console.log(itemName);
  console.log(listName + " DOEFi");

  console.log(req.body.list);
    //create new document
    const item = new Item({
      name: itemName,
    });

    
        List.findOne({name: listName}).then(function(list)
        {
            if(!list)
            {
                console.log("List Not found");
            }
            else
            {
                console.log("found ");
                list.items.push(item);
                list.save();
                if(listName == "Work")
                {
                    res.redirect("/");
                }
                else
                {
                    res.redirect("/" + listName);
                }
                
            }
            
        }
        ).catch(function(err)
        {
            console.log(err);
        });
    
    
  
});

app.post("/delete", function (req, res) {
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName.split(" ")[0];

  console.log(listName);
  console.log(checkItemId);
  //deleting task
  if(listName === "Work")
  {
    List.updateOne({name: listName}, {$pull: {items: {_id: checkItemId}}}).then(
        function()
        {
            console.log("updated list");
            res.redirect("/");
        }
    ).catch(function(err)
    {
        console.log(err);
    });
  }
  else
  {
    console.log(listName);
    List.updateOne({name: listName}, {$pull: {items: {_id: checkItemId}}}).then(
        function()
        {
            console.log("updated list");
            res.redirect("/" + listName);
        }
    ).catch(function(err)
    {
        console.log(err);
    });
  }
});

app.post("/newList", function (req, res) {
  console.log("/" + req.body.newListName);
  res.redirect("/" + req.body.newListName);
});

app.listen(port, function (req, res) {
  console.log("Server listening on port " + port);
});
