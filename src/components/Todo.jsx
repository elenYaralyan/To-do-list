import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "../components/todo.css";

function Todo() {
  const ref = useRef();
  const [type, setType] = useState("all");
  const [inputValue, setInputValue] = useState({ value: "", id: null });
  const [filterData, setFilterData] = useState({
    all: [],
    active: [],
    completed: [],
  });

  function turnChecked() {
    const result = filterData.all.every((el) => el.checked);
    setFilterData({
      ...filterData,
      all: filterData.all.map((el) => {
        el.checked = !result;
        return el;
      }),
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.target.value) {
      const item = {
        id: uuid(),
        text: ref.current.value,
        checked: false,
      };
      setFilterData({
        ...filterData,
        all: [item, ...filterData.all],
        active: [item, ...filterData.active],
      });
      e.target.value = "";
    }
  }

  function toggleChecked(id) {
    const active = [];
    const completed = [];
    const all = filterData.all.map((el) => {
      if (el.id === id) el.checked = !el.checked;
      if (el.checked) completed.push(el);
      else active.push(el);
      return el;
    });
    setFilterData({ active, all, completed });
  }

  function deleteListItem(id) {
    filterData.all = filterData.all.filter((el) => el.id !== id);
    toggleChecked();
  }

  const blur = (e, id) => {
    e.target.setAttribute("readOnly", "true");
    filterData.all = filterData.all.map((item) => {
      if (item.id === id) {
        item.text = inputValue.value;
      }
      return item;
    });
    toggleChecked();
  };

  return (
    <div className="wrapper">
      <h1 className="title">todos</h1>
      <div className="todo">
        <span className="arrow" onClick={turnChecked}>
          &#8744;
        </span>
        <input
          ref={ref}
          className="todo-inp"
          placeholder="What needs to be done..."
          onKeyDown={handleKeyDown} />
      </div>
      <ul className="list">
        {filterData[type].map((el) => (
          <li key={el.id} className="list-item">
            <input
              type="checkbox"
              className="check-inp"
              checked={el.checked}
              onChange={() => toggleChecked(el.id)} />
            <input
              onDoubleClick={(e) => {
                e.target.removeAttribute("readOnly");
                setInputValue({ value: e.target.value, id: el.id });
              }}
              onChange={(e) => setInputValue({ value: e.target.value, id: el.id })}
              onBlur={(e) => blur(e, el.id)}
              readOnly
              type="text"
              value={inputValue.id === el.id ? inputValue.value : el.text}
              className={el.checked ? "toggle hello" : "hello"}
            />
            <span className="delete" onClick={() => deleteListItem(el.id)}>
              &#935;
            </span>
          </li>
        ))}
      </ul>
      {!!filterData.all.length && (
        <div className="type">
          <span className="elements">{filterData.active.length} left ....</span>
          <span className="elements" onClick={() => setType("all")}>All</span>
          <span className="elements" onClick={() => setType("active")}>Active</span>
          <span className="elements" onClick={() => setType("completed")}>Completed</span>
        </div>
      )}
    </div>
  );
}

export default Todo;
