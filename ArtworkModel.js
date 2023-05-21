//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const artworkSchema = Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    //creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    medium: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    reviews: [{type: Schema.Types.ObjectId, ref: 'User', default: []}]
});

//Export the default so it can be imported
export default model("artworks", artworkSchema);