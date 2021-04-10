import React, { useState, Fragment } from "react";
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
  CardMedia,
  makeStyles,
  InputAdornment,
  Toolbar,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100vw",
    height: "100vh",
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(5),
  },
  textHeader: {
    marginBottom: theme.spacing(4),
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
  },
  label: {
    textTransform: "none",
  },
  content: {
    paddingTop: theme.spacing(4),
  },
}));

const App = () => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};
    errors.search = search ? "" : "*Please Input an ID";
    errors.search =
      !isNaN(search) && errors.search !== null
        ? errors.search
        : "*Name cannot contain alphabets";
    setErrors({ ...errors });
    return Object.values(errors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      superagent
        .post("http://localhost:5000/pokemon")
        .send({ ids: [search] })
        .set("Accept", "application/json")
        .then((res) => setPokemon(res.body));
    }
  };
  return (
    <Fragment>
      <CssBaseline />
      <main className={classes.root}>
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
          <form onSubmit={handleSubmit}>
            <Toolbar className={classes.search}>
              <TextField
                variant="outlined"
                className={classes.searchInput}
                label="Search Pokemon"
                placeholder="Input Pokemon Id"
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
              {pokemon && pokemon[0].name !== "notfound" ? (
                <Card>
                  <CardMedia component="img" image={pokemon[0]?.sprite} />
                  <CardContent className={classes.CardContent} component="div">
                    <Typography variant="h5">{`${
                      pokemon[0].name.substr(0, 1).toUpperCase() +
                      pokemon[0].name.substr(1)
                    }`}</Typography>
                    <Typography variant="subtitle1">Types:</Typography>
                    {pokemon[0].types.map((type) => (
                      <Typography variant="subtitle2">{`${
                        type.substr(0, 1).toUpperCase() + type.substr(1)
                      }`}</Typography>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Typography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  Input a valid Pokemon Number!
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
