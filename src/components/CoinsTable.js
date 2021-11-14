import {
  Container,
  createTheme,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "./Banner/Carousal";

const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: "#16171a",
    cursor: "poniter",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
}));

function CoinsTable() {
  const classes = useStyles();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { currency, symbol } = CryptoState();
  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      type: "dark",
    },
  });

  const fetchCoinsList = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoinsList(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{
            margin: 18,
            fontFamily: "Montserrat",
          }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          variant="outlined"
          label="Search for a Crypto Currency"
          fullWidth
          style={{ marginBottom: 20 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <>
              <Table>
                <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                  <TableRow>
                    {["Coin", "Price", "24h Change", "Market Cap"].map(
                      (head) => (
                        <TableCell
                          style={{
                            color: "black",
                            fontWeight: 700,
                            fontFamily: "Montserrat",
                          }}
                          key={head}
                          align={head === "Coin" ? "" : "right"}
                        >
                          {head}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handleSearch()
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map((coin) => {
                      let profit = coin?.price_change_percentage_24h >= 0;
                      return (
                        <TableRow
                          onClick={() => history.push(`/coins/${coin.id}`)}
                          key={coin?.name}
                          className={classes.row}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              display: "flex",
                              gap: 15,
                            }}
                          >
                            <img
                              src={coin?.image}
                              alt={coin.name}
                              height="50"
                              style={{ marginBottom: 10 }}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                //   alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ fontSize: 22 }}>
                                {coin.symbol.toUpperCase()}
                              </span>
                              <span style={{ color: "darkgray" }}>
                                <span>{coin.name}</span>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell style={{}} align="right">
                            {symbol} &nbsp;
                            {coin?.price_change_24h?.toFixed(2)}
                          </TableCell>
                          <TableCell
                            style={{
                              fontWeight: 500,
                              color: profit > 0 ? "rgb(14,203,129)" : "red",
                            }}
                            align="right"
                          >
                            {profit && "+"}
                            {coin?.price_change_percentage_24h?.toFixed(2)} %
                          </TableCell>
                          <TableCell style={{}} align="right">
                            {symbol} &nbsp;
                            {numberWithCommas(
                              coin?.market_cap?.toString().slice(0, -6)
                            )}{" "}
                            M
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </>
          )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default CoinsTable;
