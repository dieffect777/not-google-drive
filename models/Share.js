const mongoose = require('mongoose')
const ttl = require('mongoose-ttl')
const Schema = mongoose.Schema

const shareSchema = new Schema({
    shareHash: {
        type: String,
        default:''
    },
    accessLink:{
      ref:'accesses',
      type:Schema.Types.ObjectId
    }
})
shareSchema.plugin(ttl, { ttl: 3600000 });
module.exports = mongoose.model('shareds', shareSchema)