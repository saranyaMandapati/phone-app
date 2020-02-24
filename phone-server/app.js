const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const updateJsonFile = require('update-json-file');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const loadData = () => {
  try {
    const dataBuffer = fs.readFileSync('phonenumber_collection.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

app.get('/', function(req, res) {
  const phoneNumbersData = loadData();
  res.send(phoneNumbersData);
});

const filePath = './phonenumber_collection.json';

app.post('/activate', function(req, res) {
  let phoneNumbersData;
  updateJsonFile(filePath, data => {
    phoneNumbersData = data.customers;
    const { id, mid } = req.body;
    const selectedCustomerIndex = phoneNumbersData.findIndex(
      customer => customer.id === id
    );
    const phoneIndex = phoneNumbersData[
      selectedCustomerIndex
    ].phoneNumbers.findIndex(phone => {
      return phone.mid === mid;
    });
    phoneNumbersData[selectedCustomerIndex].phoneNumbers[
      phoneIndex
    ].isActivated = 1;
    return { customers: phoneNumbersData };
  }).then(() => {
    res.send({ customers: phoneNumbersData });
  });
});

app.listen(8080, () => {
  console.log('Server started!');
});
