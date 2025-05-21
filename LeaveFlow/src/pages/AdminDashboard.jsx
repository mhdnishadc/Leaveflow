import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, pendingRequests: 0, approvedLeaves: 0, rejectedLeaves: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/admin/leave-requests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLeaveRequests(response.data);

          // Compute stats dynamically
          const totalEmployees = response.data.length;
          const pendingRequests = response.data.filter((req) => req.status === "Pending").length;
          const approvedLeaves = response.data.filter((req) => req.status === "Approved").length;
          const rejectedLeaves = response.data.filter((req) => req.status === "Rejected").length;

          setStats({ totalEmployees, pendingRequests, approvedLeaves, rejectedLeaves });
        })
        .catch((error) => console.error("Error fetching leave requests:", error));
    }
  }, []);

  // const handleAction = (id, newStatus) => {
  //   const token = localStorage.getItem("token");

  //   axios
  //     .put(
  //       `http://localhost:5000/api/admin/leave-requests/${id}`,
  //       { status: newStatus },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     .then((response) => {
  //       setLeaveRequests(leaveRequests.map((req) => (req.id === id ? response.data : req)));
  //     })
  //     .catch((error) => console.error("Error updating leave request:", error));
  // };
  const handleAction = (id, newStatus) => {
    const token = localStorage.getItem("token");
  
    axios
      .put(
        `http://localhost:5000/api/admin/leave-requests/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
  
        // Update the stats dynamically
        setStats((prevStats) => {
          return {
            ...prevStats,
            pendingRequests: prevStats.pendingRequests - 1,
            approvedLeaves: newStatus === "Approved" ? prevStats.approvedLeaves + 1 : prevStats.approvedLeaves,
            rejectedLeaves: newStatus === "Rejected" ? prevStats.rejectedLeaves + 1 : prevStats.rejectedLeaves,
          };
        });
      })
      .catch((error) => console.error("Error updating leave request:", error));
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
                  <tr key={request._id}>
                    <td>{request.userId?.name || "Unknown"}</td>
                    <td>{request.
                      leaveType}</td>
                    <td>{new Date(request.
                      startDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${request.status === "Approved" ? "success" : request.status === "Pending" ? "warning" : "danger"}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === "Pending" && (
                        <>
                          <Button variant="success" size="sm" className="me-2" onClick={() => handleAction(request._id, "Approved")}>
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleAction(request._id, "Rejected")}>
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
