import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use('/public',express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://todolist:Abhijeet1305@cluster0.28awjee.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});

let newItems = [];

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Check the CheckBox to delete and Task."
});

const item2 = new Item({
    name: "Click on + to add an Task."
});

const item3 = new Item ({
    name: "Welcome to TODO List Application."
});

const defaultItems = [item1, item2, item3];

const listSchema= {
    name:String,
    items:[itemsSchema]
};

const List = mongoose.model("List", {listSchema});


app.get("/", async (req, res) => {
    try {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let today = new Date();
        let day = today.toLocaleDateString("en-us", options);
        const foundItem = await Item.find({});

        if (foundItem.length===0) {
        await Item.insertMany(defaultItems); 
            res.redirect('/');
        }
    else {
        res.render("index.ejs",{listTitle:day, newListItems:foundItem.reverse()});
    }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/", async (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item ({
        name: itemName
    });
    await item.save();
    console.log("Saved");
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    try {
        const checkedbox = req.body.checkbox;
        await Item.findByIdAndDelete(checkedbox);
        console.log("Deleted");
        res.redirect("/");
    }
    catch (error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});




app.listen(port, () => {
    console.log("Server is Live on port 3000...");
});