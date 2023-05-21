
const fs = import('fs');
import gallery from "./gallery.json" assert {type: "json"};

//Array of registered users.
/*
import { faker } from '@faker-js/faker';
function createRandomUser(): User {
	return {
	  _id: faker.datatype.uuid(),
	  avatar: faker.image.avatar(),
	  birthday: faker.date.birthdate(),
	  email: faker.internet.email(),
	  firstName: faker.name.firstName(),
	  lastName: faker.name.lastName(),
	  sex: faker.name.sexType(),
	  subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
	};
  }
*/
const users = [
	{'username': 'wflintstone', 'password':'password', 'upgrade': true},
];

const workshopList = [
	{'title': "Intro to Art", }
]


//Import the mongoose module.
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
//Use ES module scope.
//package.json example:
// { 
// 	 "type": "module",
// 	 "dependencies": {
// 	   "mongoose": "^6.7.3"
// 	}
//}
const { connect, connection } = pkg;

//Import the Citzen and User models.
import User from './UserModel.js';
import Artwork from './ArtworkModel.js';
import Workshop from './WorkshopModel.js';

//Create an async function to load the data.
//Other mongoose calls that return promises(connect, dropdatabase, create) 
//inside the async function can use an await.
const loadData = async () => {
	
	//Connect to the mongo database.
  	await connect('mongodb://localhost:27017/demo');

	//Remove database and start anew.
	await connection.dropDatabase();

	//Map each BedRock citizen object into a new Citizen model.
	let art = gallery.map( artwork => new Artwork(artwork));
	
	//Map each registered user object into the a new User model.
	let access = users.map( aUser => new User(aUser));

	//Map each workshop object to a workshop according to the model
	let workshops = users.map( aUser => new User(aUser));

	//Creates a new documents of a citizen and user and saves
	//it into the citizens and users collections.
	await Artwork.create(art);
	await User.create(access);

}

//Call to load the data.
//Once the loadData Promise returns it will close the database
//connection.  Any errors from connect, dropDatabase or create
//will be caught in the catch statement.
loadData()
  .then((result) => {
	console.log("Closing database connection.");
 	connection.close();
  })
  .catch(err => console.log(err));