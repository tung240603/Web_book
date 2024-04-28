const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DATABASE connection successfull..');
});

// Read json file
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf8');

// import data into database
const importData = async () => {
  try {
    // Parse the JSON string into an array of objects
    const tourData = JSON.parse(tours);
    const userData = JSON.parse(users);
    const reviewData = JSON.parse(reviews);

    // Check and add required fields
    // userData.forEach((user) => {
    //   if (
    //     !user.name ||
    //     !user.email ||
    //     !user.password ||
    //     !user.passwordConfirm
    //   ) {
    //     throw new Error('User data is incomplete');
    //   }
    // });

    // Create tours in the database
    await Tour.create(tourData);
    await User.create(userData, { validateBeforeSave: false });
    await Review.create(reviewData);

    console.log('Data successfully loaded into the database!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from Db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
