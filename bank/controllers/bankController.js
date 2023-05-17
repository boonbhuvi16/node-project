// controllers/bankController.js
const Bank = require('../models/bankModel');
const OtherModel = require('../models/otherModel');


// Get all banks
const getUsers = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bank by ID
const getUserById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    res.json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new bank
const createUser = async (req, res) => {
  try {
    const bank = new Bank(req.body);
    await bank.save();
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a bank by name
const updateUserByName = async (req, res) => {
  try {
    const { name } = req.params;
    const updatedBank = await Bank.findOneAndUpdate(
      { name },
      req.body,
      { new: true }
    );
    res.json(updatedBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a bank by ID
const deleteUserById = async (req, res) => {
  try {
    const deletedBank = await Bank.findByIdAndDelete(req.params.id);
    res.json(deletedBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get by accno
const getUserByAccNo = async (req, res) => {
  try {
    const bank = await Bank.findOne({ accountnumber: req.params.accNo });
    if (bank) {
      res.json(bank);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// get by accno
const delUserByAccNo = async (req, res) => {
  try {
    const bank = await Bank.findOne({ accountnumber: req.params.accNo });
    if (bank) {
      res.json(bank);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const otherModel = async (req, res) => {
  
  const { name,ifsccode,mobilno,accno } = req.body;
  
  try {
    const bankUser = await Bank.findOne({ name });
    
    
    
    if (!bankUser) {
      return { error: 'User not found' };
    }else{
      const bankUserId = bankUser._id;
      const { ref } = bankUserId;
      
  
  
      const other = new OtherModel({ name,ifsccode,mobilno,accno, referenceId: bankUserId }
      );
  
      await other.save();
      res.json(other);
  
      return { success: true };
    }
    
  } catch (error) {
    console.log(error);
    return { error: 'Internal server error' };
  }
};
// Get a user by ID and populate the reference field
const getUserByrefId = async (req, res) => {
  try {
    const other = await other.findById(req.params.id).populate('referenceId');
    res.json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserByName,
  deleteUserById,
  getUserByAccNo,
  getUserByrefId,
  delUserByAccNo,
  otherModel

};
