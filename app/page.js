"use client";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import RecipeCard from "./components/RecipeCard";

export default function Home() {
  const [recipeList, setRecipeList] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const getRecipeList = async () => {
      const recipesCollection = collection(db, "Recipes");
      const recipesSnapShot = await getDocs(recipesCollection);
      const recipes = recipesSnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setRecipeList(recipes);
    };
    getRecipeList();
  }, []);

  return (
    <main className="container">
      <div className="navbar bg-body-tertiary  my-3">
        <div className="container-fluid">
          <a className="navbar-brand">Recipes List</a>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          {user && (
            <Link
              href={"/recipes/create"}
              className="btn btn-primary ms-2 create-recipe-btn"
            >
              <span>Create Recipe</span>
            </Link>
          )}
        </div>
      </div>

      <div className="d-flex flex-wrap">
        {recipeList.map((item) => {
          return item.imgUrl ? <RecipeCard props={item} /> : null;
        })}
      </div>
    </main>
  );
}



