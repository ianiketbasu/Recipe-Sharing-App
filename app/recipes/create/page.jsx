"use client";

import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateRecipe = () => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);

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

          try {
            const recipesCollection = collection(db, "Recipes");
            await addDoc(recipesCollection, {
              RecipeName: recipeName,
              Ingredients: ingredients,
              Instructions: instructions,
              imgUrl: url,
              userId: auth.currentUser.uid,
            });
          } catch (e) {
            console.error(e);
          }

          setRecipeName("");
          setIngredients("");
          setInstructions("");
          setFile(null);
        }
      );
    } else {
      console.log("No image selected");
    }
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
