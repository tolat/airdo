import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Pipelines from "./components/views/Pipelines";

// Import Wrapper component
import Wrapper from "./components/general/Wrapper";

function App() {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path="/pipelines" element={<Pipelines />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

export default App;
