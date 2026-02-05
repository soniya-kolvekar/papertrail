import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import Home from "./pages/Home";
import Templates from "./pages/TemplatePage";
import GenerateRouter from "./pages/generators/GenerateRouter";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / Dashboard */}
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<App />} />

        {/* Template Selection */}
        <Route path="/templates" element={<Templates />} />

        {/* Generator Router (caption / letter / etc) */}
        <Route path="/generate/:type" element={<GenerateRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;