const Record = require('../models/Record');

// Create a new record (Admin only)
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    
    if (!amount || !type || !category) {
      return res.status(400).json({ message: 'Amount, type, and category are required' });
    }

    const record = new Record({
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
      createdBy: req.user._id
    });

    await record.save();
    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all records ( Viewer, Analyst, Admin )
// Includes filtering and pagination
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await Record.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    const total = await Record.countDocuments(query);

    res.json({
      records,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalRecords: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single record
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('createdBy', 'name email');
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a record (Admin only)
const updateRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    
    let record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Update fields
    if (amount) record.amount = amount;
    if (type) record.type = type;
    if (category) record.category = category;
    if (date) record.date = date;
    if (notes !== undefined) record.notes = notes;

    await record.save();
    res.json({ message: 'Record updated successfully', record });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a record (Admin only)
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
