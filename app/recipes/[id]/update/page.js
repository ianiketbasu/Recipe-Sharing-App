// "use client"

// import { useEffect, useState } from "react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import { db } from "../../../../firebase";
// import RecipeDetails from "../page";

// export default function UpdateRecipe({params}) {
//   const router = useRouter();
// // console.log(params.id);
//   const id = params.id
//   const [recipeDetails, setRecipeDetails] = useState(null);
//   const [editMode, setEditMode] = useState({
//     name: false,
//     ingredients: false,
//     instructions: false,
//     image: false,
//   });

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       const recipeDocRef = doc(db, "Recipes", id);
//       const recipeDoc = await getDoc(recipeDocRef);

//       if (recipeDoc.exists()) {
//         setRecipeDetails(recipeDoc.data());
//         console.log(recipeDoc.data());
//       } else {
//         console.log("Recipe not found");
//       }
//     };

//     fetchRecipeDetails();
//   }, [id]);

//   const handleEditClick = (field) => {
//     setEditMode((prev) => ({ ...prev, [field]: true }));
//   };

//   const handleSaveClick = async () => {
//     // Update the recipe in the database
//     const recipeDocRef = doc(db, "Recipes", id);
//     await updateDoc(recipeDocRef, {
//       RecipeName: recipeDetails.RecipeName,
//       Ingredients: recipeDetails.Ingredients,
//       Instructions: recipeDetails.Instructions,
//       imgUrl: recipeDetails.imgUrl,
//     });

//     // Redirect back to the RecipeDetails page
//     router.push(`/recipes/${id}`);
//   };

//   return (
//     <div>
//       <RecipeDetails params={{ id }} editable={editMode} />
//       <div className="fixed-top" style={{ padding: "10px" }}>
//         {/* Edit buttons */}
//         {Object.keys(editMode).map((field) => (
//           <button
//             key={field}
//             className="btn btn-primary me-2"
//             onClick={() => handleEditClick(field)}
//           >
//             Edit {field.charAt(0).toUpperCase() + field.slice(1)}
//           </button>
//         ))}
//         {/* Save button */}
//         <button className="btn btn-success" onClick={handleSaveClick}>
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../../firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";


const CreateRecipe = ({ params }) => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);
  const recipeId = params.id;
  const router = useRouter();



  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const recipeDocRef = doc(db, "Recipes", recipeId);
      const recipeDoc = await getDoc(recipeDocRef);
      const data = recipeDoc.data();

      setRecipeName(data.RecipeName);
      setIngredients(data.Ingredients);
      setInstructions(data.Instructions);
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      const storageRef = ref(storage, `recipes/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress + "%");
        },
        (error) => {
          console.error("Upload error:", error);
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          console.log("Image uploaded successfully:", url);

          // Update the recipe details including the new image URL
          const recipe = doc(db, "Recipes", recipeId);
          await updateDoc(recipe, {
            RecipeName: recipeName,
            Ingredients: ingredients,
            Instructions: instructions,
            imgUrl: url, // Include the new image URL
          });

          // Clear the form state
          setRecipeName("");
          setIngredients("");
          setInstructions("");
          setFile(null);
        }
      );
    } else {
      // No new image selected, update the recipe details without changing the image
      const recipe = doc(db, "Recipes", recipeId);
      await updateDoc(recipe, {
        RecipeName: recipeName,
        Ingredients: ingredients,
        Instructions: instructions,
      });

      // Clear the form state
      setRecipeName("");
      setIngredients("");
      setInstructions("");
    }
    router.push("/");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create Recipe</h2>
      <form style={{ width: "50%", margin: "0 auto" }} onSubmit={handleSubmit}>
        <div className="mb-3 d-flex align-items-start">
          <label htmlFor="recipeName" className="form-label me-3">
            Recipe Name:
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="form-control"
            id="recipeName"
            placeholder="Enter Recipe Name..."
            required
          />
        </div>
        <div className="mb-3 d-flex align-items-start">
          <label htmlFor="recipeIngredients" className="form-label me-3">
            Recipe Ingredients:
          </label>
          <textarea
            className="form-control"
            id="recipeIngredients"
            rows="3"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter Ingredients..."
          ></textarea>
        </div>
        <div className="mb-3 d-flex align-items-start">
          <label htmlFor="cookingInstructions" className="form-label me-3">
            Cooking Instructions:
          </label>
          <textarea
            className="form-control"
            id="cookingInstructions"
            rows="3"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter Instructions..."
          ></textarea>
        </div>
        <div className="mb-3 d-flex align-items-start">
          <label htmlFor="recipeImageUrl" className="form-label me-3">
            Recipe Image:
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="form-control"
            id="recipeImageUrl"
          />
        </div>
        <div className="mb-3 text-center">
          <button type="submit" className="btn btn-primary">
            Publish Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
