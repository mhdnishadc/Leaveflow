import React, { useState } from "react";
import { Container, Card, Row, Col, ProgressBar, Form, Button } from "react-bootstrap";

const Profile = () => {
  // Sample User Data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    department: "Software Engineering",
    leaveBalance: 10, // Total leave balance
    leaveUsed: 4, // Leave used
  };

  // State for profile picture
  const [profileImage, setProfileImage] = useState(null);

  // State for password change
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change for password fields
  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handle form submit for password update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
    } else {
      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Profile</h2>
      <Row>
        {/* User Info Card */}
        <Col md={4}>
          <Card className="shadow-lg text-center p-3">
            <div className="profile-image-container">
              {/* Display Profile Image or Default */}
              <img
                src={profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle border border-2"
                width="150"
                height="150"
              />
            </div>
            <Card.Body>
              <h4>{user.name}</h4>
              <p className="text-muted">{user.email}</p>
              <p><strong>Department:</strong> {user.department}</p>

              {/* Upload Profile Picture */}
              <Form.Group className="mt-3">
                <Form.Label className="btn btn-outline-primary">
                  Upload Profile Picture
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Form.Label>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Leave Balance Section & Password Change */}
        <Col md={8}>
          <Card className="shadow-lg mb-4">
            <Card.Body>
              <h5>Leave Balance</h5>
              <ProgressBar
                now={(user.leaveUsed / user.leaveBalance) * 100}
                label={`${user.leaveUsed} / ${user.leaveBalance} Days Used`}
                variant="info"
                className="mt-2"
              />
            </Card.Body>
          </Card>

          {/* Change Password Form */}
          <Card className="shadow-lg">
            <Card.Body>
              <h5>Change Password</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

