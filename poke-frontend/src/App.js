import React, { useState, useEffect, Fragment } from "react";
import superagent from "superagent";
import {
  Container,
  CssBaseline,
  Grid,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  makeStyles,
  InputAdornment,
  Toolbar,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: "100vw",
    height: "100vh",
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(5),
  },
  img: {
    width: "80%",
    [theme.breakpoints.up("xs")]: {
      padding: "40px",
    },
  },
  imgContainer: {
    position: "relative",
    borderRadius: "50%",
    textAlign: "center",
  },
  textHeader: {
    marginBottom: theme.spacing(4),
  },
  seperator: {
    borderTop: 0,
    borderBottom: "10px solid #6EECB7",
    borderRadius: "5px",
    width: "60%",
  },
  search: {
    display: "flex",
  },
  searchInput: {
    flexGrow: 1,
    width: "75%",
    marginRight: theme.spacing(1),
  },
  CardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "100px",
    marginTop: "-140px",
  },
  root: {
    overflow: "visible",
  },
  label: {
    textTransform: "none",
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(0.5),
    },
  },
  errorMessage: {
    paddingTop: theme.spacing(4),
  },
}));

const App = () => {
  const classes = useStyles();
  const [search, setSearch] = useState("Charizard");
  const [pokemon, setPokemon] = useState("");
  const [errors, setErrors] = useState({});

  const capitalizeFirstLetter = (str) => {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  };

  const validate = () => {
    let errors = {};
    const letterNumber = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
    errors.search = search ? "" : "*Please Input an ID or Name";
    errors.search =
      !search.match(letterNumber) && errors.search !== null
        ? errors.search
        : "*Input cannot contain both Alphabets & Numbers";
    setErrors({ ...errors });
    return Object.values(errors).every((x) => x === "");
  };

  const request = () => {
    superagent
      .post("http://localhost:5000/pokemonProd")
      .send({ search: isNaN(search) ? search.toLowerCase() : search })
      .set("Accept", "application/json")
      .then((res) => setPokemon(res.body));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      request();
    }
  };

  useEffect(() => {
    request(); // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      <main className={classes.main}>
        <div>
          <Container maxWidth="sm" className={classes.textHeader}>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
            >
              Display Details of a Pokemon within a Card!
            </Typography>
          </Container>
        </div>
        <Container>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Toolbar className={classes.search}>
              <TextField
                variant="outlined"
                className={classes.searchInput}
                label="Search Pokemon"
                placeholder="Input Pokemon Id or Name"
                name="pokemon"
                value={search}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearch(e.target.value)}
                {...(errors.search && {
                  error: true,
                  helperText: errors.search,
                })}
              />
              <Button
                variant="contained"
                type="submit"
                size="large"
                color="primary"
                classes={{ label: classes.label }}
              >
                Submit
              </Button>
            </Toolbar>
          </form>
          <Grid container justify="center" className={classes.content}>
            <Grid item xs={10} sm={6} md={4} lg={4}>
              {pokemon && pokemon.error === undefined ? (
                <>
                  <div className={classes.imgContainer}>
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className={classes.img}
                    />
                  </div>
                  <Card classes={{ root: classes.root }}>
                    <CardContent
                      className={classes.CardContent}
                      component="div"
                    >
                      <Typography variant="h5">{`${capitalizeFirstLetter(
                        pokemon.name
                      )}`}</Typography>
                      <hr className={classes.seperator} />
                      <div className="stats">
                        <span className="first cp-text">{`Max Hp ${pokemon.hp}`}</span>
                        <span className="cp-text">{`Xp ${pokemon.xp}`}</span>
                      </div>

                      <div className="attributes-container">
                        <div
                          className="col attributes-content"
                          style={{ minWidth: "42%" }}
                        >
                          <p className="cp-text">
                            {pokemon.types.map((t, idx, { length }) =>
                              idx + 1 !== length && length > 1
                                ? `${t}/`
                                : `${t}`
                            )}
                          </p>
                          <small className="text-muted">Type</small>
                        </div>
                        <div className="col attributes-content">
                          <p className="cp-text">{`${pokemon.weight}kg`}</p>
                          <small className="text-muted">Weight</small>
                        </div>
                        <div className="col attributes-content">
                          <p
                            className="cp-text no-border"
                            style={{ borderRight: 0 }}
                          >
                            {`${pokemon.height / 10}m`}
                          </p>
                          <small className="text-muted">Height</small>
                        </div>
                      </div>

                      <div className="player-data">
                        <div className="col data-container">
                          <p className="stardust">
                            {pokemon.abilities.map((a, idx, { length }) =>
                              idx + 1 !== length && length > 1
                                ? `${capitalizeFirstLetter(a)}, `
                                : `${capitalizeFirstLetter(a)}`
                            )}
                          </p>
                          <p className="muted-text">Abilities</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Typography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  paragraph
                  className={classes.errorMessage}
                >
                  {pokemon.error}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </main>
    </Fragment>
  );
};

export default App;
