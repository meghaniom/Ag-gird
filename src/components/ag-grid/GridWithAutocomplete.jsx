import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { RowSelectionModule } from "ag-grid-community";
import AutocompleteCellEditor from "./AutocompleteCellEditor";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule, // ✅ Register this
]);

function GridWithAutocomplete() {
  const [rowData, setRowData] = useState([
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

  const [lastEditedValue, setLastEditedValue] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const gridRef = useRef();
  const columnDefs = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
    },
    {
      headerName: "Group",
      field: "group",
      editable: true,
      cellEditor: AutocompleteCellEditor,
      cellEditorPopup: true,
      cellEditorParams: {
        options: ["Group A", "Group B", "Group C", "Group D", "Group E"],
      },
    },
    { headerName: "Number", field: "number", editable: true },

    {
      headerName: "Price",
      field: "price",
      editable: true,
      filter: "agNumberColumnFilter",
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
  ];
  console.log("selectedRowId");

  return (
    <div style={{ width: "500px" }}>
      <div
        className="ag-theme-alpine"
        style={{ height: 400, border: "1px solid #ccc" }}
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
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          singleClickEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          pagination={true}
          rowSelection="single"
          onSelectionChanged={() => {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            if (selectedNodes.length > 0) {
              const row = selectedNodes[0].data;
              setSelectedRowId(row.id);
              setInputValue(row.group);
            } else {
              setSelectedRowId(null);
              setInputValue("");
            }
          }}
          onCellValueChanged={(e) => {
            const updatedData = rowData.map((row) =>
              row.id === e.data.id ? e.data : row
            );
            setRowData(updatedData);
            setLastEditedValue(
              `Field: ${e.colDef.field}, Value: ${e.newValue}`
            );
            if (e.colDef.field === "group" && e.data.id === selectedRowId) {
              setInputValue(e.newValue);
            }
          }}
        />
      </div>
    </div>
  );
}

export default GridWithAutocomplete;
