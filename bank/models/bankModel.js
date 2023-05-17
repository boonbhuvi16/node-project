// models/bankModel.js
const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ifsccode: {
    type: String,
    required: true
  },
  mobilno:{
    type: Number,
    required:true
  },
  accno: {
    type: Number,
    required: true
  },

// referenceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'OtherModel' // Replace 'OtherModel' with the actual name of the referenced model
//   },
},
{
    timestamps: true
});


const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
