import React, { useEffect, useState } from "react";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const gujaratiEmployees = [
    { name: "Drashti Patel", email: "drashti.patel@gmail.com" },
    { name: "Maharshi Patel", email: "maharshi.patel@gmail.com" },
    { name: "Riyon Soni", email: "riyon.soni@gmail.com" },
    { name: "Bhumi Chaudhary", email: "bhumi.chaudhary@gmail.com" },
    { name: "Trisha Trivedi", email: "trisha.trivedi@gmail.com" },
    { name: "Tisha Patel", email: "tisha.patel@gmail.com" },
    { name: "Dhavni Padeliya", email: "dhavni.padeliya@gmail.com" },
    { name: "Mahik Patel", email: "mahik.patel@gmail.com" },
    { name: "Mansi Patel", email: "mansi.patel@gmail.com" },
    { name: "Bhavy Rathod", email: "bhavy.rathod@gmail.com" },
  ];

  // READ: Fetch data from API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then((data) => {
        const formattedEmployees = data.map((employee, index) => ({
          id: employee.id,
          name: gujaratiEmployees[index % gujaratiEmployees.length].name,
          email: gujaratiEmployees[index % gujaratiEmployees.length].email,
          department: ["IT", "HR", "Finance", "Marketing"][index % 4],
          salary: 25000 + index * 3000,
        }));

        setEmployees(formattedEmployees);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load employees. Please check your internet.");
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // CREATE and UPDATE
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department ||
      !formData.salary
    ) {
      alert("Please fill all fields!");
      return;
    }

    if (Number(formData.salary) <= 0) {
      alert("Salary must be greater than zero!");
      return;
    }

    if (editingId !== null) {
      setEmployees((previousEmployees) =>
        previousEmployees.map((employee) =>
          employee.id === editingId
            ? {
                ...employee,
                ...formData,
                salary: Number(formData.salary),
              }
            : employee
        )
      );

      alert("Employee updated successfully!");
    } else {
      const newEmployee = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department,
        salary: Number(formData.salary),
      };

      setEmployees((previousEmployees) => [
        ...previousEmployees,
        newEmployee,
      ]);

      alert("Employee added successfully!");
    }

    resetForm();
  };

  // EDIT employee
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary),
    });

    setEditingId(employee.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE employee
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((previousEmployees) =>
        previousEmployees.filter((employee) => employee.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      salary: "",
    });

    setEditingId(null);
  };

  return (
    <div className="employee-app">
      <header className="header">
        <h1>Employee Management System</h1>
        <p>Manage your employees in one place</p>
      </header>

      <div className="stats">
        <div className="stat-card">
          <span>Total Employees</span>
          <h2>{employees.length}</h2>
        </div>

        <div className="stat-card">
          <span>Departments</span>
          <h2>
            {
              new Set(
                employees.map((employee) => employee.department)
              ).size
            }
          </h2>
        </div>
      </div>

      {/* Employee Form */}
      <section className="form-card">
        <h2>
          {editingId !== null ? "Update Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Employee Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter employee name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="input-group">
              <label>Monthly Salary (₹)</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                min="1"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="primary-btn">
              {editingId !== null ? "Update Employee" : "Add Employee"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Employee List */}
      <section className="table-card">
        <div className="table-heading">
          <h2>Employee Records</h2>
          <span>{employees.length} employees</span>
        </div>

        {loading ? (
          <p className="message">Loading employees...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : employees.length === 0 ? (
          <p className="message">No employees found. Add an employee!</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td className="employee-name">{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>
                      <span className="department-badge">
                        {employee.department}
                      </span>
                    </td>
                    <td>
                      ₹{Number(employee.salary).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        <p>React Practical 20 | Complete CRUD Application</p>
      </footer>
    </div>
  );
}

export default EmployeeManagement;