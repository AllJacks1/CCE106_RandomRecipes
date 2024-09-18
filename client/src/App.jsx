import HomePage from "./pages/homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SavedRecipes from "./pages/savedRecipes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-saved-recipes" element={<SavedRecipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
