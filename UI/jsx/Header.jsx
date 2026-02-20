// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
    render() {
        return (
            <header className="page-header">
                <div className="logo">
                    <h1>
                        {" "}
                        <Link to="/">MY EMS</Link>
                    </h1>
                </div>
                <div className="search-form">
                    <div className="input-group">
                        <input
                            placeholder="Search here..."
                            type="text"
                            className="form-control"
                        />
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
