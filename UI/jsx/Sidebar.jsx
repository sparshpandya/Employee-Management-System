import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="page-sidebar">
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/employees">View Employees</Link>
                </li>
                <li>
                    <Link to="/create">Add Employee</Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
