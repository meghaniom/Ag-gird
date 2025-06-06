import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const AutocompleteCellEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value || '');
  const [open, setOpen] = useState(true);
  const autocompleteRef = useRef(null);
  const options = props.options || ['Group A', 'Group B', 'Group C', 'Group D'];

  useEffect(() => {
    setTimeout(() => {
      const input = autocompleteRef.current?.querySelector('input');
      if (input) {
        input.focus();
        input.setSelectionRange(0, input.value.length);
      }
    });
  }, []);

  useImperativeHandle(ref, () => ({
    getValue: () => value
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue || '');
    if (newValue !== null) {
      props.api.stopEditing(); // Save and exit editing
    }
  };

  const handleClose = () => {
    props.api.stopEditing(); // Save on close
  };

  return (
    <div 
      ref={autocompleteRef} 
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
      onClick={(e) => e.stopPropagation()}
    >
      <Autocomplete
        options={options}
        value={value}
        onChange={handleChange}
        onClose={handleClose}
        open={open}
        onOpen={() => setOpen(true)}
        disablePortal
        autoHighlight
        autoSelect
        blurOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
            autoFocus
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              style: { padding: 0, height: '100%' },
              onClick:((e) =>e.target.value ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0 !important',
                height: '100%'
              }
            }}
          />
        )}
        sx={{
          width: '100%',
          '& .MuiAutocomplete-inputRoot': {
            padding: '0 !important',
            minHeight: '100%'
          }
        }}
      />
    </div>
  );
});

export default AutocompleteCellEditor;
