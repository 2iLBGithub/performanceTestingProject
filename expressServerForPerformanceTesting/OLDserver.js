const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs").promises;

app.use(express.json());

async function readData() {
  const data = await fs.readFile("data.json", "utf8");
  return JSON.parse(data);
}

async function writeData(data) {
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile("data.json", jsonData, "utf8");
}

function createBeverageModel(input) {
    return {
      id: input.id || null,
      name: input.name, 
      rating: input.rating !== undefined ? input.rating : null
    };
  }

app.get("/beverages", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error reading data: " + error.message);
  }
});

app.get("/beverages/:id", async (req, res) => {
  try {
    const data = await readData();
    const itemId = req.params.id;
    const item = data.beverages.find((b) => b.id === itemId);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    res.json(item);
  } catch (error) {
    res.status(500).send("Error reading data: " + error.message);
  }
});


app.post("/beverages", async (req, res) => {
    try {
      const inputBeverage = req.body;
  
      if (!inputBeverage || !inputBeverage.name) {
        return res.status(400).send("Beverage name is required");
      }
  
      const data = await readData();
      const newId = data.beverages.length > 0
          ? (Math.max(...data.beverages.map((b) => parseInt(b.id))) + 1).toString()
          : "1";
  
      const newBeverage = createBeverageModel({
        ...inputBeverage,
        id: newId
      });
  
      data.beverages.push(newBeverage);
      await writeData(data);
      res.status(201).json(newBeverage);
    } catch (error) {
      res.status(500).send("Error writing data: " + error.message);
    }
  });

  app.put("/beverages/:id", async (req, res) => {
    try {
      const beverageId = req.params.id;
      const inputBeverage = req.body;
  
      if (!inputBeverage || !inputBeverage.name) {
        return res.status(400).send("Beverage name is required");
      }
  
      const data = await readData();
      
      const beverageIndex = data.beverages.findIndex(b => b.id === beverageId);
  
      if (beverageIndex === -1) {
        return res.status(404).send("Beverage not found");
      }

      const updatedBeverage = createBeverageModel({
        ...inputBeverage,
        id: beverageId
      });
  
      data.beverages[beverageIndex] = updatedBeverage;
  
      await writeData(data);
      res.status(200).json(updatedBeverage);
    } catch (error) {
      res.status(500).send("Error updating data: " + error.message);
    }
  });

  app.patch("/beverages/:id", async (req, res) => {
    try {
      const beverageId = req.params.id;
      const inputBeverage = req.body;
  
      const data = await readData();
      
      const beverageIndex = data.beverages.findIndex(b => b.id === beverageId);
  
      if (beverageIndex === -1) {
        return res.status(404).send("Beverage not found");
      }
  
      const currentBeverage = data.beverages[beverageIndex];
  
      const updatedBeverage = createBeverageModel({
        ...currentBeverage,
        ...inputBeverage
      });
  
      data.beverages[beverageIndex] = updatedBeverage;
  
      await writeData(data);
      res.status(200).json(updatedBeverage);
    } catch (error) {
      res.status(500).send("Error updating data: " + error.message);
    }
  });
  
  app.delete("/beverages/:id", async (req, res) => {
    try {
      const data = await readData();
      const deletedItemId = req.params.id;
      const itemIndex = data.beverages.findIndex(b => b.id === deletedItemId);
  
      if (itemIndex === -1) {
        return res.status(404).send("Item not found");
      }
  
      const deletedItem = data.beverages.splice(itemIndex, 1)[0]; 
  
      await writeData(data); 
  
      res.status(204).json(deletedItem);
    } catch (error) {
      res.status(500).send("Error deleting item: " + error.message);
    }
  });
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
