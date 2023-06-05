/* eslint-disable no-console */
var { Todos } = require('../models/todoModel');
var ObjectID = require( 'mongoose'). Types.ObjectId;

exports.index = (req, res ) => {
    Todos.find((err, docs) => {
        if (!err) {
            res.send(docs)
        } else {
            res.status(500).send(err)
        }
    })
};

exports.searchById = (req, res) => {
    const id = req.params.id;
    res.send(`Id found : ${id}`);
}

exports.insert = (req, res ) => {
    const todoItem = req.body.todo;
    const newTodos = new Todos({todo: todoItem});
    newTodos.save((err, docs) => {
        if (!err) {
            res.status(201).send(docs)
        } else {
            res.status(500).send(err)
        }
    });
}

exports.update = (req, res) => {
    const id = req.params.id;
    console.log(`update with given id: ${id}`);

    if(!ObjectID.isValid(id)){
        return res.send(400).send(`No record with given id: ${id}`)
    }

    const todoItem = req.body.todo;
    const newTodo = {
        todo: todoItem
    };

    Todos.findByIdAndUpdate(id, {$set: newTodo},{new: true},(err,docs )=>{
        if(!err){
            res.status(200).send(docs)
        } else {
            console.log('Error while updating the data' + JSON.stringify(err, undefined, 2))
        }
    })
}

exports.delete = (req, res ) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.send(400).send(`No record with given id: ${id}`)
    }

    Todos.findByIdAndRemove(id, (err, docs) => {
        const result = {
            data: docs,
            message: 'Todo has been removed successfully.',
            status: 200,
        }

        if (!err) {
            res.status(200).send(result)
        } else {
            res.status(500).send(err)
        }
    })
}
