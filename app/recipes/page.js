"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import RecipeCard from "../components/RecipeCard";
import { BiAddToQueue } from "react-icons/bi";
import "../CSS/profile.css";

export default function AllRecipes() {
  const [recipeList, setRecipeList] = useState([]);
  const [filteredRecipeList, setFilteredRecipeList] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getRecipeList = async () => {
      const recipesCollection = collection(db, "Recipes");
      const recipesSnapShot = await getDocs(recipesCollection);
      const recipes = recipesSnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setRecipeList(recipes);
      setFilteredRecipeList(recipes);
    };
    getRecipeList();
  }, []);

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    setSearchTerm(searchQuery.toLowerCase());
    if (searchQuery) {
      const filteredRecipes = recipeList.filter((recipe) =>
        recipe.RecipeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipeList(filteredRecipes);
    } else {
      setFilteredRecipeList(recipeList);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredRecipeList(recipeList);
  };

  return (
    <main className="container container-fluid">
      <div className="navbar bg-body-tertiary  my-3 " style={{ boxShadow: '0 4px 6px -1px #ff6b6b' }}>
        <div className="container-fluid">
          <a className="navbar-brand">Recipes List</a>
          <form className="d-flex" role="search" >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
              style={{ boxShadow: '0 0 5px #ff6b6b' }}
            />
            <button
              className="btn btn-primary "
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>
            {searchTerm && (
              <button
                className="btn btn-outline-secondary ms-2"
                type="button"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </form>
          <Link href={user ? "/recipes/create" : "../signin"}>
            <button className="btn btn-primary ms-2 create-recipe-btn">
              <BiAddToQueue className="me-1" />
              Create Recipe
            </button>
          </Link>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center mx-5">
        {filteredRecipeList.map((item) => {
          return item.imgUrl ? <RecipeCard  props={item} key={item.id} /> : null;
        })}
        {filteredRecipeList.length === 0 && searchTerm && (
          <p>No recipes found for "{searchTerm}"</p>
        )}
        {filteredRecipeList.length === 0 && !searchTerm && (
          <p>No recipes found</p>
        )}
      </div>
    </main>
  );
}
