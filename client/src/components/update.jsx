import React, { useState, useEffect } from "react";
import { checkUser } from "../functions/checkUser";
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import { MdOutlineLock } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateUserInfo = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const tokenResult = await checkUser();
      if (tokenResult) {
        setToken(tokenResult);
      }
    };

    fetchToken();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update-user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: token,
          email: email,
          password: password,
          fullname: name,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Information updated successfully.");
        setError("");
      } else {
        setError(result.error || "Failed to update information.");
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while updating user information.");
      setMessage("");
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="updateModalLabel">
            Update User Information
          </h5>
        </div>
        <div className="modal-body">
          <div className="updateUser-content">
            <div className="updateUser-form">
              <form onSubmit={handleSubmit}>
                <div className="updateUser-form-group mb-3">
                  <label htmlFor="name" className="form-label">
                    <FaUser /> Fullname
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Please enter your name"
                    value={name}
                    onChange={setName}
                    required
                  />
                </div>
                <div className="updateUser-form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    <IoIosMail /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Please enter your e-mail"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                </div>
                <div className="updateUser-form-group mb-3">
                  <label htmlFor="password" className="form-label">
                    <IoMdLock /> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Please enter your password"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                </div>
                <div className="updateUser-form-group mb-3">
                  <label htmlFor="confirm-password" className="form-label">
                    <MdOutlineLock /> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirm-password"
                    className="form-control"
                    placeholder="Please confirm your password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    required
                  />
                </div>
                <div className="updateUser-form-group mb-3">
                  <input
                    type="submit"
                    name="update"
                    id="update"
                    className="btn btn-primary w-100"
                    value="Update"
                  />
                </div>
              </form>
              {message && <p className="mt-2 text-success">{message}</p>}
              {error && <p className="mt-2 text-danger">{error}</p>}
            </div>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-center">
          <p className="mb-0">
            Don't have an Account?{" "}
            <a href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">
              Create an account.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
