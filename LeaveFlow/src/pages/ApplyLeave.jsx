import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Install this package: npm install jwt-decode

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to apply for leave.");
      return;
    }
  
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
  
    // ✅ Convert dates to the correct format
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
  
    // ✅ JSON request body
    const requestBody = {
      userId: userId,
      leaveType: leaveType,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      reason: reason,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/leave/apply", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 201) {
        alert("Leave request submitted successfully!");
        setLeaveType("");
        setStartDate(null);
        setEndDate(null);
        setReason("");
        setFile(null);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };
  
  
  

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="text-center mb-4">Apply for Leave</h3>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded">
            
            <Form.Group controlId="leaveType" className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                <option value="">Select Leave Type</option>
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Maternity">Maternity Leave</option>
                <option value="Paternity">Paternity Leave</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="reason" className="mb-3">
              <Form.Label>Reason for Leave</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label>Attach Document (Optional)</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit Leave Request
            </Button>

          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplyLeave;
