import React from 'react';

import { PrimeReactProvider } from 'primereact/api';
import About from './about';
// import AutocompleteCellEditor from './MuiAutocompleEditor';

function App() {
  return (

    <div>
     
     {/* <AutocompleteCellEditor/> */}
    
     <PrimeReactProvider>
 <About/>
     </PrimeReactProvider>
    </div>
  );
}

export default App;
