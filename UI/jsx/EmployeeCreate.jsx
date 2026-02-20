import React from "react";

class EmployeeCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            age: 20,
            dateOfJoining: "",
            title: "Employee",
            department: "IT",
            employeeType: "FullTime",
            currentStatus: 1,
            errors: {},
            successMessage: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            errors: {
                ...this.state.errors,
                [name]: "",
            },
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            console.log("Form is not valid");
            return;
        }

        const newEmployeeData = {
            ...this.state
        };
        console.log(newEmployeeData.currentStatus);
        delete newEmployeeData.errors;

        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            createEmployee(employeeInput: {
                                firstName: "${newEmployeeData.firstName}",
                                lastName: "${newEmployeeData.lastName}",
                                age: ${newEmployeeData.age},
                                dateOfJoining: "${newEmployeeData.dateOfJoining}",
                                title: "${newEmployeeData.title}",
                                department: "${newEmployeeData.department}",
                                employeeType: "${newEmployeeData.employeeType}",
                                currentStatus: ${newEmployeeData.currentStatus}
                            }) {
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

            this.setState({
                firstName: "",
                lastName: "",
                age: 20,
                dateOfJoining: "",
                title: "Employee",
                department: "IT",
                employeeType: "FullTime",
                currentStatus: 1,
                errors: {},
                successMessage: "Employee record added successfully!",
            });
            // Remove success message after 5 seconds
            setTimeout(() => {
                this.setState({ successMessage: "" });
            }, 5000);
        } catch (error) {
            console.error("Error creating employee:", error);
            this.setState({
                successMessage: `Error creating employee: ${error.message}`,
            });
        }
    }

    validateForm() {
        const { firstName, lastName, age, dateOfJoining } = this.state;
        const errors = {};

        // Regex Patterns
        const nameRegex = /^[a-zA-Z]+$/;

        // First Name Validation
        if (!firstName.trim()) {
            errors.firstName = "First Name is required";
        } else if (!nameRegex.test(firstName)) {
            errors.firstName = "First Name must contain only letters";
        }

        // Last Name Validation
        if (!lastName.trim()) {
            errors.lastName = "Last Name is required";
        } else if (!nameRegex.test(lastName)) {
            errors.lastName = "Last Name must contain only letters";
        }

        // Age Validation
        if (!age) {
            errors.age = "Age is required";
        } else if (age < 20 || age > 70) {
            errors.age = "Age must be between 20 and 70";
        }

        // Date of Joining Validation
        if (!dateOfJoining) {
            errors.dateOfJoining = "Date of Joining is required";
        } else {
            const currentDate = new Date().setHours(0, 0, 0, 0);
            const selectedDate = new Date(dateOfJoining).setHours(0, 0, 0, 0);
            if (selectedDate <= currentDate) {
                errors.dateOfJoining =
                    "Date of Joining must be after today's date";
            } else if (!this.isValidDate(dateOfJoining)) {
                errors.dateOfJoining = "Date of Joining must be a valid date";
            }
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    render() {
        const { errors } = this.state;
        console.log(this.state.currentStatus);

        return (
            <div className="container-fluid">
                <div className="page-title">
                    <h3>Create Employee</h3>
                    {this.state.successMessage && (
                        <div className="alert alert-success mt-3" role="alert">
                            {this.state.successMessage}
                        </div>
                    )}
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
                                                <div className="form-group">
                                                    <label htmlFor="firstName">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        className={`form-control ${
                                                            errors.firstName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={
                                                            this.state.firstName
                                                        }
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    />
                                                    {errors.firstName && (
                                                        <div className="invalid-feedback">
                                                            {errors.firstName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="lastName">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="lastName"
                                                        name="lastName"
                                                        className={`form-control ${
                                                            errors.lastName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={
                                                            this.state.lastName
                                                        }
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    />
                                                    {errors.lastName && (
                                                        <div className="invalid-feedback">
                                                            {errors.lastName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="age">
                                                        Age
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="age"
                                                        name="age"
                                                        className={`form-control ${
                                                            errors.age
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={this.state.age}
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    />
                                                    {errors.age && (
                                                        <div className="invalid-feedback">
                                                            {errors.age}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="dateOfJoining">
                                                        Date of Joining
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="dateOfJoining"
                                                        name="dateOfJoining"
                                                        className={`form-control ${
                                                            errors.dateOfJoining
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        value={
                                                            this.state
                                                                .dateOfJoining
                                                        }
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    />
                                                    {errors.dateOfJoining && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dateOfJoining
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="title">
                                                        Title
                                                    </label>
                                                    <select
                                                        id="title"
                                                        name="title"
                                                        className="form-control"
                                                        value={this.state.title}
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
                                                        className="form-control"
                                                        value={
                                                            this.state
                                                                .department
                                                        }
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
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="employeeType">
                                                        Employee Type
                                                    </label>
                                                    <select
                                                        id="employeeType"
                                                        name="employeeType"
                                                        className="form-control"
                                                        value={
                                                            this.state
                                                                .employeeType
                                                        }
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                    >
                                                        <option value="FullTime">
                                                            FullTime
                                                        </option>
                                                        <option value="PartTime">
                                                            PartTime
                                                        </option>
                                                        <option value="Contract">
                                                            Contract
                                                        </option>
                                                        <option value="Seasonal">
                                                            Seasonal
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="form-group">
                                                    <label htmlFor="currentStatus">
                                                        Current Status
                                                    </label>
                                                    <select
                                                        id="currentStatus"
                                                        name="currentStatus"
                                                        className="form-control"
                                                        value={
                                                            this.state
                                                                .currentStatus
                                                        }
                                                        onChange={
                                                            this
                                                                .handleInputChange
                                                        }
                                                        
                                                    >
                                                        <option value={1}>
                                                            Employed
                                                        </option>
                                                        <option value={0}>
                                                            Not Employed
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                >
                                                    Create Employee
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmployeeCreate;
