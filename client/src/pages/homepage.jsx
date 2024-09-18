import React, { useState } from "react";
import NavBar from "../components/nav-bar";
import Feed from "../components/feed";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Feed />
    </div>
  );
};

export default HomePage;
