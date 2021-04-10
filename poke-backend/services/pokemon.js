const superagent = require("superagent");

const getPokemon = async (id) => {
  try {
    const res = await superagent.get(
      `https://pokeapi.co/api/v2/pokemon/${id}/`
    );
    return res;
  } catch (err) {
    return { name: "notfound" };
  }
};
const Pokemon = async (req, res) => {
  const response = await Promise.all(
    req.body.ids.map((id) => getPokemon(id))
  ).then((result) => {
    return result
      .filter((el) => el !== null)
      .map((el) => {
        if (el.name === "notfound") {
          return { name: "notfound" };
        }
        return {
          name: el.body.name,
          types: el.body.types.map((t) => t.type.name),
          sprite: el.body.sprites.front_default,
        };
      });
  });
  res.status(200).json(response);
};

module.exports = Pokemon;
