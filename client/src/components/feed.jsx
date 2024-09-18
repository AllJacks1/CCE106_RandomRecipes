import React, { useEffect, useState } from "react";
import "../res/style/style.scss";
import Modal from "react-modal";

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

const Feed = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);

  function openLoginModal() {
    closeSignUpModal();
    setLoginModalIsOpen(true);
  }

  function closeLoginModal() {
    setLoginModalIsOpen(false);
  }

  function openSignUpModal() {
    closeLoginModal();
    setSignUpModalIsOpen(true);
  }

  function closeSignUpModal() {
    setSignUpModalIsOpen(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/popular-recipes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecipes(data.feed);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loginMessage = () => {
    alert("You are not Logged in! Please Login.");
  };

  const checkUser = async () => {
    const getTokenResponse = await fetch("http://localhost:5000/get-token", {
      method: "GET",
    });

    const getTokenResult = await getTokenResponse.json();

    if (getTokenResponse.ok) {
      return getTokenResult.token;
    } else {
      console.log(`Error retrieving token: ${getTokenResult.error}`);
    }
  };

  const saveRecipe = async (recipe) => {
    const token = await checkUser();
    if (token === "NO TOKEN") {
      loginMessage();
      openLoginModal();
    } else {
      setSavedRecipes((prevSaved) => [...prevSaved, recipe]);

      try {
        const response = await fetch("http://localhost:5000/save-recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            img: recipe.display.images,
            title: recipe.display.displayName,
            time: recipe.content.details.totalTime,
            serving: recipe.content.details.numberOfServings,
            rating: recipe.content.details.rating,
            link: recipe.content.details.directionsUrl,
            id: token,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log(result.message);
        } else {
          console.log(`Error: ${result.error}`);
        }
      } catch (error) {
        console.log("An error occurred while saving the recipe.");
      }

      alert(`${recipe.display.displayName} saved!`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <div className="recipe-card" key={index}>
            <img src={recipe.display.images} alt={recipe.display.flag} />
            <div className="recipe-card-content">
              <h2>{recipe.display.displayName}</h2>
              <p>
                <strong>Time:</strong> {recipe.content.details.totalTime}
              </p>
              <p>
                <strong>Servings:</strong>{" "}
                {recipe.content.details.numberOfServings}
              </p>
              <p>
                <strong>Rating:</strong> {recipe.content.details.rating} / 5
              </p>
              <a
                href={recipe.content.details.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Recipe
              </a>
              <button className="save-btn" onClick={() => saveRecipe(recipe)}>
                Save Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        style={customStyles}
        contentLabel="Login Modal"
      >
        <Login />
        <div className="login-image">
          <figure>
            <img src="images/login-image.jpg" alt="login image" />
          </figure>
          <p>
            Don't have an Account?{" "}
            <a href="#" onClick={openSignUpModal}>
              Create an account
            </a>
          </p>
        </div>
      </Modal>
      <Modal
        isOpen={signUpModalIsOpen}
        onRequestClose={closeSignUpModal}
        style={customStyles}
        contentLabel="Sign-up Modal"
      >
        <SignUp />
        <div className="signup-image">
          <figure>
            <img src="images/signup-image.jpg" alt="sign up image" />
          </figure>
          <a href="#" className="signup-image-link" onClick={openLoginModal}>
            I am already a member
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default Feed;
