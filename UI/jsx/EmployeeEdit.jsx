import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Create a functional wrapper to access id parameter
const withParams = (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const navigate = useNavigate();
        return (
            <WrappedComponent {...props} params={params} navigate={navigate} />
        );
    };
};

class EmployeeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {
                title: "",
                department: "",
                currentStatus: 1,
            },
            errors: {},
            successMessage: "",
            errorMessage: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchEmployee();
    }

    async fetchEmployee() {
        const { id } = this.props.params; // Access the route parameter here
        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        query {
                            employee(id: "${id}") {
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

            this.setState({ employee: result.data.employee });
        } catch (error) {
            console.error("Error fetching employee:", error);
            this.setState({ errorMessage: error.message });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { id } = this.props.params;

        const updatedData = {
            ...this.state.employee,
        };

        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            updateEmployee(id: "${id}", employeeUpdateInput: {
                                title: "${updatedData.title}",
                                department: "${updatedData.department}",
                                currentStatus: ${updatedData.currentStatus}
                            }) {
                                id
                                title
                                department
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

            this.setState({
                successMessage: "Record updated successfully!",
                errorMessage: "",
            });

            setTimeout(() => {
                this.props.navigate("/employees");
            }, 2000);
        } catch (error) {
            console.error("Error updating employee:", error);
            this.setState({ errorMessage: error.message });
        }
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({
            employee: {
                ...this.state.employee,
                [name]: value,
            },
            errors: {
                ...this.state.errors,
                [name]: "",
            },
        });
    }

    render() {
        const {
            firstName,
            lastName,
            age,
            dateOfJoining,
            title,
            employeeType,
            department,
            currentStatus,
        } = this.state.employee;
        const { errors, successMessage, errorMessage } = this.state;

        return (
            <div className="container-fluid">
                <div className="page-title">
                    <h3>Edit Employee Details</h3>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="card">
                                <div className="card-body">
                                    <form
                                        className="theme-form"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <div className="row">
                                            <div className="mb-3">
                                                <p>
                                                    <strong>First Name:</strong>{" "}
                                                    {firstName}
                                                </p>
                                                <p>
                                                    <strong>Last Name:</strong>{" "}
                                                    {lastName}
                                                </p>
                                                <p>
                                                    <strong>Age:</strong> {age}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Date of Joining:
                                                    </strong>{" "}
                                                    {dateOfJoining}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Employee Type:
                                                    </strong>{" "}
                                                    {employeeType}
                                                </p>
                                            </div>
                                        </div>
                                        {/* edited data */}
                                        <div className="row">
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="title">
                                                        Title
                                                    </label>
                                                    <select
                                                        id="title"
                                                        name="title"
                                                        className={`form-control ${
                                                            errors.title
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={title}
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    >
                                                        <option value="Employee">
                                                            Employee
                                                        </option>
                                                        <option value="Manager">
                                                            Manager
                                                        </option>
                                                        <option value="Director">
                                                            Director
                                                        </option>
                                                        <option value="VP">
                                                            VP
                                                        </option>
                                                    </select>
                                                    {errors.title && (
                                                        <div className="invalid-feedback">
                                                            {errors.title}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="department">
                                                        Department
                                                    </label>
                                                    <select
                                                        id="department"
                                                        name="department"
                                                        className={`form-control ${
                                                            errors.department
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={department}
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    >
                                                        <option value="IT">
                                                            IT
                                                        </option>
                                                        <option value="Marketing">
                                                            Marketing
                                                        </option>
                                                        <option value="HR">
                                                            HR
                                                        </option>
                                                        <option value="Engineering">
                                                            Engineering
                                                        </option>
                                                    </select>
                                                    {errors.department && (
                                                        <div className="invalid-feedback">
                                                            {errors.department}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="currentStatus">
                                                        Current Status
                                                    </label>
                                                    <select
                                                        id="currentStatus"
                                                        name="currentStatus"
                                                        className={`form-control ${
                                                            errors.currentStatus
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={currentStatus}
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    >
                                                        <option value="1">
                                                            Employed
                                                        </option>
                                                        <option value="0">
                                                            Not Employed
                                                        </option>
                                                    </select>
                                                    {errors.currentStatus && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.currentStatus
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Update Employee
                                        </button>
                                    </form>
                                    {successMessage && (
                                        <div className="alert alert-success mt-3">
                                            {successMessage}
                                        </div>
                                    )}
                                    {errorMessage && (
                                        <div className="alert alert-danger mt-3">
                                            {errorMessage}
                                        </div>
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

export default withParams(EmployeeEdit);
