import React, { useState } from "react";
import styles from "./app.module.css";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const ogList = localStorage.getItem("list");
  const ogCheck = localStorage.getItem("check");
  const [toDoList, setToDoList] = useState<
    { item: string; checked: boolean }[]
  >(ogList ? JSON.parse(ogList) : []);
  const [item, setItem] = useState<string>("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const list = toDoList;
    list[index] = { item: list[index].item, checked: !list[index].checked };
    localStorage.setItem("list", JSON.stringify(toDoList));
    setToDoList([...list]);
  };

  const addToList = () => {
    const list = toDoList;
    list.push({ item, checked: false });
    setToDoList([...list]);
    setItem("");
    localStorage.setItem("list", JSON.stringify(toDoList));
  };

  const deleteFromList = (index: number) => {
    const list = toDoList;
    list.splice(index, 1);
    setToDoList([...list]);
    localStorage.setItem("list", JSON.stringify(toDoList));
  };

  toDoList.sort((a, b) => {
    return a.checked ? 1 : -1;
  });

  return (
    <div className="App">
      <div className={styles.root}>
        <h1 className={styles.header}>To Do List </h1>
        <div className={styles.head}>
          <TextField
            id="filled-basic"
            label=""
            variant="filled"
            placeholder="Add something"
            onChange={(e) => setItem(e.target.value)}
            value={item}
            size="small"
            fullWidth
          />
          <IconButton disabled={item.replace(/\s/g, "") === ""} size="large">
            <AddIcon
              onClick={() => {
                addToList();
              }}
            />
          </IconButton>
        </div>

        <ul className={styles.list}>
          {toDoList.map((item, index) => (
            <div className={styles.individualItem}>
              <Checkbox
                className={styles.checkbox}
                checked={item.checked}
                onChange={(e) => handleChange(e, index)}
              />
              <li className={item.checked ? styles.strike : styles.overflow}>
                {item.item}
              </li>
              <IconButton className={styles.delete}>
                <DeleteIcon
                  onClick={() => {
                    deleteFromList(index);
                  }}
                />
              </IconButton>
            </div>
          ))}
        </ul>
        <div className={styles.footer}>Made by Tiger Hong</div>
      </div>
    </div>
  );
}

export default App;
