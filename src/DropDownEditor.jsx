import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AutoComplete } from "primereact/autocomplete";

const DropDownEditor = forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState(props.value || "");
  const [suggestions, setSuggestions] = useState([]);
  const autoCompleteRef = useRef(null);

  const field = props.colDef.field;

  const optionMap = {
    name: [
      "Isabelle Keating",
      "Charlotte Lopes",
      "Emily Jagger",
      "Andrew Jacoby",
      "Dimple Jacoby",
      "Freya Donovan",
      "Mia Hunter",
      "Mia Smith",
    ],
    make: [
      "Toyota",
      "Porsche",
      "Ford",
      "Safari",
      "Mercedes",
      "Honda",
      "Swift",
      "Jeguvar",
    ],
    model: ["Celica", "Boxster", "Mondeo", "x700", "Creta", "Auto"],
    price: ["15000", "120000", "320000", "350000", "702000"],
    color: ["red", "white", "blue", "pink", "yellow"],
    Country: ["India", "USA", "Japan", "Singapore", "Malaysia"],
    skill: [
      "Chess",
      "Billiards",
      "Tennis",
      "BasketBall",
      "Soccer",
      "Badminton",
      "Snowboarding",
    ],
  };

  const search = (event) => {
    const input = event.query.toLowerCase();
    const data = optionMap[field] || [];
    const filtered = data.filter((item) => item.toLowerCase().includes(input));
    setSuggestions(filtered);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => inputValue,
    isCancelBeforeStart: () => false,
    isCancelAfterEnd: () => false,
  }));
    useEffect(() => {
    setTimeout(() => {
      if (
        autoCompleteRef.current &&
        autoCompleteRef.current.inputEl &&
        props.eGridCell
      ) {
        const inputEl = autoCompleteRef.current.inputEl;
        const { offsetWidth, offsetHeight } = props.eGridCell;

        inputEl.style.width = `${offsetWidth}px`;
        inputEl.style.height = `${offsetHeight}px`;
        inputEl.style.lineHeight = `${offsetHeight}px`;
        inputEl.style.padding = "0 8px";
        inputEl.style.margin = "0";
        inputEl.style.border = "none";
        inputEl.style.boxSizing = "border-box";
        inputEl.style.fontSize = "14px";
      }
    }, 0);
  }, [props.eGridCell]);

  return (
    <AutoComplete
      ref={autoCompleteRef}
      value={inputValue}
      suggestions={suggestions}
      completeMethod={search}
      onChange={(e) => {
        setInputValue(e.value);

        // Live update row data
        if (props.setRowData && props.rowData && props.node?.data) {
          const updatedRow = { ...props.node.data, [field]: e.value };
          const updatedData = props.rowData.map((row) =>
            row.id === updatedRow.id ? updatedRow : row
          );
          props.setRowData(updatedData);
        }
      }}
      dropdown
      style={{
        width: "240px",
        height: "40px",
        fontSize: "14px",
        padding: 0,
      }}
      panelStyle={{
        fontSize: "14px",
        background: "#f0f8ff", // Light blue background
        color: "#333",
        zIndex: 1000,
        minWidth: "150px", // set minimum width 
        maxHeight: "200px", // optional scroll
        overflowY: "auto",
      }}
      itemTemplate={(item) => (
        <div
          style={{
            padding: "5px 10px",
            color: "#fff",
            backgroundColor: "#007acc", // Blue background for item
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {item}
        </div>
      )}
    />
  );
});

export default DropDownEditor;
