import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";

const ApplyLeave = () => {
  // State for form fields
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      leaveType,
      startDate,
      endDate,
      reason,
      file,
    });
    alert("Leave request submitted!");
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="text-center mb-4">Apply for Leave</h3>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded">
            
            {/* Leave Type Dropdown */}
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

            {/* Date Range Picker */}
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

            {/* Reason for Leave */}
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

            {/* File Upload */}
            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label>Attach Document (Optional)</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            {/* Submit Button */}
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
