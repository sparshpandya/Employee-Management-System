import React from "react";

class EmployeeDirectory extends React.Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            error: null, // Add error state
        };
    }

    componentDidMount() {
        this.fetchEmployees();
    }

    async fetchEmployees() {
        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        query {
                            employeeList {
                                id
                                firstName
                                lastName
                                age
                                dateOfJoining
                                title
                                department
                                employeeType
                            }
                        }
                    `,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.errors) {
                throw new Error(
                    `GraphQL error: ${result.errors
                        .map((error) => error.message)
                        .join(", ")}`
                );
            }

            this.setState({ employees: result.data.employeeList });
        } catch (error) {
            console.error("Error fetching employees:", error);
            this.setState({ error: error.message });
        }
    }

    render() {
        const { employees, error } = this.state;
        // Filter full-time employees
        const fullTimeEmployees = employees.filter(
            (employee) => employee.employeeType === "FullTime"
        );
        // Filter part-time employees
        const partTimeEmployees = employees.filter(
            (employee) => employee.employeeType === "PartTime"
        );
        // Filter seasonal employees
        const seasonalEmployees = employees.filter(
            (employee) => employee.employeeType === "Seasonal"
        );
        // Filter contract employees
        const contractEmployees = employees.filter(
            (employee) => employee.employeeType === "Contract"
        );

        return (
            <div className="dashboard">
                <div className="page-title ">
                    <h3>Welcome to the Employee Management System</h3>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Total Employees</h4>
                                    <span>{employees.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Full time Employees</h4>
                                    <span>{fullTimeEmployees.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Part Time Employees</h4>
                                    <span>{partTimeEmployees.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Seasonal Employees</h4>
                                    <span>{seasonalEmployees.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Contract Employees</h4>
                                    <span>{contractEmployees.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmployeeDirectory;
