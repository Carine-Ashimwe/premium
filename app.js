const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const port = 3000;

// create a connection to the MySQL server
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'premiumpr'
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

// connect to the MySQL server
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('carImage'));

app.get("/Car_details",(req,res)=>{
  connection.query("SELECT * FROM Car_details INNER JOIN Cars_info ON Car_details.ID = Cars_info.ID",function(err,result,fields){
    if(err){
      console.log(err)
    }else{
      res.json(result)
    }
  })
})


app.post('/Car_details', (req, res) => {
  const { car, cartype, carbrand } = req.body;
  connection.query('INSERT INTO Car_details (car, cartype, carbrand) VALUES (?, ?, ?)', [car, cartype, carbrand], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send('Data inserted successfully');
    }
  });
});

app.post('/Cars_info', (req, res) => {
  const {cardisplacement, carpower, carprice } = req.body;
  const carImage = req.file ? req.file.originalname : null;

  connection.query(
    'INSERT INTO Cars_info (cardisplacement, carpower, carprice, carImages) VALUES (?, ?, ?, ?)',
    [cardisplacement, carpower, carprice, carImage],
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


app.put('/Car_details/:id', (req, res) => {
  const {car, cartype, carbrand } = req.body;
  const id = req.params.id;
  connection.query('UPDATE Car_details SET car = ?, cartype = ?, carbrand = ? WHERE Id = ?', [car, cartype, carbrand], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send(`Data with id ${id} updated successfully`);
    }
  });
});

app.put('/Cars_info/:id', (req, res) => {
  const {cardisplacement, carpower, carprice } = req.body;
  const id = req.params.id;
  connection.query('UPDATE Cars_info SET cardisplacement = ?, carpower = ?, carprice = ? WHERE Id = ?', [cardisplacement, carpower, carprice,Id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send(`Data with id ${id} updated successfully`);
    }
  });
});

app.delete('/Car_details/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM car_details WHERE id = ?', [id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send(`Data with id ${id} deleted successfully`);
    }
  });
});

app.delete('/Cars_info/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM cars_info WHERE id = ?', [id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send(`Data with id ${id} deleted successfully`);
    } 
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});





