const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyPhoto: { type: String }, // Optional overall family photo

  // Grandfather details
  grandfather: {
    name: { type: String, required: true },
    citizenshipNumber: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    dob: { type: String },
    occupation: { type: String },
    image: { type: String }
  },

  // Father details
  father: {
    name: { type: String, required: true },
    citizenshipNumber: { type: String, required: true, unique: true },
    bloodGroup: { type: String, required: true },
    dob: { type: String },
    occupation: { type: String },
    phone: { type: String },
    image: { type: String }
  },

  // Mother details
  mother: {
    name: { type: String, required: true },
    citizenshipNumber: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    dob: { type: String },
    occupation: { type: String },
    phone: { type: String },
    image: { type: String }
  },

  // Spouse details
  spouse: {
    name: { type: String },
    dob: { type: String },
    citizenshipNumber: { type: String },
    phone: { type: String },
    image: { type: String }
  },

  // Children
  children: [
    {
      name: { type: String },
      dob: { type: String },
      gender: { type: String },
      image: { type: String }
    }
  ],

  // Siblings
  siblings: [
    {
      name: { type: String },
      dob: { type: String },
      gender: { type: String },
      citizenshipNumber: { type: String },
      image: { type: String }
    }
  ],

  village: { type: String },
  gotra: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
