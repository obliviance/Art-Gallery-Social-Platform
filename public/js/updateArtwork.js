// Change the host to localhost if you are running the server on your
// own computer.
let host = ["localhost", "YOUR_OPENSTACK_IP"];

window.addEventListener('load', () => {

    document.getElementById("upgrade").addEventListener("click", changeProfile);

});

function changeProfile(){  
    fetch(`http://${host[0]}:3000/profile`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'text/plain'
        },
        body: "Execute"
    })
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
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
        location.href=`http://${host[0]}:3000/profile`
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(error));
    
}