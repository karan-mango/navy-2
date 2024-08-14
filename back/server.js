const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/navy1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schema = mongoose.Schema({
  name: String,
  age: String,
  email: String,
  phone:String,
  address:String
});

const Model = mongoose.model('details', schema);

// Bin schema and model
const binSchema = mongoose.Schema({
  name: String,
  age: String,
  email: String,
  phone:String,
  address:String
});

const BinModel = mongoose.model('bin', binSchema);

// Endpoint to create a new user
app.post('/save_user', async (req, res) => {
  try {
    const data = req.body;
    const newUser = new Model(data);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send('Error saving user');
  }
});

// Endpoint to get all complaints
app.get('/all_complaints', async (req, res) => {
  try {
    const data = await Model.find({});
    res.send(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Endpoint to get a single user by id
app.get('/complaint/:id', async (req, res) => {
  try {
    const user = await Model.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

// Endpoint to update a user by id
app.put('/update_complaint/:id', async (req, res) => {
  try {
    const updatedUser = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});

// Endpoint to delete a user by id (move to bin)
app.delete('/delete_complaint/:id', async (req, res) => {
  try {
    const user = await Model.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    const binItem = new BinModel(user.toObject());
    await binItem.save();

    await Model.findByIdAndDelete(req.params.id);

    res.send('User moved to bin successfully');
  } catch (error) {
    res.status(500).send('Error moving user to bin');
  }
}); 

// Endpoint to get all items in the bin
app.get('/bin_items', async (req, res) => {
    try {
      const data = await BinModel.find({});
      res.send(data);
    } catch (error) {
      res.status(500).send('Error fetching bin items');
    }
  });
  
  // Endpoint to restore an item from the bin
  app.post('/restore_item/:id', async (req, res) => {
    try {
      // Find the item in the bin
      const item = await BinModel.findById(req.params.id);
      
      if (!item) {
        return res.status(404).send('Item not found in bin');
      }
  
      // Remove the item from the bin
      await BinModel.findByIdAndDelete(req.params.id);
  
      // Add the item back to the main collection
      const restoredItem = new Model(item.toObject());
      await restoredItem.save();
  
      res.send('Item restored successfully');
    } catch (error) {
      res.status(500).send('Error restoring item');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



