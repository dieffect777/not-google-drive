const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accessSchema = new Schema({
    userId:{
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    fileId:{
        ref: 'files',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('accesses', accessSchema)