document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Insert data into the database here

    // Show alert box
    document.getElementById('alertBox').classList.remove('hide');

    // Hide alert box after 3 seconds
    setTimeout(function() {
        document.getElementById('alertBox').classList.add('hide');
    }, 3000);
});
