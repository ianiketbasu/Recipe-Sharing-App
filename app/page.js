
"use client"
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import RecipeCard from "./components/RecipeCard";
import Typist from "react-typist";
import "./globals.css";

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
    <div className="home-container">
      <div className="background-image"></div>
      <div className="content-container">
        {/* <Typist className="welcome-text" cursor={{ show: false }}> */}
          <h1>Welcome to FlavorFiesta</h1>
        {/* </Typist> */}

        <p>
          Savor the Flavorful Path: Discover, Connect, and Share Your Culinary
          Story.
        </p>
      </div>
    </div>
  );
}