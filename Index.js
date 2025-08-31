const express = require("express");
const app = express();

const port = process.env.PORT || 8080;
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
const path = require("path");

// Demo seed data
const getDefaultPosts = () => ([
    {     
        id:uuidv4(),
        username:"livanshu kushwah",
        text:"Success is not final, failure is not fatal; it is the courage to continue that counts.",
        description: "This thought means that success and failure are temporary phases of life. Achieving success once does not mean the journey is over, and failing once does not mean everything is destroyed. What truly matters is the determination to keep moving forward despite ups and downs."
    },
    {        
        id:uuidv4(),
        username:"Nirvesh Singh",
        text:"Time and tide wait for none.",
        description: "This saying highlights the importance of time. Just like the tide of the ocean does not wait for anyone, time also keeps moving forward. Once it is gone, it can never return. Therefore, one must value time and use it wisely."
    },
    {       
        id:"2405",
        username:"Hitesh kumar",
        text:"A journey of a thousand miles begins with a single step.",
        description: "Big achievements always start with small actions. Even if a goal looks huge or impossible, the first small step is the beginning of progress. Consistency in these small steps eventually leads to success."
    }
]);

// Reset posts each time
let posts = getDefaultPosts();

// Middleware
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

// Reset on refresh (every GET request to "/")
app.get("/", (req,res) => {
    posts = getDefaultPosts();   // 🔄 reset state
    res.render("index.ejs", { posts });
});

// Routes
app.get("/new",(req,res)=> {
    let id=uuidv4();
    res.render("new.ejs",{id});
});

app.post("/new",(req,res)=>{
    let {username,text,id,description}=req.body;
    posts.push({username,text,id,description});
    res.redirect("/");
});

app.get("/:id", (req,res) => {
    let { id } = req.params;
    let post_id = posts.find((p) => id===p.id);
    if (!post_id) return res.send("Post not found");
    res.render("show.ejs", { post_id });
});

app.get("/edit/:id", (req,res) => {
    let { id } = req.params;
    let post_id = posts.find((p) => p.id === id);
    if (!post_id) return res.send("Post not found");
    res.render("update.ejs", { post_id });
});

app.patch("/:id", (req,res) => {
    let { id } = req.params;
    let { text } = req.body;
    let post = posts.find((p) => p.id === id);
    if (post) post.text = text;
    res.redirect("/");
});

app.delete("/:id", (req,res) => {
    let { id } = req.params;
    if (id==="2405"){ 
        return res.redirect("/");
    }
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
