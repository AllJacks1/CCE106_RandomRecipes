import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch("http://localhost:5000/login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const loginResult = await loginResponse.json();

      if (loginResponse.ok) {
        setMessage(loginResult.message);

        const tokenResponse = await fetch("http://localhost:5000/store-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: loginResult.user.id }),
        });

        if (tokenResponse.ok) {
          setMessage("Login successful!");
          window.location.reload();
        }
      } else {
        setMessage(`Login failed: ${loginResult.error}`);
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
            <h5 className="modal-title" id="loginModalLabel">
              Login
            </h5>
          </div>
          <div className="modal-body">
            <div className="login-content">
              <div className="login-form">
                <form onSubmit={handleLogin}>
                  <div className="login-form-group mb-3">
                    <label htmlFor="email" className="form-label">
                      <IoIosMail /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Please enter your e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="login-form-group mb-3">
                    <label htmlFor="password" className="form-label">
                      <IoMdLock /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Please enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="login-form-group form-button">
                    <button type="submit" className="btn btn-primary w-100">
                      Login
                    </button>
                  </div>
                </form>
                {message && <p className="mt-2 text-danger">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
