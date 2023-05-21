import express from 'express';

const app = express();

import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';

const MongoDBStore = connectMongoDBSession(session);

//Defining the location of the sessions data in the database.
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/demo',
  collection: 'sessions'
});

//Setting up the express sessions to be stored in the database.
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      store: store 
    })
);

//Request logger.
import logger from 'morgan'; 

import pkg from 'mongoose';
const { connect, Types } = pkg;

app.use(express.urlencoded({extended: true}));

//Import Citzen and User models.
import Artwork from './ArtworkModel.js';
import User from './UserModel.js';

//process.env.PORT will see if there is a specific port set in the environment.
const PORT = process.env.PORT || 3000;

 //Root directory for javascript files.
const ROOT_DIR_JS = '/public/js';

// Change the host to localhost if you are running the server on your
// own computer.
let host = ["localhost", "YOUR_OPENSTACK_IP"];

//Logging our connections to the express servers.
app.use(logger('dev'));

//Static server will check the following directory.
//Needed for the addPerson, deletePerson and register javascript files.
app.use(express.static("." + ROOT_DIR_JS));

//Convert any JSON stringified strings in a POST request to JSON.
app.use(express.json());

//Setting pug as our template engine.
app.set('views', './views');
app.set('view engine', 'pug');

//This get method has two endpoints going to the same rendered pug file
app.get(['/', '/home'], (req, res) => {

	res.render('pages/home', { session: req.session });

});

// Rendering the registration page.
app.get("/register", (req, res) => {

	res.render("pages/register", { session: req.session });
     
});

// Saving the user registration to the database.
app.post("/register", async (req, res) => {

    let newUser = req.body;

    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  

});

// Search the database to match the username and password .
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await User.findOne({ username: username });
        if(searchResult != null) { 
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                res.render('pages/home', { session: req.session })
            } else {
                res.status(401).send("Not authorized. Invalid password.");
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});

app.get('/profile', async (req, res) => {
    const searchResult = await User.findOne({ username: req.session.username})
    res.render('pages/profile', { user: searchResult, session: req.session });
})

app.put('/profile', async (req, res) => {
    const searchResult = await User.updateOne({ username: req.session.username}, {$set: {upgrade: true}});
    res.status(201).send();
})

// Adding a person renders an HTML form with a submit button.
app.get('/addArtwork', async (req, res) => {
    const searchResult = await User.findOne({ username: req.session.username})
    if (searchResult.upgrade) {
        res.render('pages/addArtwork', { session: req.session });
    } else {
        res.status(401).send("Not authorized. Must be an artist.");
    }

});

// Log the user out of the application.
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;
	}
	res.redirect(`http://${host[0]}:3000/home`);

});

// Retreiving all the people in the the families collection of the demo database.
app.get('/artworks', async (req, res) => {

    // Notice that the find function has an empty object {}
    // this means find all the documents in the citizens collection.
    // The find function may have numerous documents returned.

    const searchResult = await Artwork.find({});
    res.render('pages/artworks', { artworks: searchResult, session: req.session });

});

// Delete the person associated with the personID (which is the 
// Object_id for the document).  Notice we use the deleteOne method.
app.delete('/artwork/:artworkID', async (req, res) => {

    console.log("Delete artwork.");
    console.log(req.params.artworkID);

    let obj_id = Types.ObjectId(req.params.artworkID);
    await Artwork.deleteOne({_id:obj_id, session: req.session});
    res.send();

});

// Find the person associated with the personID (which is the 
// Object_id for the document).
app.get('/artwork/:artworkID', async (req, res) => {

    let obj_id = Types.ObjectId(req.params.artworkID);
    const searchResult = await Artwork.findOne({ _id: obj_id });
    res.render('pages/artwork', { artwork: searchResult, session: req.session });

});

// Save the new citizen to the database. 
app.post("/addArtwork", async (req, res)=>{

    let artworkInfo = req.body;

    const searchResult = await Artwork.findOne({ name: artworkInfo.name});
    if(searchResult == null) {
        const searchResult2 = await Artwork.create(new Artwork(artworkInfo));
        res.status(200).json(searchResult2);
    } else {
        console.log("Send error.");
        res.status(404).json({'error': 'Exists'});
    }

});

// Create an async function to load the data.
// Other mongoose calls that return promise (connect) 
// inside the async function can use an await.
const loadData = async () => {
	
	//Connect to the mongo database
  	const result = await connect('mongodb://localhost:27017/demo');
    return result;

};

// Call to load the data.
// Once the loadData Promise returns the express server will listen.
// Any errors from connect, dropDatabase or create will be caught 
// in the catch statement.
loadData()
  .then(() => {

    app.listen(PORT);
    console.log("Server listening at localhost:" + PORT);

  })
  .catch(err => console.log(err));
