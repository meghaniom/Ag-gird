import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AutoComplete } from "primereact/autocomplete";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";

import './App.css'
import {
  ClientSideRowModelModule,
  RowSelectionModule,
  ModuleRegistry,
  PaginationModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
  PaginationModule,
  
]);

const About = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentCell, setCurrentCell] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [initialData, setInitialData] = useState([
    { id: 1, name: "Alice", group: "Group A", price: 100, number: 120 },
    { id: 2, name: "Bob", group: "Group B", price: 120, number: 100 },
    { id: 3, name: "Coc", group: "Group C", price: 150, number: 80 },
    { id: 4, name: "Dod", group: "Group D", price: 190, number: 130 },
    { id: 5, name: "Eve", group: "Group E", price: 190, number: 200 },
    { id: 6, name: "Frank", group: "Group A", price: 140, number: 120 },
    { id: 7, name: "Grace", group: "Group B", price: 130, number: 150 },
    { id: 8, name: "Hank", group: "Group C", price: 110, number: 160 },
    { id: 9, name: "Ivy", group: "Group D", price: 100, number: 65 },
    { id: 10, name: "Jack", group: "Group E", price: 70, number: 32 },
    { id: 11, name: "Karen", group: "Group A", price: 50, number: 21 },
    { id: 12, name: "Leo", group: "Group B", price: 80, number: 100 },
    { id: 13, name: "Mona", group: "Group C", price: 60, number: 165 },
    { id: 14, name: "Nick", group: "Group D", price: 70, number: 65 },
    { id: 15, name: "Olivia", group: "Group E", price: 150, number: 32 },
  ]);

  const [colDefs] = useState([
    { field: "id", headerName: "ID", cellRenderer: renderClickableCell },
    { field: "name", headerName: "Name", cellRenderer: renderClickableCell },
    { field: "group", headerName: "Group", cellRenderer: renderClickableCell },
    { field: "price", headerName: "Price", cellRenderer: renderClickableCell },
    {
      field: "number",
      headerName: "Number",
      cellRenderer: renderClickableCell,
    },
  ]);

  useEffect(() => {
    setRowData([...initialData]); // Initialize table from initialData
  }, [initialData]);

  function renderClickableCell(params) {
    return (
      <div
        className="clickable-cell"
        onClick={(e) => handleCellClick(e, params)}
        key={`${params.rowIndex}-${params.colDef.field}`}
      >
        {params.value !== undefined && params.value !== null ? (
          params.value
        ) : (
          <span style={{ color: "#aaa" }}>Click to edit</span>
        )}
      </div>
    );
  }

  const handleCellClick = (event, params) => {
    const cellElement = event.currentTarget;
    const parentRect = cellElement.offsetParent.getBoundingClientRect();
    const cellRect = cellElement.getBoundingClientRect();

    setDropdownPosition({
      top: cellRect.bottom - parentRect.top,
      left: cellRect.left - parentRect.left,
    });
    setCurrentCell({
      rowIndex: params.rowIndex,
      field: params.colDef.field,
      currentValue: params.value,
    });
    setSearchText("");
    setSuggestions([]);
    setShowDropdown(true);
  };

  const handleSearch = (e) => {
    const query = e.query.toLowerCase();
    const dynamicSuggestions = [...Array(5).keys()].map((i) => ({
      label: `${query} ${i + 1}`,
      value: `${query} ${i + 1}`,
    }));
    setSuggestions(dynamicSuggestions);
    setSearchText(e.query);
  };

  const handleSuggestionSelect = (e) => {
    const newValue = e.value;
    if (!currentCell) return;

    const updateRow = (data) =>
      data.map((row, index) =>
        index === currentCell.rowIndex
          ? { ...row, [currentCell.field]: newValue }
          : row
      );

    const updatedRowData = updateRow(rowData);
    const updatedInitialData = updateRow(initialData);

    setRowData([...updatedRowData]); // grid refresh
    setInitialData([...updatedInitialData]); // ensure immutability
    setDefaultData(updateRow(defaultData)); // optional

    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showDropdown &&
        !e.target.closest(".p-autocomplete") &&
        !e.target.closest(".clickable-cell")
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);


  const onGridReady = (params) => {
  setGridApi(params.api);
  const checkGridReady = () => {
    const gridEl = document.querySelector('.ag-theme-alpine');
    if (gridEl && gridEl.offsetWidth > 0) {
      params.api.sizeColumnsToFit();
    } else {
      setTimeout(checkGridReady, 50);
    }
  };
  checkGridReady();
};
const onFirstDataRendered = (params) => {
  try {
    const allColumnIds = params.columnApi.getColumns()
      .map(column => column.getId());``
    
    // First auto-size columns based on content
    params.columnApi.autoSizeColumns(allColumnIds);
    
    // Then fit to grid width
    setTimeout(() => params.api.sizeColumnsToFit(), 50);
  } catch (error) {
    console.warn("Column sizing error:", error);
  }
};
  

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Smart Editable Grid</h2>

      <button
        onClick={() => setRowData([...initialData])}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Reset Grid
      </button>

      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", position: "relative", minHeight: "400px" }}
      >
   <AgGridReact
  ref={gridRef}
  rowData={rowData}
  columnDefs={colDefs}
  pagination={true}
  paginationPageSize={10}
  onGridReady={(params) => setGridApi(params.api)}
  onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
/>
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 1000,
            background: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            padding: "8px",
            borderRadius: "4px",
            minWidth: "200px",
          }}
        >
          <AutoComplete
            value={searchText}
            suggestions={suggestions}
            completeMethod={handleSearch}
            onChange={(e) => setSearchText(e.value)}
            onSelect={handleSuggestionSelect}
            field="label"
            placeholder="Type to search..."
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
            autoFocus
            dropdown
          />
        </div>
      )}

    <style>
      <div className="clickable-cell"></div>
    </style>
    </div>
  );
};

export default About;
