import { makeStyles } from "@material-ui/styles";
import React from "react";

function SelectButton({ children, selected, onClick }) {
  const useStyles = makeStyles((theme) => ({
    selectButton: {
      border: "1px solid gold",
      borderRadius: 5,
      padding: theme.spacing(1, 2),
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "gold" : "",
      color: selected ? "black" : "",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        backgroundColor: "gold",
        color: "black",
      },
      width: "22%",
      margin: 5,
    },
  }));
  const classes = useStyles();
  return (
    <span onClick={onClick} className={classes.selectButton}>
      {children}
    </span>
  );
}

export default SelectButton;
