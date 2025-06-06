import React from 'react';

import { PrimeReactProvider } from 'primereact/api';
import About from './about';

function App() {
  return (

    <div>
     
    
     <PrimeReactProvider>
 <About/>
     </PrimeReactProvider>
    </div>
  );
}

export default App;
