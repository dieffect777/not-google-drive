const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    fileSrc:{
        type:String,
        required: true
    },
    ownerId: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('files', fileSchema)