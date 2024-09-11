const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
];

// Get all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// Get single item by ID
app.get("/api/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send("Item not found");
  res.json(item);
});

// Create new item
app.post("/api/items", (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Delete an item
app.delete("/api/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).send("Item not found");
  const removedItem = items.splice(itemIndex, 1);
  res.json(removedItem);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
