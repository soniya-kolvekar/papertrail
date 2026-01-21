import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./index.css";
import Home from "./pages/Home";

const CaptionGenerator = lazy(() => import("./pages/CaptionGenerator"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/captions"
          element={
            <Suspense fallback={<div className="p-10 text-center">Loading Generator...</div>}>
              <CaptionGenerator />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
