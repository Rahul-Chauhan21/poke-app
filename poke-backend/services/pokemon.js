const superagent = require("superagent");

const getPokemon = (id) => {
  return new Promise((resolve) => {
    superagent
      .get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then((response) => {
        const pokemon = response.body;
        response.body = {
          name: pokemon.name,
          types: pokemon.types.map((t) => t.type.name),
          sprite: pokemon.sprites.front_default,
        };
        resolve(response.body);
      })
      .catch((err) => {
        errorDetails = { name: "notfound" };
        resolve(errorDetails);
      });
  });
};

const Pokemon = async (req, res) => {
  Promise.all(req.body.ids.map((id) => getPokemon(id)))
    .then((result) => res.send(result))
    .catch((err) => res.send(`Error occurred: ${err}`));
};

module.exports = Pokemon;
