import { LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "../components/Banner/Carousal";

function CoinScreen() {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol } = CryptoState();

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      // [theme.breakpoints.down("md")]: {
      //   flexDirection: "column",
      //   alignItems: "center",
      // },
    },
    sidebar: {
      width: "30%",
      // [theme.breakpoints.down("md")]: {
      //   width: "100%",
      // },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: `2px solid grey`,
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      textAlign: "justify",
      padding: 25,
      paddingTop: 0,
      paddingBottom: 15,
      fontFamily: "Montserrat",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      width: "100%",
      paddingTop: 10,
      // Making it responsive
      // [theme.breakpoints.down("md")]: {
      //   display: "flex",
      //   justifyContent: "space-around",
      // },
      // [theme.breakpoints.down("sm")]: {
      //   flexDirection: "column",
      //   alignItems: "center",
      // },
      // [theme.breakpoints.down("xs")]: {
      //   alignItems: "start",
      // },
    },
  }));
  const classes = useStyles();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coin) {
    return <LinearProgress style={{ backgroundColor: "gold" }} />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image?.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin?.description?.en.split(". ")[0])}
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}&nbsp;
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}&nbsp;
              {numberWithCommas(
                coin?.market_data?.market_cap[currency.toLowerCase()]
                  ?.toString()
                  .slice(0, -6)
              )}{" "}
              M
            </Typography>
          </span>
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
}

export default CoinScreen;