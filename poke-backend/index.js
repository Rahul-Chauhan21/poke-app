const express = require("express");
const app = express();
const {
  corsOptionsRequests,
  corsSimpleRequests,
} = require("./middleware/cors");
const bodyParser = require("body-parser");
const removePoweredBy = require("./middleware/removePoweredBy");

const Pokemon = require("./services/pokemon");
const PokemonProd = require("./services/pokemonProd");

app.options("*", corsOptionsRequests);
app.use(corsSimpleRequests);
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(removePoweredBy);

app.post("/pokemon", Pokemon);
app.post("/pokemonProd", PokemonProd);
module.exports = app;
