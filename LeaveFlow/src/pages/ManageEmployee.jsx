import React, { useState } from "react";
import { Container, Card, Table, Button, Form, Modal } from "react-bootstrap";
import AdminSidebar from "../components/AdminSidebar";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", department: "HR", email: "john@example.com" },
    { id: 2, name: "Jane Smith", department: "Finance", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", department: "Engineering", email: "mike@example.com" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Open Edit Modal
  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
  };

  // Save Edited Employee
  const handleSave = () => {
    setEmployees(employees.map(emp => (emp.id === currentEmployee.id ? currentEmployee : emp)));
    setShowModal(false);
  };

  // Remove Employee
  const handleRemove = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <Container fluid className="mt-4" style={{ marginLeft: "300px" }}>
        <h2 className="mb-4 text-primary">Manage Employees</h2>

        <Card className="shadow-lg">
          <Card.Body>
            <h5 className="mb-3">Employee List</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(emp)}>
                         Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleRemove(emp.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Edit Employee Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentEmployee && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentEmployee.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={currentEmployee.department}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={currentEmployee.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageEmployee;
