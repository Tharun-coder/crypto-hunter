import axios from "axios";
import React, { useEffect, useState } from "react";
import { CircularProgress, createTheme, makeStyles } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { ThemeProvider } from "@material-ui/styles";
import { HistoricalChart } from "../config/api";
import { CryptoState } from "../CryptoContext";
import chartDays from "../config/chartDays";
import SelectButton from "./SelectButton";

function CoinInfo(props) {
  const { coin } = props;
  const [historicalData, setHistoricalData] = useState([]);
  const [days, setDays] = useState(1);
  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        paddingTop: 0,
        padding: 20,
      },
    },
  }));
  const classes = useStyles();

  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios(HistoricalChart(coin?.id, days, currency));
    setHistoricalData(data?.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicalData ? (
          <CircularProgress
            size={250}
            thickness={1}
            style={{ color: "gold" }}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData?.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />

            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((each) => {
                return (
                  <SelectButton
                    key={each.value}
                    onClick={() => setDays(each.value)}
                    selected={each.value === days}
                  >
                    {each.label}
                  </SelectButton>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default CoinInfo;
