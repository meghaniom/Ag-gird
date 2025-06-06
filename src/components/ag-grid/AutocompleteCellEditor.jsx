import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteCellEditor = forwardRef((props, ref) => {
  const initialValue = props.value || "";
  const [value, setValue] = useState(initialValue);
  const [options, setOptions] = useState(props.options || []);
  const wrapperRef = useRef();

  useImperativeHandle(ref, () => ({
    getValue: () => value,       // Return selected or typed value
    isPopup: () => true
  }));

  useEffect(() => {
    setTimeout(() => {
      const input = wrapperRef.current?.querySelector("input");
      if (input) {
        input.focus();
        input.select();
      }
    });
  }, []);

  const handleInputChange = (e, newInputValue) => {
    setValue(newInputValue);
    if (!options.includes(newInputValue)) {
      setOptions((prev) => [...prev, newInputValue]);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", height: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <Autocomplete
        freeSolo // ✅ allows free text input
        options={options}
        value={value}
        onInputChange={handleInputChange}
        onChange={(e, newVal) => setValue(newVal || "")}
        autoHighlight
        blurOnSelect
        openOnFocus
        disablePortal
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              style: { padding: 0, height: "100%" }
            }}
            sx={{
              "& .MuiInputBase-input": {
                padding: "0 !important",
                height: "100%"
              }
            }}
          />
        )}
      />
    </div>
  );
});

export default AutocompleteCellEditor;
