import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, provider, signInWithPopup } from "../Firebase"; // Ensure this import is correct
import { FcGoogle } from "react-icons/fc"; // Import Google icon


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  // Handle Google Authentication Response
  const handleGooglelogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google User:", user);

      // Send user data to backend
      const res = await axios.post("http://localhost:5000/api/auth/firebase-login", {
        name: user.displayName,
        email: user.email,
        firebaseId: user.uid,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google Sign-In Failed", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px" }} className="p-4 shadow">
        <h3 className="text-center">Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Login
          </Button>
        </Form>

        {/* Google Login Button */}
        <div className="text-center mt-3 ms-5">
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleGooglelogin}>
            <FcGoogle size={20} /> Sign in with Google
          </button>
        </div>

        <p className="mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;  