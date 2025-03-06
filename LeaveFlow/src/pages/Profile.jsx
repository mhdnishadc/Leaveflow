import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, ProgressBar, Form, Button, Alert } from "react-bootstrap";
import axios from "axios"; // Make sure to import axios

const Profile = () => {
  // State for user data (this will be fetched from API)
  const [user, setUser] = useState({});

  // State for profile picture
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [department, setDepartment] = useState("");

  // State for password change
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    axios
      .get("http://localhost:5000/api/auth/upload-profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        setDepartment(response.data.department || ""); // Set department state

        // If profileImage exists, set it for display
        if (response.data.profileImage) {
          setPreviewImage(response.data.profileImage);
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }
}, []);



  // Handle profile image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload to server
  const uploadProfileImage = async () => {
    if (!profileImage) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setUploadError("You must be logged in to upload an image");
      setUploading(false);
      return;
    }

    // Create form data for the file upload
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/upload-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUploadSuccess("Profile image uploaded successfully!");
      setUser({ ...user, profileImage: response.data.profileImage });
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
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
  const handleDepartmentUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-department",
        { department },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setUser({ ...user, department });
      setDepartment("");
    } catch (error) {
      console.error("Error updating department:", error);
      alert(error.response?.data?.error || "Failed to update department");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Profile</h2>

      {uploadError && <Alert variant="danger">{uploadError}</Alert>}
      {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}

      <Row>
        {/* User Info Card */}
        <Col md={4}>
          <Card className="shadow-lg text-center p-3">
            <div className="profile-image-container">
              {/* Display Profile Image or Default */}
              <img
                src={previewImage || "https://via.placeholder.com/150"}
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
                  Select Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Form.Label>
              </Form.Group>

              {profileImage && (
                <Button
                  variant="success"
                  className="mt-2 w-100"
                  onClick={uploadProfileImage}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Profile Picture"}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Leave Balance Section & Password Change */}
        <Col md={8}>
          {/* <Card className="shadow-lg mb-4">
            <Card.Body>
              <h5>Leave Balance</h5>
              <ProgressBar
                now={(user.
                  leaveBalance / user.leaveBalance) * 100}
                label={`${user.
                  leaveBalance} / ${user.leaveBalance} Days Used`}
                variant="info"
                className="mt-2"
              />
            </Card.Body>
          </Card> */}

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

                {/* Department Section */}
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="info" className="w-100" onClick={handleDepartmentUpdate}>
                  Update Department
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