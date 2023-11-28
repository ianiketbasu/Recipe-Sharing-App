// "use client";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { useRouter } from "next/navigation";

// export default function RecipeDetails({ params }) {
//   const [recipeDetails, setRecipeDetails] = useState(null);
//   const recipeId = params.id;
//   const router = useRouter();

//   // useEffect(() => {
//   //   const fetchRecipeDetails = async () => {
//   //     const recipeDocRef = doc(db, "Recipes", recipeId);
//   //     const recipeDoc = await getDoc(recipeDocRef);

//   //     if (recipeDoc.exists()) {
//   //       setRecipeDetails(recipeDoc.data());
//   //     } else {
//   //       console.log("Recipe not found");
//   //     }
//   //   };

//   //   fetchRecipeDetails();
//   // }, [recipeId]);

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();

//           // Retrieve user information based on userId
//           const userDocRef = doc(db, "Users", recipeData.userId);
//           const userDoc = await getDoc(userDocRef);

//           if (userDoc.exists()) {
//             const userData = userDoc.data();

//             // Merge recipe and user data
//             const mergedData = {
//               ...recipeData,
//               postedByUserName: userData.name,
//             };

//             setRecipeDetails(mergedData);
//           } else {
//             console.log("User not found");
//           }
//         } else {
//           console.log("Recipe not found");
//         }
//       } catch (error) {
//         console.error("Error fetching recipe details:", error.message);
//       }
//     };

//     fetchRecipeDetails();
//   }, [recipeId]);

//   const handleUpdateRecipeClick = () => {
//     // Redirect the user to the update page with the recipeId
//     console.log("forwording");
//     router.push(`/recipes/${recipeId}/update`);
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         <div
//           className="col-md-3"
//           style={{
//             padding: "20px",
//             margin: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//           }}
//         >
//           {/* Recipe Name, Posted by, User Image */}
//           <div className="mb-4">
//             <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
//               {recipeDetails?.RecipeName}
//             </h2>
//             <p style={{ fontSize: "16px" }}>
//               Posted by: {recipeDetails?.postedByUserName}
//             </p>
//             {/* <img
//               src={recipeDetails?.userImageUrl}
//               alt="User"
//               className="img-fluid rounded-circle"
//               style={{ width: "50px", height: "50px" }}
//             /> */}
//           </div>

//           {/* Recipe Image */}
//           <div className="mb-3">
//             <img
//               src={recipeDetails?.imgUrl}
//               alt="Recipe"
//               className="img-fluid"
//               style={{ width: "300px", height: "200px" }}
//             />
//           </div>
//         </div>

//         <div
//           className="col-md-6"
//           style={{
//             padding: "20px",
//             margin: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//           }}
//         >
//           {/* Recipe Ingredients */}
//           <div className="mb-4">
//             <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
//               Ingredients:
//             </h3>
//             <div
//               style={{
//                 height: "100px",
//                 width: "100%",
//                 fontSize: "16px",
//                 textAlign: "justify",
//               }}
//             >
//               {recipeDetails?.Ingredients}
//             </div>
//           </div>

//           {/* Cooking Instructions */}
//           <div>
//             <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
//               Cooking Instructions:
//             </h3>
//             <p style={{ fontSize: "16px", textAlign: "justify" }}>
//               {recipeDetails?.Instructions}
//             </p>
//           </div>

//           <div className="d-flex mt-3">
//             <button
//               className="btn btn-primary flex-grow-1 me-2"
//               type="button"
//               onClick={handleUpdateRecipeClick}
//               style={{ fontSize: "14px" }} // Adjust the font size
//             >
//               Update Recipe
//             </button>
//             <button
//               className="btn btn-primary flex-grow-1"
//               type="button"
//               style={{ fontSize: "14px" }} // Adjust the font size
//             >
//               Delete Recipe
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/navigation";

export default function RecipeDetails({ params }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const recipeId = params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const recipeDocRef = doc(db, "Recipes", recipeId);
        const recipeDoc = await getDoc(recipeDocRef);

        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();

          // Retrieve user information based on userId
          const userDocRef = doc(db, "Users", recipeData.userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Merge recipe and user data
            const mergedData = {
              ...recipeData,
              postedByUserName: userData.name,
            };

            setRecipeDetails(mergedData);
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
    // Redirect the user to the update page with the recipeId
    console.log("forwarding");
    router.push(`/recipes/${recipeId}/update`);
  };

  const handleDeleteRecipeClick = async () => {
    // Display a confirmation pop-up
    const isConfirmed = window.confirm("Are you sure you want to delete this recipe?");

    if (isConfirmed) {
      try {
        // Delete the recipe (replace the following line with your delete logic)
        await deleteDoc(doc(db, "Recipes", recipeId));
        
        // Redirect to the home page after deletion
        router.push("/");
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
          {/* Recipe Name, Posted by, User Image */}
          <div className="mb-4">
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {recipeDetails?.RecipeName}
            </h2>
            <p style={{ fontSize: "16px" }}>
              Posted by: {recipeDetails?.postedByUserName}
            </p>
            {/* <img
              src={recipeDetails?.userImageUrl}
              alt="User"
              className="img-fluid rounded-circle"
              style={{ width: "50px", height: "50px" }}
            /> */}
          </div>

          {/* Recipe Image */}
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
          {/* Recipe Ingredients */}
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

          {/* Cooking Instructions */}
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Cooking Instructions:
            </h3>
            <p style={{ fontSize: "16px", textAlign: "justify" }}>
              {recipeDetails?.Instructions}
            </p>
          </div>

          <div className="d-flex mt-3">
            <button
              className="btn btn-primary flex-grow-1 me-2"
              type="button"
              onClick={handleUpdateRecipeClick}
              style={{ fontSize: "14px" }} // Adjust the font size
            >
              Update Recipe
            </button>
            <button
              className="btn btn-primary flex-grow-1"
              type="button"
              onClick={handleDeleteRecipeClick}
              style={{ fontSize: "14px" }} // Adjust the font size
            >
              Delete Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
