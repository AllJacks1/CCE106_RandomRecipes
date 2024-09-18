import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../res/style/style.scss";
import user from "../res/images/user.png";
import { FaHeart } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { checkUser } from "../functions/checkUser";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Modal from "react-modal";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import UpdateUserInfo from "./update";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");
const NavBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("USER");
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [updateAccModalIsOpen, setUpdateAccModalIsOpen] = useState(false);

  useEffect(() => {
    changeName();
  }, []);

  const returnHome = () => {
    navigate("/");
  };

  const changeName = async () => {
    try {
      const token = await checkUser();
      if (token !== "NO TOKEN") {
        const response = await fetch("http://localhost:5000/get-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: token }),
        });

        const result = await response.json();

        if (result.fullname && result.fullname !== userName) {
          setUserName(result.fullname);
        }
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const goToSavedRecipes = async () => {
    const token = await checkUser();
    if (token !== "NO TOKEN") {
      navigate("/user-saved-recipes");
    } else {
      alert("You are not Logged in. Please Login!");
      setLoginModalIsOpen(true);
    }
  };

  const openOptions = async () => {
    const token = await checkUser();
    if (token !== "NO TOKEN") {
      setUpdateAccModalIsOpen(true);
    } else {
      alert("You are not Logged in. Please Login!");
      setLoginModalIsOpen(true);
    }
  };

  const handleLogout = async () => {
    const token = await checkUser();
    if (token !== "NO TOKEN") {
      try {
        await fetch("http://localhost:5000/logout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("You have successfully logged out.");
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      alert("You are not Logged in. Please Login!");
      setLoginModalIsOpen(true);
    }
  };

  function closeLoginModal() {
    setLoginModalIsOpen(false);
  }

  function closeSignUpModal() {
    setSignUpModalIsOpen(false);
  }

  function closeUpdateAccountModal() {
    setUpdateAccModalIsOpen(false);
  }

  function openLoginModal() {
    closeSignUpModal();
    setLoginModalIsOpen(true);
  }

  function openSignUpModal() {
    closeLoginModal();
    setSignUpModalIsOpen(true);
  }

  return (
    <div>
      {/* Login Modal */}
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        style={customStyles}
      >
        <SignIn />
        <div className="modal-footer d-flex justify-content-center">
          <p className="mb-0">
            Don't have an Account?{" "}
            <a href="#" onClick={openSignUpModal}>
              Create an account.
            </a>
          </p>
        </div>
      </Modal>

      {/* Sign-up Modal */}
      <Modal
        isOpen={signUpModalIsOpen}
        onRequestClose={closeSignUpModal}
        style={customStyles}
      >
        <SignUp />
        <div className="modal-footer d-flex justify-content-center">
          <p className="mb-0">
            Already have an account?{" "}
            <a href="#" onClick={openLoginModal}>
              Login here
            </a>
          </p>
        </div>
      </Modal>

      {/* Update Account Modal */}
      <Modal
        isOpen={updateAccModalIsOpen}
        onRequestClose={closeUpdateAccountModal}
        style={customStyles}
      >
        <UpdateUserInfo />
      </Modal>
      <nav className="navbar custom-navbar">
        <div className="container-fluid d-flex">
          <button
            className="menu-button me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop"
            aria-controls="staticBackdrop"
          >
            &#9776;
          </button>
          <a
            className="navbar-brand text-white me-auto"
            href="#"
            onClick={returnHome}
          >
            Random Recipes
          </a>
        </div>
        <div
          className="offcanvas offcanvas-start"
          data-bs-backdrop="static"
          tabIndex="-1"
          id="staticBackdrop"
          aria-labelledby="staticBackdropLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="user-icon-container text-center mb-4">
              <img
                className="user-icon img-fluid rounded-circle"
                src={user}
                alt="User icon"
              />
              <h4 className="mt-2">{userName}</h4>
            </div>
            <div className="nav flex-column">
              <a
                className="nav-link d-flex align-items-center mb-3"
                data-bs-toggle="offcanvas"
                data-bs-target="#staticBackdrop"
                aria-controls="staticBackdrop"
                onClick={goToSavedRecipes}
              >
                <FaHeart className="sidebar-icon me-2" /> Saved Recipes
              </a>
              <a
                className="nav-link d-flex align-items-center mb-3"
                data-bs-toggle="offcanvas"
                data-bs-target="#staticBackdrop"
                aria-controls="staticBackdrop"
                onClick={openOptions}
              >
                <FaGear className="sidebar-icon me-2" /> Update User Account
              </a>
              <a
                className="nav-link d-flex align-items-center"
                data-bs-toggle="offcanvas"
                data-bs-target="#staticBackdrop"
                aria-controls="staticBackdrop"
                onClick={handleLogout}
              >
                <BiLogOut className="sidebar-icon me-2" /> Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
