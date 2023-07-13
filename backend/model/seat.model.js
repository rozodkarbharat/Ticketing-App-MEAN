const mongoose=require('mongoose');

const  schema=mongoose.Schema({
    id:{type:Number,require:true},
    isBooked:{type:Boolean,require:true}
})


const seatModel = mongoose.model('seat', schema)

module.exports ={seatModel}