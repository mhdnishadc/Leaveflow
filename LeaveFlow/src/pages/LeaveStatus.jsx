import React, { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Spinner } from "react-bootstrap";
import axios from "axios"; // Import Axios for API calls

const LeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("token"); // Get auth token if required
        const response = await axios.get("http://localhost:5000/api/leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveRequests(response.data);
      } catch (err) {
        setError("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle cancel request (for pending requests only)
  const cancelRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/leave/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaveRequests(leaveRequests.map(request =>
        request._id === id ? { ...request, status: "Cancelled" } : request
      ));
    } catch (err) {
      alert("Error canceling leave request");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">My Leave Status</h2>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Leave Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.leaveType}</td>
                <td>{new Date(request.startDate).toISOString().split("T")[0]}</td>
                <td>
                  <Badge
                    bg={
                      request.status === "Approved"
                        ? "success"
                        : request.status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {request.status}
                  </Badge>
                </td>
                <td>
                  {request.status === "Pending" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => cancelRequest(request._id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default LeaveStatus;
