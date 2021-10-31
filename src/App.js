import "./App.css";
import { BrowserRouter as HashRouter, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import CoinScreen from "./screens/CoinScreen";

function App() {
  const useStyles = makeStyles(() => ({
    app: {
      backgroundColor: "#14161a",
      color: "white",
      minHeight: "100vh",
    },
  }));

  const classes = useStyles();

  return (
    <div className="App">
      <HashRouter>
        <div className={classes.app}>
          <Header />
          <Switch>
            <Route path="/" component={HomeScreen} exact></Route>
            <Route path="/coins/:id" component={CoinScreen} exact></Route>
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
