import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

const DropDownEditor = ((props, ref) => {
  const valueRef = useRef(props.value || "");
  const [inputValue, setInputValue] = useState(valueRef.current);
  const [suggestions, setSuggestions] = useState([]);

   const rowData = props.rowData;
   const setRowData = props.setRowData;

  const field = props.colDef.field;
  var activeRowId = 1;

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
      "Dimple Jacoby",
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
    model: 
    ["Celica",
    "Boxster",
    "Mondeo",
    "x700",
    "Creata",
     "Auto"],
    color:
    ["red", 
    "white",
    "blue",
    "pink",
    "yellow"],
    Country:
    ["India",
    "USA",
    "Japan",
    "Singapore",
    "Malaysia"],
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
  useImperativeHandle(ref, () => ({
    getValue: () => valueRef.current,
  }));
  console.log(useImperativeHandle);

  const search = (event) => {
    const data = optionMap[field] || [];
    const input = event.query.toLowerCase();
    const filtered = data.filter((item) => item.toLowerCase().includes(input));
    console.log(search);
    setSuggestions(filtered);
  };

    //  const onCellValueChanged = (params) => {
    //   const updatedRow = params.data;
    //   console.log("updatedRow", updatedRow);
  
    //   const updatedData = rowData?.map((row ) =>
    //     row.id === updatedRow.id ? updatedRow : row);
    //   console.log("updatedData", updatedData);
    //   setRowData(updatedData);
    // };

    const cellValuechanged = (params) => {
        const updateRow = params.data;
        console.log('updateRow');
         rowData.map(()=>    )
        //  const updateData = rowData?.map((row)=> {
        //     row.id === updateRow.id ? updateRow :  row;
        //     console.log(updateData);
        //     setRowData(updateData);
            
         })
     console.log("clicked", params)
    
}
  useEffect(() => {
    valueRef.current = inputValue;
    console.log("updated is value", valueRef.current);

    const params = {
      rowData: {
        id: activeRowId,
        valueRef: inputValue,
      },
    };
   cellValuechanged(params);
  }, [inputValue]);

  return (
    <AutoComplete
      value={inputValue}
      suggestions={suggestions}
      completeMethod={search}
      onChange={(e) => {
        setInputValue(e.value);
        cellValuechanged =(cellValuechanged);
      }}
      dropdown
      // forceSelection={false}
      // autoFocus
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
        background: "white",
        color: "black",
        zIndex: 1000,
      }}
      itemTemplate={(item) => <div style={{ padding: "5px" }}>{item}</div>}
    />
  );
});
console.log("item");

export default DropDownEditor;
