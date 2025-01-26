const mongoose = require('mongoose');
const clickSchema = require('./click.schema');

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortenUrl: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    linkExpiryDate: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clicks: {
      type: [clickSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const LinkModel = mongoose.model('Link', linkSchema);

module.exports = LinkModel;
