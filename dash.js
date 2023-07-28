// Import required modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "premiumpr",
  connectionLimit: 10,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({ storage: storage }).single('carImages'); // specify the field name for file uploads
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    res.status(500).json({ message: "Server error" });
    return;
  }
  console.log("Connected to the database");
});

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/car_details", (req, res) => {
  const query = "SELECT * FROM car_details";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching thedata: " + error.stack);
      res.status(500).json({ message: "Server error" });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/cars_info", (req, res) => {
  const query = "SELECT * FROM cars_info";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching thedata: " + error.stack);
      res.status(500).json({ message: "Server error" });
      return;
    }
    res.status(200).json(results);
  });
});

app.post("/car_details", (req, res) => {
  const { Id, carId, cartype, carbrand } = req.body;

  connection.query(
    "INSERT INTO car_details (Id, carId, cartype, carbrand) VALUES (?, ?, ?, ?)",
    [Id, carId, cartype, carbrand],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      } else {
        console.log(result);
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});

app.post('/Cars_info', function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      // handle the error
      console.error(err);
      return res.status(500).send(err.message);
    }
    // handle the file upload success
    console.log('File uploaded successfully');
    const { id, carpower, cardisplacement, carprice } = req.body;
    const carImage = req.file ? req.file.originalname : null;

    connection.query(
      'INSERT INTO Cars_info (id, carpower, cardisplacement, carprice, carImages) VALUES (?, ?, ?, ?, ?)',
      [id, carpower, cardisplacement, carprice, carImage],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        } else {
          console.log(result);
          res.status(200).send('Data inserted successfully');
        }
      }
    );
  });
});

app.put('/Car_details/:Id', (req, res) => {
  const {carId, cartype, carbrand } = req.body;
  const Id = req.params.Id;
  connection.query('UPDATE Car_details SET carId = ?, cartype = ?, carbrand = ? WHERE Id = ?', [carId, cartype, carbrand], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send(`Data with id ${Id} updated successfully`);  
    }
  });
});

app.put('/Cars_info/:Id', (req, res) => {
  const {cardisplacement, carpower, carprice } = req.body;
  const Id = req.params.Id;
  connection.query('UPDATE Cars_info SET cardisplacement = ?, carpower = ?, carprice = ? WHERE Id = ?', [cardisplacement, carpower, carprice,Id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result); 
      res.status(200).send(`Data with id ${Id} updated successfully`);
    }
  });
});

// Delete a car from cars_info table
app.delete("/cars_info/:id", (req, res) => {
  const Id = req.params.id;
  const query = "DELETE FROM cars_info WHERE Id = ?";
  connection.query(query, [Id], (error, result) => {
    if (error) {
      console.error("Error deleting car: " + error.stack);  
      res.status(500).json({ message: "Server error" });
      return;
    }
    res.status(200).send("Car deleted successfully");
  });
});

app.delete("/car_details/:id", (req, res) => {
  const Id = req.params.id;
  const query = "DELETE FROM car_details WHERE Id = ?";
  connection.query(query, [Id], (error, result) => {
    if (error) {
      console.error("Error deleting car: " + error.stack);
      res.status(500).json({ message: "Server error" });
      return;
    }
    res.status(200).send("Car deleted successfully");
  });
});

app.set("view engine", "ejs");

// Start the server
app.listen(3000, () => {
  console.log("Server running on 3000");
});
