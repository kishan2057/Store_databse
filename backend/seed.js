const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const FamilyMember = require('./models/FamilyMember');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await FamilyMember.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // --- Create Sample Users ---
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Ram Prasad Yadav',
        email: 'ram.yadav@example.com',
        password: hashedPassword,
        citizenshipNumber: 'NP-12345',
        phone: '9841000001',
        address: 'Janakpur, Madhesh Province',
        isVerified: true,
      },
      {
        name: 'Shyam Kumar Yadav',
        email: 'shyam.yadav@example.com',
        password: hashedPassword,
        citizenshipNumber: 'NP-12346',
        phone: '9841000002',
        address: 'Birgunj, Madhesh Province',
        isVerified: true,
      },
      {
        name: 'Sita Devi Yadav',
        email: 'sita.yadav@example.com',
        password: hashedPassword,
        citizenshipNumber: 'NP-12347',
        phone: '9841000003',
        address: 'Kathmandu, Bagmati Province',
        isVerified: true,
      },
    ]);

    console.log(`👥 Created ${users.length} users`);

    // --- Create Family Member Records ---
    const familyRecords = await FamilyMember.insertMany([
      {
        userId: users[0]._id,
        father: {
          name: 'Hari Prasad Yadav',
          citizenshipNumber: 'NP-00001',
          dob: '1955-03-10',
          occupation: 'Farmer',
          phone: '9841100001',
        },
        mother: {
          name: 'Kamala Devi Yadav',
          dob: '1958-06-15',
          occupation: 'Housewife',
          phone: '9841100002',
        },
        spouse: {
          name: 'Gita Devi Yadav',
          dob: '1982-09-20',
          citizenshipNumber: 'NP-22001',
          phone: '9841000010',
        },
        children: [
          { name: 'Arjun Yadav', dob: '2005-01-12', gender: 'Male' },
          { name: 'Priya Yadav', dob: '2008-05-23', gender: 'Female' },
        ],
        siblings: [
          { name: 'Laxman Yadav', dob: '1975-11-03', gender: 'Male', citizenshipNumber: 'NP-00002' },
          { name: 'Saraswati Yadav', dob: '1978-04-18', gender: 'Female', citizenshipNumber: 'NP-00003' },
        ],
        village: 'Raghopur',
        gotra: 'Kashyap',
      },
      {
        userId: users[1]._id,
        father: {
          name: 'Mohan Lal Yadav',
          citizenshipNumber: 'NP-00010',
          dob: '1950-07-22',
          occupation: 'Businessman',
          phone: '9841200001',
        },
        mother: {
          name: 'Radha Devi Yadav',
          dob: '1953-02-14',
          occupation: 'Housewife',
          phone: '9841200002',
        },
        spouse: {
          name: 'Sunita Yadav',
          dob: '1985-12-05',
          citizenshipNumber: 'NP-33001',
          phone: '9841000020',
        },
        children: [
          { name: 'Raju Yadav', dob: '2010-03-08', gender: 'Male' },
        ],
        siblings: [
          { name: 'Gopal Yadav', dob: '1980-08-27', gender: 'Male', citizenshipNumber: 'NP-00011' },
        ],
        village: 'Saptari',
        gotra: 'Bharadwaj',
      },
      {
        userId: users[2]._id,
        father: {
          name: 'Dinesh Kumar Yadav',
          citizenshipNumber: 'NP-00020',
          dob: '1960-01-30',
          occupation: 'Teacher',
          phone: '9841300001',
        },
        mother: {
          name: 'Anjali Devi Yadav',
          dob: '1963-09-12',
          occupation: 'Teacher',
          phone: '9841300002',
        },
        children: [
          { name: 'Rohan Yadav', dob: '2012-07-15', gender: 'Male' },
          { name: 'Pooja Yadav', dob: '2015-11-28', gender: 'Female' },
        ],
        siblings: [
          { name: 'Rahul Yadav', dob: '1988-04-05', gender: 'Male', citizenshipNumber: 'NP-00021' },
          { name: 'Rina Yadav', dob: '1990-06-19', gender: 'Female', citizenshipNumber: 'NP-00022' },
          { name: 'Suresh Yadav', dob: '1992-10-02', gender: 'Male', citizenshipNumber: 'NP-00023' },
        ],
        village: 'Mahottari',
        gotra: 'Vashishtha',
      },
    ]);

    console.log(`👨‍👩‍👧‍👦 Created ${familyRecords.length} family records`);

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Test Login Credentials (all verified):');
    users.forEach(u => {
      console.log(`   • ${u.email}  |  password123`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
