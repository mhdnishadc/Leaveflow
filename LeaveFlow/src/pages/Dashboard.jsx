import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Dashboard = () => {
  const leaveSummary = {
    balance: 12,
    pending: 2,
    approved: 8,
  };

  const recentRequests = [
    { type: "Sick Leave", date: "2024-02-10", status: "Approved" },
    { type: "Casual Leave", date: "2024-02-12", status: "Pending" },
    { type: "Annual Leave", date: "2024-02-20", status: "Rejected" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge bg="success">🟢 {status}</Badge>;
      case "Pending":
        return <Badge bg="warning">🟡 {status}</Badge>;
      case "Rejected":
        return <Badge bg="danger">🔴 {status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content" style={{ marginLeft: "250px", width: "100%" }}>
        <Header />
        <Container className="mt-4">
          <Row>
            {/* Summary Cards */}
            <Col md={4}>
              <Card className="shadow p-3">
                <h5>Leave Balance</h5>
                <h2>{leaveSummary.balance} Days</h2>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow p-3">
                <h5>Pending Requests</h5>
                <h2>{leaveSummary.pending}</h2>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow p-3">
                <h5>Approved Leaves</h5>
                <h2>{leaveSummary.approved}</h2>
              </Card>
            </Col>
          </Row>

          {/* Recent Leave Requests Table */}
          <Row className="mt-4">
            <Col>
              <Card className="shadow p-3">
                <h5>Recent Leave Requests</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((req, index) => (
                      <tr key={index}>
                        <td>{req.type}</td>
                        <td>{req.date}</td>
                        <td>{getStatusBadge(req.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
