import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import AdminSidebar from "../components/AdminSidebar";



const AdminDashboard = () => {
  const stats = { totalEmployees: 120, pendingRequests: 5, approvedLeaves: 30, rejectedLeaves: 10 };
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "Alice", type: "Casual", date: "2025-02-10", status: "Pending" },
    { id: 2, name: "Bob", type: "Sick", date: "2025-02-12", status: "Pending" },
    { id: 3, name: "Charlie", type: "Maternity", date: "2025-01-20", status: "Approved" },
    { id: 4, name: "David", type: "Casual", date: "2025-01-25", status: "Rejected" },
  ]);

  const handleAction = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)));
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <Container fluid className="mt-4" style={{ marginLeft: "300px" }}>
        <h2 className="mb-4 text-primary">Admin Dashboard</h2>
        
        {/* Overview Section */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-lg text-center p-3">
              <h5>Total Employees</h5>
              <h3>{stats.totalEmployees}</h3>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-lg text-center p-3">
              <h5>Pending Requests</h5>
              <h3 className="text-warning">{stats.pendingRequests}</h3>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-lg text-center p-3">
              <h5>Approved Leaves</h5>
              <h3 className="text-success">{stats.approvedLeaves}</h3>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-lg text-center p-3">
              <h5>Rejected Leaves</h5>
              <h3 className="text-danger">{stats.rejectedLeaves}</h3>
            </Card>
          </Col>
        </Row>

        {/* Recent Leave Requests Table */}
        <Card className="shadow-lg">
          <Card.Body>
            <h5 className="mb-3">Recent Leave Requests</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.name}</td>
                    <td>{request.type}</td>
                    <td>{request.date}</td>
                    <td>
                      <span className={`badge bg-${request.status === "Approved" ? "success" : request.status === "Pending" ? "warning" : "danger"}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === "Pending" && (
                        <>
                          <Button variant="success" size="sm" className="me-2" onClick={() => handleAction(request.id, "Approved")}>
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleAction(request.id, "Rejected")}>
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminDashboard;

