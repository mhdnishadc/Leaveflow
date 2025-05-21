import React, { useState, useEffect } from "react";
import { Container, Card, Table, Button, Form, Modal } from "react-bootstrap";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";

const API_URL = "http://localhost:5000/api/employees"; // Backend URL

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ name: "", department: "", email: "" });

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token"); // Ensure token is stored in localStorage
  
      if (!token) {
        console.error("❌ No token found in request headers.");
        return;
      }
  
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees", error.response?.data || error);
      }
    };
  
    fetchEmployees();
  }, []);
  

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
  const handleSave = async () => {
    try {
      if (currentEmployee._id) {
        await axios.put(`${API_URL}/${currentEmployee._id}`, currentEmployee);
        setEmployees(employees.map(emp => (emp._id === currentEmployee._id ? currentEmployee : emp)));
      } else {
        const res = await axios.post(API_URL, currentEmployee);
        setEmployees([...employees, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving employee", err);
    }
  };
  
  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id)); 
    } catch (err) {
      console.error("Error removing employee", err);
    }
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
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(emp)}>
                         Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleRemove(emp._id)}>
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
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={currentEmployee.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" name="department" value={currentEmployee.department} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={currentEmployee.email} onChange={handleChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="success" onClick={handleSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageEmployee;
