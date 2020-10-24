/*********DEPENDECIES***************/

let express = require('express');
let fs = require('fs');
let path = require('path');
let uniqid = require('uniqid');

/******************************************************
 * EXPRESS CONFIGURATION 
 * This sets up the basic properties for the express server 
 *******************************************************/
// Tell node that we are creating an 'express' server
var app = express();
// Sets an initial port
var PORT = process.env.PORT || 8080;

//Sets up the Express app to handle data parsing 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"))
/********************************************************
 * ROUTES
 ********************************************************/
// Basic route for ajax notes page

app.get('/notes', function(req, res){
    console.log("get notes!");
    res.sendFile(path.join(__dirname,"./public/notes.html"));
});

// Posting notes in JSON
app.post('/api/notes', function(req, res){
    var newNote ={
       id: uniqid(),
       newNote,
       title: req.body.title,
       text: req.body.text
    }

    fs.readFile('./db/db.json', function(err, data){
        var note = JSON.parse(data)
        console.log('data', JSON.parse(data))
        console.log('data raw'. data)
        note.push(newNote);
        fs.writeFile("db/db.json", JSON.stringify(note), function(err) {
            if (err){
                throw err
            }

            console.log('done!');
            res.json(note)
        })

    })
});

/*******************************
 * Displays the notes
 ******************************/
app.get('/api/notes', function(req, res){
    fs.readFile('db/db.json', function (err, data){
        if (err){
            return console.log(err);
        }
        console.log(JSON.parse(data));
        res.json(JSON.parse(data));
    })
});
/*******************************
 * Displays one note and delete it
 ******************************/

app.delete('/api/notes/:id', function(req, res){
    fs.readFile('./db/db.json', "utf8", function(err, data){
        if (err){
            throw err;
            res.json(err)
        }
        var savednote = JSON.parse(data);
        var noteId = req.params.id;
        var newId = 0;
        var saved = savednote.filter(currentNote => currentNote.id !== noteId);
    
        // for (currentNote in saved) {
        //     currentNote.id = newId.toString();
        //     newId++;
        // }
    
        fs.writeFile("./db/db.json", JSON.stringify(saved), function(err, data) {
            if (err){
                res.json(err)
            }
            res.json(saved);
        });

    })
})
app.get('*', function (req, res){
    res.sendFile(path.join(__dirname, './public/index.html'));
});

/************************************************
 * LISTENER
 * The below code efectively "starts" our server
 * *********************************************/

 app.listen(PORT, () => {
     console.log("App listen on  PORT: http://localhost:" + PORT);
 });

