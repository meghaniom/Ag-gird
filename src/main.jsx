import React, {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AutoComplete } from "primereact/autocomplete";
import { PrimeReactProvider } from "primereact/api";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { NoEncryption } from "@mui/icons-material";
ModuleRegistry.registerModules([AllCommunityModule]);

const DropdownEditor = forwardRef((props, ref) => {
  const valueRef = useRef(props.value || "");
  const [inputValue, setInputValue] = useState(valueRef.current);
  const [suggestions, setSuggestions] = useState([]);

  const field = props.colDef.field;
  const optionsMap = {
    name: ["Isabelle", "Charlotte", "Emily", "Andrew"],
    make: ["Toyota", "Porsche", "Ford", "Safari", "Mercedes"],
    model: ["Celica", "Boxster", "Mondeo", "x700", "Creata"],
    color: ["red", "white", "blue", "pink", "yellow"],
    Country: ["India", "USA", "Japan", "Singapore", "Malaysia"],
    skill: ["Chess", "Tennis", "BasketBall", "Soccer", "Badminton"],
  };

  useImperativeHandle(ref, () => ({
    getValue: () => valueRef.current, // ✅ always latest value
    isCancelAfterEnd: () => false,
  }));

  const search = (event) => {
    const data = optionsMap[field] || [];
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(event.query.toLowerCase())
    );
    setSuggestions(filtered);
  };
  return (
    <AutoComplete
      value={inputValue}
      suggestions={suggestions}
      completeMethod={search}
      onChange={(e) => {
        setInputValue(e.value);
        valueRef.current = e.value
      }}
      dropdown
      forceSelection={false}
      autoFocus
      style={{
        width: "100%",
        height: "100%",
        fontSize: "14px",
        padding: 0,
        background: "yellow",
        outline: "none",
      }}
      panelStyle={{
        fontSize: "14px",
        background: "gray",
        color: "white",
        zIndex: 1000,
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          props.stopEditing(); 
          e.stopPropagation();
        }
      }}
      onBlur={() => {
        props.stopEditing(); 
      }}
      onSelect={(e) => {
       setInputValue(e.value);
       valueRef.current = e.value;
       props.stopEditing()
      }}
      itemTemplate={(item) => <div style={{ padding: "5px" }}>{item}</div>}
    />
  );
});

const GridExample = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([
    {
      name: "Isabelle Keating",
      make: "Toyota",
      model: "Celica",
      price: 350000,
      color: "red",
      Country: "India",
      skill: "Billiards",
    },
    {
      name: "Charlotte Lopes",
      make: "Porsche",
      model: "Boxster",
      price: 702000,
      color: "pink",
      Country: "Singapore",
      skill: "BasketBall",
    },
    {
      name: "Emily Jagger",
      make: "Toyota",
      model: "Celica",
      price: 350000,
      color: "red",
      Country: "India",
      skill: "Chess",
    },
    {
      name: "Andrew Jacoby",
      make: "Ford",
      model: "Mondeo",
      price: 320000,
      color: "white",
      Country: "Japan",
      skill: "Tennis",
    },
    {
      name: "Dimple Jacoby",
      make: "Toyota",
      model: "Celica",
      price: 350000,
      color: "red",
      Country: "India",
      skill: "Football",
    },
    {
      name: "Freya Donovan",
      make: "Toyota",
      model: "Auto",
      price: 120000,
      color: "pink",
      Country: "USA",
      skill: "BasketBall",
    },
    {
      name: "Mia Hunter",
      make: "Toyota",
      model: "Celica",
      price: 350000,
      color: "red",
      Country: "India",
      skill: "Badminton",
    },
    {
      name: "Mia Smith",
      make: "Safari",
      model: "x700",
      price: 15000,
      color: "yellow",
      Country: "Japan",
      skill: "Soccer",
    },
    {
      name: "Dimple Jacoby",
      make: "Mercedes",
      model: "Creta",
      price: 120000,
      color: "blue",
      Country: "Malaysia",
      skill: "Snowboarding",
    },
  ]);

  const columnDefs = useMemo(
    () => [
      { field: "name", editable: true, cellEditor: DropdownEditor },
      { field: "make", editable: true, cellEditor: DropdownEditor },
      { field: "model", editable: true, cellEditor: DropdownEditor },
      { field: "price" },
      { field: "color", editable: true, cellEditor: DropdownEditor },
      { field: "Country", editable: true, cellEditor: DropdownEditor },
      { field: "skill", editable: true, cellEditor: DropdownEditor },
    ],
    []
  );

  const myTheme = themeQuartz.withParams({
    spacing: 12,
    accentColor: "gray",
  });

  const onCellValueChanged = (params) => {
    const updatedData = [...rowData];
    updatedData[params.rowIndex] = params.data;
    setRowData(updatedData);
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          theme={myTheme}
          defaultColDef={{
            editable: true,
            flex: 0,
            minWidth: 100,
            resizable: true,
          }}
          onCellValueChanged={onCellValueChanged} // Add this handler
          singleClickEdit={true} // Makes editing start on single click
        />
      </div>
    </div>
  );
};

// Render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <PrimeReactProvider>
    <GridExample />
  </PrimeReactProvider>
);
