const superagent = require("superagent");

const getPokemonByName = async (name) => {
  try {
    const res = await superagent.get(
      `https://pokeapi.co/api/v2/pokemon/${name}/`
    );
    return res;
  } catch (err) {
    return err;
  }
};

const getPokemonById = async (id) => {
  try {
    const res = await superagent.get(
      `https://pokeapi.co/api/v2/pokemon/${id}/`
    );
    return res;
  } catch (err) {
    return err;
  }
};
const PokemonProd = async (req, res) => {
  const searchParam = req.body.search;
  const response = await Promise.resolve(
    isNaN(searchParam)
      ? getPokemonByName(searchParam)
      : getPokemonById(searchParam)
  ).then((result) => {
    if (result.status === 404 || result.statusText === "Not Found") {
      return {
        error: "Ops! Your Pokemon is not discovered yet by Our Pokedex!",
      };
    }
    return {
      name: result.body.name,
      types: result.body.types.map((t) => t.type.name),
      sprite: result.body.sprites.other.dream_world.front_default,
      xp: result.body.base_experience,
      hp: result.body.stats[0].base_stat,
      weight: result.body.weight,
      height: result.body.height,
      abilities: result.body.abilities.map((a) => a.ability.name),
    };
  });
  res.status(200).json(response);
};

module.exports = PokemonProd;
