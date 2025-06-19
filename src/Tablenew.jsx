import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// 🔧 Custom AutoComplete component (NO MUI)
const CustomAutoComplete = ({ value, data, updateRowValueById }) => {
  const options = ['Pending', 'In Progress', 'Completed'];
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setFilteredOptions(
      options.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue]);

  const handleSelect = (option) => {
    setInputValue(option);
    updateRowValueById(data.id, { status: option });
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', width: '150px' }}>
      <input
        type="text"
        value={inputValue}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: '100%' }}
      />
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            border: '1px solid #ccc',
            zIndex: 100,
            width: '100%',
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              style={{
                padding: '4px 8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
              onMouseDown={(e) => e.preventDefault()} // prevent input blur
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 📦 Main Ag-Grid Component
const GridComponent = () => {
  const [rowData, setRowData] = useState([
    { id: 1, name: 'John', status: 'Pending' },
    { id: 2, name: 'Jane', status: 'In Progress' },
    { id: 3, name: 'Alice', status: 'Completed' }
  ]);

  const updateRowValueById = useCallback((idToUpdate, newValues) => {
    setRowData(prevData =>
      prevData.map(row =>
        row.id === idToUpdate ? { ...row, ...newValues } : row
      )
    );
  }, []);

  const columnDefs = useMemo(() => [
    { field: 'id' },
    { field: 'name' },
    {
      field: 'status',
      cellRenderer: (params) => (
        <CustomAutoComplete
          value={params.value}
          data={params.data}
          updateRowValueById={updateRowValueById}
        />
      )
    }
  ], [updateRowValueById]);

  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: 600 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default GridComponent;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GridComponent />);
