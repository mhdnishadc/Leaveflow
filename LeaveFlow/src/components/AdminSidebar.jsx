import React from "react";
import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

const AdminSidebar = () => {
  return (
    <div className="sidebar bg-light p-3" style={{ width: "300px", height: "100vh", position: "fixed" }}>
      <h4 className="text-primary">Admin Panel</h4>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Link to="/admin-dashboard" className="text-decoration-none">Dashboard</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to="/admin/manage-employee" className="text-decoration-none">Manage Employees</Link>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default AdminSidebar;
