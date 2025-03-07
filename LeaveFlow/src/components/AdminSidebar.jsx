import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear authentication token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="sidebar bg-light p-3 d-flex flex-column" style={{ width: "300px", height: "100vh", position: "fixed" }}>
      <h4 className="text-primary">Admin Panel</h4>

      <ListGroup variant="flush" className="flex-grow-1">
        <ListGroup.Item>
          <Link to="/admin-dashboard" className="text-decoration-none">Dashboard</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to="/admin/manage-employee" className="text-decoration-none">Manage Employees</Link>
        </ListGroup.Item>
      </ListGroup>

      <Button variant="danger" className="mt-3 w-100" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default AdminSidebar;

