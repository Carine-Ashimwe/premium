app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // Check the credentials against a data store
  if (username === 'admin' && password === '') {
    // Create a session for the user
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    // Invalid credentials, redirect to login page
    res.redirect('/login');
  }
});
function requireAuthentication(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}
app.get('/dashboard', requireAuthentication, function(req, res) {
  // Render the dashboard page
  res.render('dashboard', {
    cars: getAllCars() // Function to retrieve all the car information
  });
});
$(document).ready(function() {
  $.get('/cars', function(cars) {
    $.each(cars, function(i, car) {
      var $row = $('<tr>').appendTo('#Car_details');
      $('<td>').text(car.make).appendTo($row);
      $('<td>').text(car.model).appendTo($row);
      $('<td>').text(car.year).appendTo($row);
    });
  });
});
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

