import React, { Component } from "react";
import { useParams } from "react-router-dom";

const withParams = (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        return <WrappedComponent {...props} params={params} />;
    };
};

class EmployeeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: null,
            errorMessage: "",
        };
        this.showRetirementTime = this.showRetirementTime.bind(this);
    }

    componentDidMount() {
        this.fetchEmployee();
    }

    fetchEmployee = async () => {
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

            const retirementTime = await this.showRetirementTime();
            const employeeData = {
                ...result.data.employee,
                retirementTime: retirementTime
            }
            this.setState({ employee: employeeData, errorMessage: "" });
        } catch (error) {
            console.error("Error fetching employee:", error);
            this.setState({ errorMessage: error.message });
        }
    };

    async showRetirementTime() {
        try {
            const { employee } = this.state;
            console.log(employee);
            
            if (employee) {
                let retirementDate;
                const employeeAge = employee.age;
                const dateOfJoining = employee.dateOfJoining;

                const date = new Date(dateOfJoining);
                const joiningYear = date.getFullYear();
                const joiningMonth = date.getMonth() + 1;
                const joiningDate = date.getDate() + 1;
                // const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                const remainingYears = 65 - employeeAge;
                if (employeeAge < 65) {
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    const currentMonth = today.getMonth() + 1;
                    const currentDate = today.getDate();

                    const dateRetirement = new Date(remainingYears, currentMonth + joiningMonth, joiningDate);
                    // console.log(dateRetirement);
                    retirementDate = `${remainingYears} Year(s), ${joiningMonth - currentMonth} Month(s) & ${Math.max(0, joiningDate - currentDate)} Day(s)`;
                    return retirementDate;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        const { employee, errorMessage } = this.state;

        if (errorMessage) {
            return <div>Error: {errorMessage}</div>;
        }

        if (!employee) {
            return <div>Loading...</div>;
        }

        return (
            <div className="container-fluid">
                <div className="page-title">
                    <h3>Employee Details</h3>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="card">
                                <div className="card-body">
                                    <div className="employee-details">
                                        <p>
                                            <strong>First Name:</strong>{" "}
                                            {employee.firstName}
                                        </p>
                                        <p>
                                            <strong>Last Name:</strong>{" "}
                                            {employee.lastName}
                                        </p>
                                        <p>
                                            <strong>Age:</strong> {employee.age}
                                        </p>
                                        <p>
                                            <strong>Date of Joining:</strong>{" "}
                                            {employee.dateOfJoining}
                                        </p>
                                        <p>
                                            <strong>Title:</strong>{" "}
                                            {employee.title}
                                        </p>
                                        <p>
                                            <strong>Department:</strong>{" "}
                                            {employee.department}
                                        </p>
                                        <p>
                                            <strong>Employee Type:</strong>{" "}
                                            {employee.employeeType}
                                        </p>
                                        <p>
                                            <strong>Current Status:</strong>{" "}
                                            {employee.currentStatus === 1
                                                ? "Employed"
                                                : "Not Employed"}
                                        </p>
                                        <p>
                                            <strong>Retirement In:</strong>{" "}
                                            {employee.retirementTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withParams(EmployeeDetail);
