import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextState from "./context/contextState";
import Workarea from "./components/Workarea";
import RegisterUser from "./components/RegisterUser";

function App() {
  return (
    <ContextState>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/WorkArea" element={<Workarea />} />
          <Route path="/Register" element={<RegisterUser />} />
        



        </Routes>
      </Router>
    </ContextState>
  );
}

export default App;
