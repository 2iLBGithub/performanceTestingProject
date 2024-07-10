const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');
const db = require('./database'); 

app.use(express.json());

app.get("/beverages", (req, res) => {
  db.all("SELECT * FROM beverages", (err, rows) => {
    if (err) {
      res.status(500).send("Error reading data: " + err.message);
    } else {
      res.json(rows);
    }
  });
});

app.get("/beverages/:id", (req, res) => {
  const itemId = req.params.id;
  db.get("SELECT * FROM beverages WHERE id = ?", [itemId], (err, row) => {
    if (err) {
      res.status(500).send("Error reading data: " + err.message);
    } else if (!row) {
      res.status(404).send("Item not found");
    } else {
      res.json(row);
    }
  });
});

app.post("/beverages", (req, res) => {
  const inputBeverage = req.body;

  if (!inputBeverage || !inputBeverage.name) {
    return res.status(400).send("Beverage name is required");
  }

  const newId = uuidv4();

  db.run(
    "INSERT INTO beverages (id, name, rating) VALUES (?, ?, ?)",
    [newId, inputBeverage.name, inputBeverage.rating],
    function (err) {
      if (err) {
        res.status(500).send("Error writing data: " + err.message);
      } else {
        res.status(201).json({ id: newId, name: inputBeverage.name, rating: inputBeverage.rating });
      }
    }
  );
});

app.put("/beverages/:id", (req, res) => {
  const beverageId = req.params.id;
  const inputBeverage = req.body;

  if (!inputBeverage || !inputBeverage.name) {
    return res.status(400).send("Beverage name is required");
  }

  db.run(
    "UPDATE beverages SET name = ?, rating = ? WHERE id = ?",
    [inputBeverage.name, inputBeverage.rating, beverageId],
    function (err) {
      if (err) {
        res.status(500).send("Error updating data: " + err.message);
      } else if (this.changes === 0) {
        res.status(404).send("Beverage not found");
      } else {
        res.status(200).json({ id: beverageId, name: inputBeverage.name, rating: inputBeverage.rating });
      }
    }
  );
});

app.patch("/beverages/:id", (req, res) => {
  const beverageId = req.params.id;
  const inputBeverage = req.body;

  db.get("SELECT * FROM beverages WHERE id = ?", [beverageId], (err, row) => {
    if (err) {
      res.status(500).send("Error reading data: " + err.message);
    } else if (!row) {
      res.status(404).send("Beverage not found");
    } else {
      const updatedBeverage = {
        ...row,
        ...inputBeverage,
      };

      db.run(
        "UPDATE beverages SET name = ?, rating = ? WHERE id = ?",
        [updatedBeverage.name, updatedBeverage.rating, beverageId],
        function (err) {
          if (err) {
            res.status(500).send("Error updating data: " + err.message);
          } else if (this.changes === 0) {
            res.status(404).send("Beverage not found");
          } else {
            res.status(200).json(updatedBeverage);
          }
        }
      );
    }
  });
});

app.delete("/beverages/:id", (req, res) => {
  const beverageId = req.params.id;

  db.run("DELETE FROM beverages WHERE id = ?", [beverageId], function (err) {
    if (err) {
      res.status(500).send("Error deleting item: " + err.message);
    } else if (this.changes === 0) {
      res.status(404).send("Item not found");
    } else {
      res.status(204).send();
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
