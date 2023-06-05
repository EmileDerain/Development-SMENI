const mongoose = require( 'mongoose')

const TodoModel = mongoose.model( 'Todos', {
    todo: {
        type: String,
    },
    time : {
        type : Date,
        default: Date.now,
    },
})

module.exports = { Todos: TodoModel }
