import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AutoComplete } from "primereact/autocomplete";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentCell, setCurrentCell] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  // Sample initial data
  const allData = [
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
  ];

  const [colDefs] = useState([
    {
      field: "id",
      headerName: "Id",
      cellRenderer: (params) => renderClickableCell(params),
    },
    {
      field: "name",
      headerName: "Product",
      cellRenderer: (params) => renderClickableCell(params),
    },
    {
      field: "group",
      headerName: "Group",
      cellRenderer: (params) => renderClickableCell(params),
    },
    {
      field: "price",
      headerName: "Price",
      cellRenderer: (params) => renderClickableCell(params),
    },
    {
      field: "number",
      headerName: "Number",
      cellRenderer: (params) => renderClickableCell(params),
    },
  ]);

  useEffect(() => {
    setRowData([...allData]);
  }, []);

  const renderClickableCell = (params) => {
    return (
      <div
        className="clickable-cell"
        onClick={(e) => handleCellClick(e, params)}
      >
        {params.value || <span style={{ color: "#999" }}>Click to edit</span>}
      </div>
    );
  };

  const handleCellClick = (event, params) => {
    const cellElement = event.currentTarget;
    const parentElement = cellElement.offsetParent;
    const parentRect = parentElement.getBoundingClientRect();
    const cellReact = cellElement.getBoundingClientRect();

    const top = cellReact.bottom - parentRect.top;
    const left = cellReact.left - parentRect.left;

    setDropdownPosition({ top, left });
    setCurrentCell({
      rowIndex: params.rowIndex,
      field: params.colDef.field,
      currentValue: params.value,
    });

    setSearchText("");
    setSuggestions([]);
    setShowDropdown(true);
  };

  // 🔁 This generates dynamic suggestions from user input
  const handleSearch = (event) => {
    const query = event.query.toLowerCase();
    setSearchText(event.query);

    if (!currentCell) return;

    // Generate fake suggestions dynamically
    const dynamicSuggestions = [...Array(10).keys()].map((i) => ({
      label: `${query} `,
      value: `${query} `,
    }));
    setSuggestions(dynamicSuggestions);
  };
  const handleSuggestionSelect = (e) => {
    const newValue = e.value;
    const updatedData = [...rowData];
    updatedData[currentCell.rowIndex][currentCell.field] = newValue;
    setRowData(updatedData);
    setShowDropdown(false);
    if (gridApi && currentCell) {
      const rowNode = gridApi.getDisplayedRowAtIndex(currentCell.rowIndex);
      if (rowNode) {
        gridApi.refreshCells({
          rowNodes: [rowNode],
          columns: [currentCell.field],
          force: true,
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        !event.target.closest(".p-autocomplete") &&
        !event.target.closest(".clickable-cell")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Smart Editable Grid</h2>
      <div
        className="ag-theme-alpine"
        style={{
          height: "400px",
          width: "100%",
          position: "relative",
          border: "1px solid #ccc",
        }}
      >
        <style>
          {`
    .ag-theme-alpine .ag-cell {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }
    .ag-theme-alpine .ag-row:last-child .ag-cell {
        border-bottom: none;
    }
    `}
        </style>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.sizeColumnsToFit(); // This is safe now
          }}
        />
      </div>
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 1000,
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            padding: "10px",
            borderRadius: "4px",
            minWidth: "200px",
          }}
          className="p-autocomplete"
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
      <style jsx>{`
        .clickable-cell {
          cursor: pointer;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 10px;
        }
        .clickable-cell:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default About;
