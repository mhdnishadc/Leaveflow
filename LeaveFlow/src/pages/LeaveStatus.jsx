import React, { useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";

const LeaveStatus = () => {
  // Sample Leave Requests Data
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: "Casual Leave", date: "2025-02-15", status: "Approved" },
    { id: 2, type: "Sick Leave", date: "2025-02-18", status: "Pending" },
    { id: 3, type: "Maternity Leave", date: "2025-03-01", status: "Rejected" }
  ]);

  // Handle cancel request (for pending requests only)
  const cancelRequest = (id) => {
    setLeaveRequests(leaveRequests.map(request =>
      request.id === id ? { ...request, status: "Cancelled" } : request
    ));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">My Leave Status</h2>
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
            <tr key={request.id}>
              <td>{request.type}</td>
              <td>{request.date}</td>
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
                    onClick={() => cancelRequest(request.id)}
                  >
                    Cancel Request
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LeaveStatus;
