const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    userDevice: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

module.exports = clickSchema;
