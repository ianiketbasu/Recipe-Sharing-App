

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

// export default function MyRecipes() {
//   const [myRecipeList, setMyRecipeList] = useState([]);
//   const [user, loading] = useAuthState(auth);
//   const userId = user ? user.uid : null;
//   const [showProgress, setShowProgress] = useState(true);

//   useEffect(() => {
//     const getMyRecipeList = async () => {
//       if (userId) {
//         try {
//           const recipesCollection = collection(db, "Recipes");
//           const recipesQuery = query(
//             recipesCollection,
//             where("userId", "==", userId)
//           );
//           const recipesSnapShot = await getDocs(recipesQuery);
//           const recipes = recipesSnapShot.docs.map((doc) => ({
//             ...doc.data(),
//             id: doc.id,
//           }));

//           setMyRecipeList(recipes);
//         } catch (error) {
//           console.error("Error fetching user recipes:", error);
//           // Handle error fetching recipes
//         } finally {
//           setTimeout(() => {
//             setShowProgress(false);
//           }, 2000);
//         }
//       }
//     };

//     getMyRecipeList();
//   }, [userId]);



//   return (
//     <div className="container">
//       <h1 className="my-4">My Recipes :</h1>

//       {showProgress && (
//         <LinearProgress
//           style={{ position: "fixed", top: "64px", width: "100%" }}
//         />
//       )}

//       {!loading && !userId && (
//         <div className="alert alert-warning" role="alert">
//           Please sign in to view your recipes.
//         </div>
//       )}

//       {userId && (
//         <div className="d-flex flex-wrap justify-content-center mx-5">
//           {myRecipeList.map((item) => {
//             return item.imgUrl ? (
//               <RecipeCard props={item} key={item.id} />
//             ) : null;
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


import { BiAddToQueue } from "react-icons/bi"; // Import the icon you want to use
import { useRouter } from "next/navigation";

export default function MyRecipes() {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [user, loading] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const [showProgress, setShowProgress] = useState(true);
  const router = useRouter();

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

  const handleCreateRecipeClick = () => {
    router.push("/recipes/create")
  };

  return (
    <div className="container">
     

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
        <div className="d-flex justify-content-between align-items-center mb-4 mx-5">
          <h2>Your Recipes</h2>
          <button
            className="btn btn-primary"
            onClick={handleCreateRecipeClick}
          >
            <BiAddToQueue className="me-1" />
            Create Recipe
          </button>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center mx-5">
        {myRecipeList.length === 0 ? (
          <div className="alert alert-info" role="alert">
            You have not posted any recipes. Create your own recipe now.
          </div>
        ) : (
          myRecipeList.map((item) =>
            item.imgUrl ? <RecipeCard props={item} key={item.id} /> : null
          )
        )}
      </div>
    </div>
  );
}
