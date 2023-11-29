
"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function RecipeDetails({ params }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const recipeId = params.id;
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, loading, error] = useAuthState(auth);

  const getCurrentUserId = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      return user.uid;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const recipeDocRef = doc(db, "Recipes", recipeId);
        const recipeDoc = await getDoc(recipeDocRef);

        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();

          const userDocRef = doc(db, "Users", recipeData.userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const mergedData = {
              ...recipeData,
              postedByUserName: userData.name,
            };

            setRecipeDetails(mergedData);

            const userId = getCurrentUserId();
            setCurrentUserId(userId);
          } else {
            console.log("User not found");
          }
        } else {
          console.log("Recipe not found");
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error.message);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const handleUpdateRecipeClick = () => {
    if (user) {
      router.push(`/recipes/${recipeId}/update`);
    } else {
      // Handle the case where the user is not logged in
      // You can show a pop-up or redirect to the login page
      alert("Please log in to update the recipe.");
    }
  };

  const handleDeleteRecipeClick = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this recipe?");

    if (isConfirmed) {
      try {
        // Check if the current user is the one who created the recipe
        if (user && currentUserId === recipeDetails.userId) {
          // Delete the recipe (replace the following line with your delete logic)
          await deleteDoc(doc(db, "Recipes", recipeId));

          // Redirect to the home page after deletion
          router.push("/");
        } else {
          console.log("You are not authorized to delete this recipe.");
        }
      } catch (error) {
        console.error("Error deleting recipe:", error.message);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div
          className="col-md-3"
          style={{
            padding: "20px",
            margin: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div className="mb-4">
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {recipeDetails?.RecipeName}
            </h2>
            <p style={{ fontSize: "16px" }}>
              Posted by: {recipeDetails?.postedByUserName}
            </p>
          </div>

          <div className="mb-3">
            <img
              src={recipeDetails?.imgUrl}
              alt="Recipe"
              className="img-fluid"
              style={{ width: "300px", height: "200px" }}
            />
          </div>
        </div>

        <div
          className="col-md-6"
          style={{
            padding: "20px",
            margin: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div className="mb-4">
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Ingredients:
            </h3>
            <div
              style={{
                height: "100px",
                width: "100%",
                fontSize: "16px",
                textAlign: "justify",
              }}
            >
              {recipeDetails?.Ingredients}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Cooking Instructions:
            </h3>
            <p style={{ fontSize: "16px", textAlign: "justify" }}>
              {recipeDetails?.Instructions}
            </p>
          </div>

          <div className="d-flex mt-3">
            {currentUserId === recipeDetails?.userId && currentUserId && (
              <>
                <button
                  className="btn btn-primary flex-grow-1 me-2"
                  type="button"
                  onClick={handleUpdateRecipeClick}
                  style={{ fontSize: "14px" }}
                >
                  Update Recipe
                </button>
                <button
                  className="btn btn-primary flex-grow-1"
                  type="button"
                  onClick={handleDeleteRecipeClick}
                  style={{ fontSize: "14px" }}
                >
                  Delete Recipe
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
