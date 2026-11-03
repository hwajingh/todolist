import React, { useMemo, useState } from "react";
import styles from "./app.module.css";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  // Lazy-init with try/catch, so a corrupted stored value cannot whitescreen the app.
  const [toDoList, setToDoList] = useState<
    { id: string; item: string; checked: boolean }[]
  >(() => {
    try {
      const ogList = localStorage.getItem("list");
      const parsed = ogList ? JSON.parse(ogList) : [];
      return parsed.map(
        (entry: { id?: string; item: string; checked: boolean }, i: number) => ({
          id: entry.id ?? `legacy-${i}-${Date.now()}`,
          item: entry.item,
          checked: entry.checked,
        })
      );
    } catch {
      return [];
    }
  });
  const [item, setItem] = useState<string>("");

  // Handlers are immutable and persist the new list, not stale state.
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const next = toDoList.map((entry) =>
      entry.id === id ? { ...entry, checked: !entry.checked } : entry
    );
    setToDoList(next);
    localStorage.setItem("list", JSON.stringify(next));
  };

  const addToList = () => {
    if (item.trim() === "") {
      return;
    }
    const next = [
      ...toDoList,
      {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        item,
        checked: false,
      },
    ];
    setToDoList(next);
    setItem("");
    localStorage.setItem("list", JSON.stringify(next));
  };

  const deleteFromList = (id: string) => {
    const next = toDoList.filter((entry) => entry.id !== id);
    setToDoList(next);
    localStorage.setItem("list", JSON.stringify(next));
  };

  // Sort a copy in render; never mutate live state.
  const sortedList = useMemo(
    () =>
      [...toDoList].sort(
        (a, b) => Number(a.checked) - Number(b.checked)
      ),
    [toDoList]
  );

  return (
    <div className="App">
      <div className={styles.root}>
        <h1 className={styles.header}>To Do List </h1>
        <form
          className={styles.head}
          onSubmit={(e) => {
            e.preventDefault();
            addToList();
          }}
        >
          <TextField
            id="filled-basic"
            label="New to-do"
            variant="filled"
            placeholder="Add something"
            onChange={(e) => setItem(e.target.value)}
            value={item}
            size="small"
            fullWidth
          />
          <IconButton
            type="submit"
            aria-label="Add to-do"
            disabled={item.replace(/\s/g, "") === ""}
            size="large"
          >
            <AddIcon />
          </IconButton>
        </form>

        <ul className={styles.list}>
          {sortedList.map((item) => (
            <li className={styles.individualItem} key={item.id}>
              <Checkbox
                className={styles.checkbox}
                checked={item.checked}
                onChange={(e) => handleChange(e, item.id)}
                inputProps={{ "aria-label": `Mark ${item.item} done` }}
              />
              <span
                className={item.checked ? styles.strike : styles.overflow}
                title={item.item}
              >
                {item.item}
              </span>
              <IconButton
                className={styles.delete}
                aria-label={`Delete ${item.item}`}
                onClick={() => {
                  deleteFromList(item.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>Made by Tiger Hong</div>
      </div>
    </div>
  );
}

export default App;
