// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();
const parser = express.json();
const PORT = 4000;

server.use(parser);

//endpoints
server.get('/api/users', (req, res) =>{
    db.find()
        .then((users) => {
            res.json(users)
        })
        .catch(err => {
            res
                .status(500)
                .json({message:"failed to get users"})
        })
    })

server.get('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            console.log('user',user)
            if(user){
                res.json(user);
            } else{
                res.status(404)
                .json({message: "user does not exist"})
                console.log('not working')
            }
            res.json(user);
        })
        .catch(err => {
            res
                .status(500)
                .json({message:"failed to get user"})
        })
});


server.post('/api/users', (req, res) => {
    const user  = req.body;
    if(user.name && user.bio){
        console.log('user from body', user);
        db.insert(user).then(idInfo =>{
            db.findById(idInfo.id).then(user =>{
                console.log('user from findbyid method', user);
                res.status(201).json(user);
            })
            
        }).catch(err => {
            res
                .status(500)
                .json({message:"failed to insert user in db"})
        }); 
    } else {
        res.status(400).json({ message:"missing name or bio"})
    }
    
})

server.delete('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    db.remove(id).then(count =>{
        if(count){
            res.json({message: "successfully deleted"});
        } else{
            res.status(400)
            .json({ message: "failed to delete user"})
        }
    })
    .catch(err => {
        res.status(500)
            .json({message:"failed to delete user"})
    });
});


server.put('/api/users/:id', (req, res) =>{
    const user = req.body;
    const {id} = req.params;

    if (user.name && user.bio) {
        db.update(id, user).then(count =>{
            if(count){
                console.log('count', count)
                db.findById(id).then(user =>{
                    res.json(user);
                });
            } else{
                res.status(400)
                    .json({ message: 'invalid id'});
            }
        }).catch(err =>{
            res.status(500)
                .json({ message:"failed to delete user"});
        });
    } else {
        res.status(400)
            .json({ message:"missing name or bio"})
    }
})
//listening

server.listen(PORT, () =>{
    console.log(`server is up and runing on port ${PORT}`);
});