//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const userSchema = Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    reviews: {type: [String], default: []},
    likedArtworks: [{type: Schema.Types.ObjectId, ref: 'Artwork', default: []}],
    following: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    joinedWorkshops: [{type: [Schema.Types.ObjectId], ref: 'Workshop', default: []}],
    notifications: {type: [String], default: []},
    upgrade: {type: Boolean, default: false},
    createdWorkshops: [{type: [Schema.Types.ObjectId], ref: 'Workshop', default: []}],
    artworks: [{type: Schema.Types.ObjectId, ref: 'Artwork', default: []}]
});

//Export the default so it can be imported
export default model("users", userSchema);