const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.use(cors()); // Add this line to enable CORS for all routes

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/images', upload.single('image'), (req, res) => {
  const { originalname, mimetype, filename } = req.file;
  const sql = 'INSERT INTO images (name, type, filename) VALUES (?, ?, ?)';
  db.query(sql, [originalname, mimetype, filename], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Image uploaded');
  });
});

app.get('/images', (req, res) => {
  const sql = 'SELECT * FROM images';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.get('/images/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM images WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result[0]);
  });
});

app.put('/images/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { originalname, mimetype, filename } = req.file;
  const sql = 'UPDATE images SET name = ?, type = ?, filename = ? WHERE id = ?';
  db.query(sql, [originalname, mimetype, filename, id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Image updated');
  });
});

app.delete('/images/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM images WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Image deleted');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



// const express = require('express');
// const mysql = require('mysql');
// const app = express();
// var $ = require('jquery');
// const bodyParser = require('body-parser');
// const http = require('http');
// const port = 3000;
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const fs = require('fs');



// // create a connection to the MySQL server
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database:'premiumpr'
// });


// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

// // connect to the MySQL server
// connection.connect();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/upload', express.static('uploads')); 




// app.get('/Car_details/:Id', (req, res) => {
//   connection.query('SELECT Car_details.car, Car_details.cartype, Car_details.carbrand, Cars_info.cardisplacement, Cars_info.carprice, Cars_info.carpower FROM Car_details INNER JOIN Cars_info ON Car_details.Id = Cars_info.Id WHERE Car_details.Id = ?', [req.params.Id], (error, results) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.json(results);
//     }
//   });
// });


// app.post('/Car_details/:id', (req, res) => {
//   const {car, cartype, carbrand } = req.body;
//   connection.query('INSERT INTO car_details (car, cartype, carbrand) VALUES (?, ?, ?)', [car, cartype, carbrand], (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send(error);
//     } else {
//       console.log(result);
//       res.status(200).send('Data inserted successfully');
//     }
//   });
// });

// app.post('/cars_info', upload.single('carImage'), (req, res) => {
//   const { cardisplacement, carpower, carprice } = req.body;
//   const carImage = req.file.originalname;

//   connection.query(
//     'INSERT INTO cars_info (cardisplacement, carpower, carprice, carImages) VALUES (?, ?, ?, ?)',
//     [cardisplacement, carpower, carprice, carImage],
//     (error, result) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send(error);
