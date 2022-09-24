//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://amazingprincelee:prince1234@cluster0.uumprvv.mongodb.net/todolistDB");

const itemSchema = {
  name: String,
};



const Item = mongoose.model("item", itemSchema);


const item1 = new Item({
  name: "Morning prayer"
});

// item1.save();

const item2 = new Item({
  name: "break fast"
});

const item3 = new Item({
  name: "learn coding"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  item: [itemSchema]
};

const List = mongoose.model("list", listSchema);


app.get("/", function(req, res) {
 
Item.find({}, function(err, foundItems){
  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully saved default items");
      };
    });
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
    
  }
  
});
 
});

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;
  
  List.findOne({name: customListName}, function(err, foundlist){

    if(!err){
      if(!foundlist){
        const list = new List({
          name: customListName,
          item: defaultItems
        });
        
        list.save();
        res.redirect("/" + customListName);
      }else{
        res.render("list", {listTitle: foundlist.name, newListItems: foundlist.item});
      }
    }
  })


 
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const itemPost = new Item({
    name: itemName
  })

  if(listName === "Today"){
    itemPost.save();
    res.redirect("/");
  }

  
    
});


app.post("/delete", function(req, res){
  

  const removeItem = req.body.removeItem;
  Item.findOneAndRemove(removeItem, function(err){
    console.log("item deleted");
  })
  res.redirect("/");
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
