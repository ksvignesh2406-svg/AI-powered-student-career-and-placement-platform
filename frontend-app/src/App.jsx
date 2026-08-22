import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentPage from "./pages/StudentPage";
import ParentPage from "./pages/ParentPage";
import FacultyPage from "./pages/FacultyPage";
import AdminPage from "./pages/AdminPage";
import SecurityPage from "./pages/SecurityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/parent" element={<ParentPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;