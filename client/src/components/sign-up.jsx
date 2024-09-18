import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import { MdOutlineLock } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/sign-up-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="signUpModalLabel">
              Sign Up
            </h5>
          </div>
          <div className="modal-body">
            <div className="signup-content">
              <div className="signup-form">
                <form onSubmit={handleSignUp}>
                  <div className="signup-form-group mb-3">
                    <label htmlFor="name" className="form-label">
                      <FaUser /> Fullname
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder="Please enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-form-group mb-3">
                    <label htmlFor="email" className="form-label">
                      <IoIosMail /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Please enter your e-mail"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-form-group mb-3">
                    <label htmlFor="password" className="form-label">
                      <IoMdLock /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Please enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-form-group mb-3">
                    <label htmlFor="confirm-password" className="form-label">
                      <MdOutlineLock /> Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirm-password"
                      className="form-control"
                      placeholder="Please confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-form-group mb-3 d-flex justify-content-center">
                    <input
                      type="checkbox"
                      name="agree-term"
                      id="agree-term"
                      className="form-check-input me-2"
                      required
                    />
                    <label htmlFor="agree-term" className="form-check-label">
                      I agree to all statements in{" "}
                      <a href="#" className="term-service">
                        Terms of service
                      </a>
                    </label>
                  </div>
                  <div className="signup-form-group mb-3">
                    <input
                      type="submit"
                      name="signup"
                      id="signup"
                      className="btn btn-primary w-100"
                      value="Register"
                    />
                  </div>
                </form>
                {message && <p className="text-danger">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
