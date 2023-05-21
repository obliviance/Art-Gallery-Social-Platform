//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const workshopSchema = Schema({
    title: {type: String, required: true},
    //creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    enrolled: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    info: {type: String, default: ""}
});

//Export the default so it can be imported
export default model("workshops", workshopSchema);