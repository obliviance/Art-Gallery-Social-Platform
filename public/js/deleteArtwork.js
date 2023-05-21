// Change the host to localhost if you are running the server on your
// own computer.
let host = ["localhost", "YOUR_OPENSTACK_IP"];

window.addEventListener('load', () => { 

    const delButtons = document.querySelectorAll('.deleteButton');

    delButtons.forEach(delButton => {
        delButton.addEventListener('click',  handleClick);
    })

});

function handleClick() {  

    fetch(`http://${host[0]}:3000/artwork/${this.id}`, {
        method: 'DELETE', 
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
    // the text, and we redirect to another URL..
    .then((responseText) => {
        location.href=`http://${host[0]}:3000/artworks`
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(error));

}
