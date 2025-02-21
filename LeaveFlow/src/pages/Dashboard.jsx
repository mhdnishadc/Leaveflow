import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/auth/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error fetching user data:", error);
        
      }
    };

    fetchUserData();
  }, [navigate]);

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
      <Header user={user} />
        <Container className="mt-4">
          <Row>
            <Col md={4}><Card className="shadow p-3"><h5>Leave Balance</h5><h2>{user.leaveBalance} Days</h2></Card></Col>
            <Col md={4}><Card className="shadow p-3"><h5>Pending Requests</h5><h2>{user.pendingRequests}</h2></Card></Col>
            <Col md={4}><Card className="shadow p-3"><h5>Approved Leaves</h5><h2>{user.approvedLeaves}</h2></Card></Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Card className="shadow p-3">
                <h5>Recent Leave Requests</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr><th>Leave Type</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {user.recentRequests?.map((req, index) => (
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