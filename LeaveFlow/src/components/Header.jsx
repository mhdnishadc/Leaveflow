import React from "react";
import { Navbar, Container } from "react-bootstrap";

const Header = ({user}) => {
  // const user = "John Doe"; // Replace with dynamic user data

  return (
    <Navbar bg="primary" variant="dark" className="w-100 p-3">
      <Container>
        <Navbar.Brand>Welcome, {user.name}</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
