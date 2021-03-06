// Built-ins Modules
const path = require('path');

// Dependency Modules
const bodyParser = require('body-parser');
const express = require('express');

// Relative Modules
const productData = require('./product-data');
const aggregateMaterials = require('./lib/aggregate-materials.js');

// Declarations
const port = process.env.PORT || 5000;
const app = express();
const styles = aggregateMaterials(productData);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'From Andy' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.get('/api/styles', (req, res) => {
	res.send(styles);
});

app.get('/api/style/:id', (req, res) => {
  const style = styles.find(s => s.style === parseInt(req.params.id));
  if (!style) res.status(404).send(`A style with the given ID: ${req.params.id} was not found.`);
  res.send(style);
});

// Production Build
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Listen for incoming requests
app.listen(port, () => console.log(`Listening on port ${port}`));
