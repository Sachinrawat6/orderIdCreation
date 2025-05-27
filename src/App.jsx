import React from 'react';
import UploadAndSyncWithOrderId from './components/UploadAndSyncWithOrderId';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import Tags from './components/Tags';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UploadAndSyncWithOrderId/>}/>
      <Route path="/tags" element={<Tags/>}/>
      
    </Routes>
    
    </BrowserRouter>
      
    
  );
}

export default App;
