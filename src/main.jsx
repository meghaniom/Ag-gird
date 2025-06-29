import React, { useMemo, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { PrimeReactProvider } from "primereact/api";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import DropDownEditor from "./DropDownEditor";

ModuleRegistry.registerModules([AllCommunityModule]);

const LOCAL_STORAGE_KEY = "aggrid_row_data";

const defaultData = [
  {
    name: "Isabelle Keating",
    id: 1,
    make: "Toyota",
    model: "Celica",
    price: 350000,
    color: "red",
    Country: "India",
    skill: "Billiards",
  },
  {
    name: "Charlotte Lopes",
    id: 2,
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
    id: 3,
    model: "Celica",
    price: 350000,
    color: "red",
    Country: "India",
    skill: "Chess",
  },
  {
    name: "Andrew Jacoby",
    make: "Ford",
    id: 4,
    model: "Mondeo",
    price: 320000,
    color: "white",
    Country: "Japan",
    skill: "Tennis",
  },
  {
    name: "Dimple Jacoby",
    make: "Toyota",
    id: 5,
    model: "Celica",
    price: 350000,
    color: "red",
    Country: "India",
    skill: "Football",
  },
  {
    name: "Freya Donovan",
    make: "Toyota",
    id: 6,
    model: "Auto",
    price: 120000,
    color: "pink",
    Country: "USA",
    skill: "BasketBall",
  },
  {
    name: "Mia Hunter",
    make: "Toyota",
    id: 7,
    model: "Celica",
    price: 350000,
    color: "red",
    Country: "India",
    skill: "Badminton",
  },
  {
    name: "Mia Smith",
    make: "Safari",
    id: 8,
    model: "x700",
    price: 15000,
    color: "yellow",
    Country: "Japan",
    skill: "Soccer",
  },
  {
    name: "Dimple Jacoby",
    make: "Mercedes",
    id: 9,
    model: "Creta",
    price: 120000,
    color: "blue",
    Country: "Malaysia",
    skill: "Snowboarding",
  },
];

const getInitialRowData = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "600px" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState(getInitialRowData);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rowData));
  }, [rowData]);

  const sharedEditorParams = { rowData, setRowData };

  const columnDefs = useMemo(() => [
    {
      headerName: "Name",
      field: "name",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
    {
      field: "id",
      editable: false,
    },
    {
      field: "make",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
    {
      field: "model",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
    {
      field: "price",
      editable: true,
      // cellEditor: DropDownEditor,
      // cellEditorPopup: true,
      // cellEditorParams: sharedEditorParams,
    },
    {
      field: "color",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
    {
      field: "Country",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
    {
      field: "skill",
      editable: true,
      cellEditor: DropDownEditor,
      cellEditorPopup: true,
      cellEditorParams: sharedEditorParams,
    },
  ], [rowData]);

  const myTheme = themeQuartz.withParams({
    spacing: 12,
    accentColor: "gray",
  });

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={(params) => {
            const updatedRow = params.data;
            setRowData((prevData) =>
              prevData.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
              )
            );
          }}
          theme={myTheme}
          defaultColDef={{
            editable: true,
            flex: 1,
            minWidth: 100,
            resizable: true,
          }}
          singleClickEdit={true}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <PrimeReactProvider>
    <GridExample />
  </PrimeReactProvider>
);
