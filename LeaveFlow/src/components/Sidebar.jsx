import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaHome, FaCalendarAlt, FaClipboardList, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";



const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Apply for Leave", icon: <FaCalendarAlt />, path: "/apply-leave" },
    { name: "Status", icon: <FaClipboardList />, path: "/leave-status" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
  ];
   const handleNavigation = (path) =>{
       navigate(path);
   }
   const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="sidebar bg-light vh-100 p-3 position-fixed " style={{ width: "250px" }}>
      <h4 className="text-center">Leave System</h4>
      <ListGroup variant="flush">
        {menuItems.map((item, index) => (
          <ListGroup.Item 
            key={index} 
            action 
            onClick={() => handleNavigation(item.path)}
            className={location.pathname === item.path ? "active text-white" : ""}
          >
            {item.icon} <span className="ms-2">{item.name}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="danger" className="mt-5 w-100" onClick={handleLogout}>
        <FaSignOutAlt /> <span className="ms-2">Logout</span>
      </Button>
    </div>
  );
};

export default Sidebar;
