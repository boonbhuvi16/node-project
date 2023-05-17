const mongoose = require('mongoose');

const otherSchema = new mongoose.Schema({
  // Define other fields for the 'OtherModel'
  name: {
    type: String,
    required: [true, "Please enter a user name"]
},
ifsccode: {
    type: String,
    required: true,
    default: 0
},
mobilno: {
    type: Number,
    required: true,
},

accno: {
    type: Number,
    required: true,
},

referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bankModel' // Replace 'OtherModel' with the actual name of the referenced model
  },
},

{
timestamps: true
});


const OtherModel = mongoose.model('OtherModel', otherSchema);

module.exports = OtherModel;
