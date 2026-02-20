import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeDirectory from "./EmployeeDirectory.jsx";
import EmployeeList from "./EmployeeList.jsx";
import EmployeeCreate from "./EmployeeCreate.jsx";
import EmployeeDetail from "./EmployeeDetails.jsx";
import EmployeeEdit from "./EmployeeEdit.jsx";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

class App extends React.Component {
    render() {
        return (
            <div className="app-container">
                <Header />
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<EmployeeDirectory />} />
                        <Route path="/employees" element={<EmployeeList />} />
                        <Route path="/create" element={<EmployeeCreate />} />
                        <Route
                            path="/employee/:id"
                            element={<EmployeeDetail />}
                        />
                        <Route path="/edit/:id" element={<EmployeeEdit />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        );
    }
}
const root = ReactDOM.createRoot(document.getElementById("contents"));
root.render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>
);
