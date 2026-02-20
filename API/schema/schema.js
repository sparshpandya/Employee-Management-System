const Employee = require("../Model/UserModel");

const typeDefs = `
    type Employee {
        id: ID!
        firstName: String!
        lastName: String!
        age: Int!
        dateOfJoining: String!
        title: String!
        department: String!
        employeeType: String!
        currentStatus: Int!
    }

    input EmployeeInput {
        firstName: String!
        lastName: String!
        age: Int!
        dateOfJoining: String!
        title: String!
        department: String!
        employeeType: String!
        currentStatus: Int
    }

    input EmployeeUpdateInput {
        title: String
        department: String
        currentStatus: Int
    }

    type Query {
        employeeList: [Employee]
        employee(id: ID!): Employee
    }

    type Mutation {
        createEmployee(employeeInput: EmployeeInput): Employee
        updateEmployee(id: ID!, employeeUpdateInput: EmployeeUpdateInput): Employee
        deleteEmployee(id: ID!): Employee
    }
`;

const getEmployeeById = async (_, { id }) => {
    try {
        const employee = await Employee.findById(id);
        return employee;
    } catch (error) {
        console.error("Error fetching employee:", error);
        throw new Error("Error fetching employee");
    }
};

// resolver function to get all employees from database
const getEmployees = async () => {
    try {
        const employees = await Employee.find();
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Error fetching employees");
    }
};

// resolver to add new employee in database
const createEmployee = async (_, { employeeInput }) => {
    try {
        const employee = new Employee({ ...employeeInput });
        await employee.save();
        return employee;
    } catch (error) {
        console.error("Error creating employee:", error);
        throw new Error("Error creating employee");
    }
};

// resolver to update employee in database
const updateEmployee = async (_, { id, employeeUpdateInput }) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            id,
            employeeUpdateInput,
            { new: true }
        );
        return employee;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw new Error("Error updating employee");
    }
};

// resolver to delete employee in database
const deleteEmployee = async (_, { id }) => {
    try {
        const employee = await Employee.findByIdAndDelete(id);
        return employee;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw new Error("Error deleting employee");
    }
};

const resolvers = {
    Query: {
        employeeList: getEmployees,
        employee: getEmployeeById,
    },
    Mutation: {
        createEmployee,
        updateEmployee,
        deleteEmployee,
    },
};

module.exports = {
    typeDefs,
    resolvers,
};
