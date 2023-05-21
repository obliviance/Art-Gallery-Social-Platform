// Change the host to localhost if you are running the server on your
// own computer.
let host = ["localhost", "YOUR_OPENSTACK_IP"];

window.addEventListener('load', () => {

    document.getElementById("addArtwork").addEventListener("click", addArtwork);

});

function addArtwork(){  

    console.log("Adding a new Artwork");
    let name = document.getElementById("name").value;
    let artist = document.getElementById("artist").value;
    let year = Number(document.getElementById("year").value);
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;
    let newArtwork = {'name': name, 'artist': artist, 'year': year, 'category': category, 'medium': medium, 'description': description, 'image': image}; 
    fetch(`http://${host[0]}:3000/addArtwork`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArtwork)
    })
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
            document.getElementById("name").value = '';
			document.getElementById("error").innerHTML = "That username is taken. Please use a different username.";
            throw new Error(`HTTP error: ${response.status}`);
        }
        // Otherwise (if the response succeeded), our handler fetches the response
        // as text by calling response.text(), and immediately returns the promise
        // returned by `response.text()`.
        return response.text();
    })
    // When response.text() has succeeded, the `then()` handler is called with
    // the text, and we parse the response to retrieve the id and redirect
    // to another URL.
    .then((responseArtwork) => {
        let anArtwork = JSON.parse(responseArtwork)
        location.href=`http://${host[0]}:3000/artwork/${anArtwork._id}`
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(error));
    
}