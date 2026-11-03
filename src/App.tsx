import React, { useMemo, useState } from "react";
import styles from "./app.module.css";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  // FIX: lazy-init + try/catch. Previously a corrupted stored value threw
  // during render and whitescreened the app, and localStorage was re-read
  // on every render. Items also get a stable id (see below).
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

  // FIX: handlers are now immutable (map/filter/spread) and persist the
  // NEW list, not the stale state. Previously they mutated toDoList in
  // place and stringified the old state.
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

  // FIX: sort a COPY, in render, with a total comparator. Previously
  // toDoList.sort() mutated live state on every render and ignored `b`,
  // so order between same-checked items was unstable — and the old
  // index-based handlers then edited/deleted the wrong row after sorting.
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
