import { useEffect, useState } from "react";

// =========================
// BACKEND API URL
// =========================
const API_URL =
  "https://employees-management-system-1-3oal.onrender.com/api/employees";

function App() {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit mode
  const [editId, setEditId] = useState(null);

  // Search and filter
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // =========================
  // GET ALL EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();

      setEmployees(data);
    } catch (error) {
      console.error("GET Error:", error);

      setError(
        "Backend se employees load nahi ho pa rahe hain."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD EMPLOYEES
  // =========================
  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  // =========================
  // ADD / UPDATE EMPLOYEE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const employeeData = {
        ...employee,
        salary: Number(employee.salary),
      };

      // =========================
      // UPDATE
      // =========================
      if (editId !== null) {
        const response = await fetch(
          `${API_URL}/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update employee");
        }

        await response.json();

        setSuccess(
          "Employee updated successfully!"
        );

        setEditId(null);
      }

      // =========================
      // ADD
      // =========================
      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });

        if (!response.ok) {
          throw new Error("Failed to add employee");
        }

        await response.json();

        setSuccess(
          "Employee added successfully!"
        );
      }

      // Clear form
      setEmployee({
        name: "",
        email: "",
        department: "",
        salary: "",
      });

      // Refresh employee list
      await fetchEmployees();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Submit Error:", error);

      setError(
        editId !== null
          ? "Employee update nahi ho paya."
          : "Employee add nahi ho paya."
      );
    }
  };

  // =========================
  // EDIT EMPLOYEE
  // =========================
  const handleEdit = (emp) => {
    setEditId(emp.id);

    setEmployee({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      salary: emp.salary,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditId(null);

    setEmployee({
      name: "",
      email: "",
      department: "",
      salary: "",
    });

    setError("");
    setSuccess("");
  };

  // =========================
  // DELETE EMPLOYEE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setSuccess(
        "Employee deleted successfully!"
      );

      if (editId === id) {
        handleCancelEdit();
      }

      await fetchEmployees();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("DELETE Error:", error);

      setError(
        "Employee delete nahi ho paya."
      );
    }
  };

  // =========================
  // DEPARTMENTS
  // =========================
  const departments = [
    ...new Set(
      employees
        .map((emp) => emp.department)
        .filter(Boolean)
    ),
  ];

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================

  const totalEmployees = employees.length;

  const totalDepartments = departments.length;

  const totalSalary = employees.reduce(
    (total, emp) =>
      total + Number(emp.salary || 0),
    0
  );

  const averageSalary =
    totalEmployees > 0
      ? totalSalary / totalEmployees
      : 0;

  const highestSalary =
    totalEmployees > 0
      ? Math.max(
          ...employees.map((emp) =>
            Number(emp.salary || 0)
          )
        )
      : 0;

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredEmployees = employees.filter(
    (emp) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        emp.name
          .toLowerCase()
          .includes(searchText) ||
        emp.email
          .toLowerCase()
          .includes(searchText) ||
        emp.department
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        departmentFilter === "" ||
        emp.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container">
          <span className="navbar-brand fw-bold">
            👨‍💼 Employee Management System
          </span>
        </div>
      </nav>

      <div className="container py-5">

        {/* =========================
            HEADING
        ========================= */}

        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary">
            Employee Management System
          </h1>

          <p className="text-muted">
            Manage your employees efficiently
          </p>
        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {success && (
          <div className="alert alert-success shadow-sm">
            ✅ {success}
          </div>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="alert alert-danger shadow-sm">
            ❌ {error}
          </div>
        )}

        {/* =========================
            DASHBOARD
        ========================= */}

        <div className="row g-4 mb-5">

          {/* TOTAL EMPLOYEES */}

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="text-muted mb-1">
                      Total Employees
                    </p>

                    <h2 className="fw-bold text-primary mb-0">
                      {totalEmployees}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "25px",
                    }}
                  >
                    👥
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* TOTAL DEPARTMENTS */}

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="text-muted mb-1">
                      Departments
                    </p>

                    <h2 className="fw-bold text-success mb-0">
                      {totalDepartments}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "25px",
                    }}
                  >
                    🏢
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* AVERAGE SALARY */}

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="text-muted mb-1">
                      Average Salary
                    </p>

                    <h2 className="fw-bold text-warning mb-0">
                      ₹
                      {Math.round(
                        averageSalary
                      ).toLocaleString("en-IN")}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "25px",
                    }}
                  >
                    💰
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* HIGHEST SALARY */}

          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="text-muted mb-1">
                      Highest Salary
                    </p>

                    <h2 className="fw-bold text-danger mb-0">
                      ₹
                      {highestSalary.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "25px",
                    }}
                  >
                    💵
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        <div className="card shadow border-0 mb-5">

          <div
            className={
              editId !== null
                ? "card-header bg-warning text-dark"
                : "card-header bg-primary text-white"
            }
          >
            <h4 className="mb-0">
              {editId !== null
                ? "✏️ Edit Employee"
                : "➕ Add Employee"}
            </h4>
          </div>

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* NAME */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter employee name"
                    value={employee.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={employee.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* DEPARTMENT */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="Enter department"
                    value={employee.department}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* SALARY */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Salary
                  </label>

                  <input
                    type="number"
                    name="salary"
                    className="form-control"
                    placeholder="Enter salary"
                    value={employee.salary}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-4 d-flex gap-2">

                <button
                  type="submit"
                  className={
                    editId !== null
                      ? "btn btn-warning px-4"
                      : "btn btn-primary px-4"
                  }
                >
                  {editId !== null
                    ? "🔄 Update Employee"
                    : "➕ Add Employee"}
                </button>

                {editId !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={handleCancelEdit}
                  >
                    ❌ Cancel
                  </button>
                )}

              </div>

            </form>

          </div>
        </div>

        {/* =========================
            EMPLOYEE LIST
        ========================= */}

        <div className="card shadow border-0">

          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

            <h4 className="mb-0">
              👥 Employee List
            </h4>

            <span className="badge bg-primary">
              {employees.length} Employees
            </span>

          </div>

          <div className="card-body">

            {/* SEARCH + FILTER */}

            <div className="row g-3 mb-4">

              <div className="col-md-7">

                <label className="form-label fw-semibold">
                  🔍 Search Employee
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or department..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="col-md-5">

                <label className="form-label fw-semibold">
                  🏢 Filter by Department
                </label>

                <select
                  className="form-select"
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Departments
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* CLEAR FILTER */}

            {(search ||
              departmentFilter) && (
              <button
                className="btn btn-outline-secondary btn-sm mb-4"
                onClick={clearFilters}
              >
                ✖ Clear Filters
              </button>
            )}

            {/* LOADING */}

            {loading && (
              <div className="text-center py-4">

                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

                <p className="mt-2 text-muted">
                  Loading employees...
                </p>

              </div>
            )}

            {/* NO EMPLOYEES */}

            {!loading &&
              !error &&
              employees.length === 0 && (
                <div className="text-center py-5">

                  <h5 className="text-muted">
                    No employees found
                  </h5>

                  <p className="text-muted">
                    Add your first employee above.
                  </p>

                </div>
              )}

            {/* NO SEARCH RESULT */}

            {!loading &&
              employees.length > 0 &&
              filteredEmployees.length ===
                0 && (
                <div className="text-center py-5">

                  <h5 className="text-muted">
                    🔍 No matching employees
                  </h5>

                  <button
                    className="btn btn-outline-primary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            {/* TABLE */}

            {!loading &&
              filteredEmployees.length > 0 && (
                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead className="table-primary">

                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Action</th>
                      </tr>

                    </thead>

                    <tbody>

                      {filteredEmployees.map(
                        (emp) => (

                          <tr key={emp.id}>

                            <td className="fw-bold">
                              #{emp.id}
                            </td>

                            <td>
                              <strong>
                                {emp.name}
                              </strong>
                            </td>

                            <td>
                              {emp.email}
                            </td>

                            <td>
                              <span className="badge bg-secondary">
                                {emp.department}
                              </span>
                            </td>

                            <td className="fw-semibold">
                              ₹
                              {Number(
                                emp.salary
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>

                              <div className="d-flex gap-2">

                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() =>
                                    handleEdit(
                                      emp
                                    )
                                  }
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleDelete(
                                      emp.id
                                    )
                                  }
                                >
                                  🗑️ Delete
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

          </div>
        </div>

      </div>

      {/* FOOTER */}

      <footer className="bg-dark text-white text-center py-3 mt-5">

        <small>
          Employee Management System |
          React + Spring Boot + MySQL
        </small>

      </footer>

    </div>
  );
}

export default App;