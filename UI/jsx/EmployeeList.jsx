import React from "react";
import { Link } from "react-router-dom";

class EmployeeList extends React.Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            deleteMessage: "",
            errorMessage: "", // Add error message state
            filteredEmployees: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.filterEmployees = this.filterEmployees.bind(this);
    }

    componentDidMount() {
        this.fetchEmployees();
    }

    async filterEmployees(evt) {
        evt.preventDefault();
        let selectedEmployees;
        const { value } = evt.target;
        const { employees } = this.state;
        if (value === "All") {
            selectedEmployees = employees;
        } else if (value === "UpcomingRetirement") {
            selectedEmployees = employees.filter(e => {
                const date = new Date(e.retirementDate);
                const retirementYear = date.getFullYear();
                const retirementMonth = date.getMonth();
                const retirementDate = date.getDate();

                if(retirementYear === 0 && retirementMonth <= 6) {
                    return e;
                } else{
                    console.log("No retirements in upcoming 6 months");
                    
                }
            })
        } else {
            selectedEmployees = employees.filter(e => {
                return e.employeeType === value;
            });
        }

        this.setState({ filteredEmployees: selectedEmployees, deleteMessage: `${value} List` });
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
                                currentStatus
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

            const employeesWithRetirementDate = result.data.employeeList.map((employee) => {
                const employeeAge = employee.age;
                const date = new Date(employee.dateOfJoining);
                const joiningYear = date.getFullYear();
                const joiningMonth = date.getMonth() + 1;
                const joiningDate = date.getDate() + 1;
                const remainingYears = 65 - employeeAge;
                let retirementDate;
                if (employeeAge < 65) {
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    const currentMonth = today.getMonth() + 1;
                    const currentDate = today.getDate();


                    retirementDate = `${joiningYear + remainingYears}-${joiningMonth}-${joiningDate}`;
                }
                return {
                    ...employee,
                    retirementDate,
                };
            });

            this.setState({ employees: employeesWithRetirementDate, filteredEmployees: employeesWithRetirementDate });
        } catch (error) {
            console.error("Error fetching employees:", error);
            this.setState({ errorMessage: error.message });
        }
    }

    async handleDelete(id, employeeStatus) {
        try {
            if (employeeStatus !== 1) {
                const response = await fetch("http://localhost:4000/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                        mutation {
                            deleteEmployee(id: "${id}") {
                                id
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
                this.setState((prevState) => ({
                    employees: prevState.employees.filter((emp) => emp.id !== id),
                    deleteMessage: "Employee record Deleted!",
                }));
            } else {
                // restricting deleting an active employee
                this.setState({ deleteMessage: "Can't Delete Employee - Status Active!" });
            }

            // Remove success message after few seconds
            setTimeout(() => {
                this.setState({ deleteMessage: "" });
            }, 5000);
        } catch (error) {
            console.error("Error deleting employee:", error);
            this.setState({ errorMessage: error.message });
        }
    }

    render() {
        const { filteredEmployees, deleteMessage, errorMessage } = this.state;
        return (
            <div className="container-fluid">
                <div className="page-title">
                    <h3>Employee List</h3>
                    <div className="form-group">
                        <label htmlFor="employeeType">
                            Employee Type
                        </label>
                        <select
                            id="employeeType"
                            name="employeeType"
                            className="form-control"
                            onChange={this.filterEmployees}
                            defaultValue={"All"}
                        >
                            <option value="All">
                                All Employees
                            </option>
                            <option value="FullTime">
                                FullTime Employees
                            </option>
                            <option value="PartTime">
                                PartTime Employees
                            </option>
                            <option value="Contract">
                                Contract Employees
                            </option>
                            <option value="Seasonal">
                                Seasonal Employees
                            </option>
                            <option value="UpcomingRetirement">
                                Upcoming Retirement
                            </option>
                        </select>
                    </div>
                    {deleteMessage && (
                        <div className="alert alert-success mt-3" role="alert">
                            {deleteMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="card">
                                <div className="card-body">
                                    {filteredEmployees.length === 0 ? (
                                        <div className="no-data-message">
                                            <h3>No employee data found.</h3>
                                        </div>
                                    ) : (
                                        <table className="employee-table table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Age</th>
                                                    <th>Date of Joining</th>
                                                    <th>Title</th>
                                                    <th>Department</th>
                                                    <th>Employee Type</th>
                                                    <th>Current Status</th>
                                                    <th>Retirement In</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.map((employee) => {
                                                    return (
                                                        <tr key={employee.id}>
                                                            <td>
                                                                {employee.firstName}
                                                            </td>
                                                            <td>
                                                                {employee.lastName}
                                                            </td>
                                                            <td>{employee.age}</td>
                                                            <td>
                                                                {employee.dateOfJoining}
                                                            </td>
                                                            <td>
                                                                {employee.title}
                                                            </td>
                                                            <td>
                                                                {employee.department}
                                                            </td>
                                                            <td>
                                                                {employee.employeeType}
                                                            </td>
                                                            <td>
                                                                {employee.currentStatus ===
                                                                    1
                                                                    ? "Employed"
                                                                    : "Not Employed"}
                                                            </td>
                                                            <td>
                                                                {employee.retirementDate}
                                                            </td>
                                                            <td className="actions">
                                                                <Link
                                                                    to={`/employee/${employee.id}`}
                                                                >
                                                                    View Details
                                                                </Link>
                                                                {" | "}
                                                                <Link
                                                                    to={`/edit/${employee.id}`}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>
                                                                {" | "}
                                                                <button
                                                                    onClick={() =>
                                                                        this.handleDelete(
                                                                            employee.id,
                                                                            employee.currentStatus
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmployeeList;
