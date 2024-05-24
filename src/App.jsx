import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlowPage from "./pages/FlowPage/FlowPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route element={<PrivateRoutes />}>
          <Route path="/" element={<RootPage />} />
        </Route> */}
        <Route path="/" element={<FlowPage />} />
      </Routes>
    </Router>
  )
}

export default App
