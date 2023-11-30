

"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import RecipeCard from "../components/RecipeCard";
import LinearProgress from "@mui/material/LinearProgress";

export default function MyRecipes() {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [user, loading] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    const getMyRecipeList = async () => {
      if (userId) {
        try {
          const recipesCollection = collection(db, "Recipes");
          const recipesQuery = query(
            recipesCollection,
            where("userId", "==", userId)
          );
          const recipesSnapShot = await getDocs(recipesQuery);
          const recipes = recipesSnapShot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setMyRecipeList(recipes);
        } catch (error) {
          console.error("Error fetching user recipes:", error);
          // Handle error fetching recipes
        } finally {
          setTimeout(() => {
            setShowProgress(false);
          }, 2000);
        }
      }
    };

    getMyRecipeList();
  }, [userId]);



  return (
    <div className="container">
      <h1 className="my-4">My Recipes :</h1>

      {showProgress && (
        <LinearProgress
          style={{ position: "fixed", top: "64px", width: "100%" }}
        />
      )}

      {!loading && !userId && (
        <div className="alert alert-warning" role="alert">
          Please sign in to view your recipes.
        </div>
      )}

      {userId && (
        <div className="d-flex flex-wrap justify-content-lg-between">
          {myRecipeList.map((item) => {
            return item.imgUrl ? (
              <RecipeCard props={item} key={item.id} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
