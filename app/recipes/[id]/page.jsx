// "use client";
// import { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   deleteDocupdateDoc,
//   arrayUnion,
//   arrayRemove,
//   setDoc,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { useRouter } from "next/navigation";
// import { auth } from "../../../firebase";
// import { getAuth } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { BiUserCheck, BiUserPlus } from "react-icons/bi";

// export default function RecipeDetails({ params }) {
//   const [recipeDetails, setRecipeDetails] = useState(null);
//   const recipeId = params.id;
//   const router = useRouter();
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [user, loading, error] = useAuthState(auth);
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);

//   const getCurrentUserId = () => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       return user.uid;
//     } else {
//       return null;
//     }
//   };

//   const handleFollowClick = async () => {
//     if (user) {
//       try {
//         const recipeDetailsUserId = recipeDetails?.userId;

//         const userDocRef = doc(db, "userProfiles", recipeDetailsUserId);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           const currentUserDocRef = doc(db, "userProfiles", getCurrentUserId());
//           const currentUserDoc = await getDoc(currentUserDocRef);

//           if (currentUserDoc.exists()) {
//             const followersCount = userDoc.data().followersCount || 0;
//             const followers = userDoc.data().followers || [];

//             let updatedFollowersCount = followersCount;
//             let updatedFollowers = [...followers];

//             if (!followers.includes(getCurrentUserId())) {
//               // Follow the user
//               updatedFollowersCount++;
//               updatedFollowers.push(getCurrentUserId());
//             } else {
//               // Unfollow the user
//               updatedFollowersCount--;
//               updatedFollowers = updatedFollowers.filter(
//                 (followerId) => followerId !== getCurrentUserId()
//               );
//             }

//             // Update the user's followersCount and followers array
//             await updateDoc(userDocRef, {
//               followersCount: updatedFollowersCount,
//               followers: updatedFollowers,
//             });

//             // Update the current user's followingCount and following array
//             const currentFollowingCount =
//               currentUserDoc.data().followingCount || 0;
//             const currentFollowing = currentUserDoc.data().following || [];

//             let updatedFollowingCount = currentFollowingCount;
//             let updatedFollowing = [...currentFollowing];

//             if (!currentFollowing.includes(recipeDetailsUserId)) {
//               updatedFollowingCount++;
//               updatedFollowing.push(recipeDetailsUserId);
//             } else {
//               updatedFollowingCount--;
//               updatedFollowing = updatedFollowing.filter(
//                 (followingId) => followingId !== recipeDetailsUserId
//               );
//             }

//             await updateDoc(currentUserDocRef, {
//               followingCount: updatedFollowingCount,
//               following: updatedFollowing,
//             });

//             // Update the recipeDetails state with new follower count and array
//             setRecipeDetails((prevDetails) => ({
//               ...prevDetails,
//               followersCount: updatedFollowersCount,
//               followers: updatedFollowers,
//             }));
//           } else {
//             console.error("Current user profile not found");
//           }
//         } else {
//           console.error("User profile not found");
//         }
//       } catch (error) {
//         console.error("Error updating follow status:", error.message);
//       }
//     } else {
//       alert("Please log in to follow the user.");
//     }
//   };

//   const handleLikeClick = async () => {
//     if (user) {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();
//           const postedByUserId = recipeData.userId;

//           const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//           const recipeLikesDoc = await getDoc(recipeLikesDocRef);

//           if (recipeLikesDoc.exists()) {
//             // Update the existing document in RecipeLikes
//             const currentLikeCount = recipeLikesDoc.data().LikeCount;
//             const currentUsersWhoLiked =
//               recipeLikesDoc.data()?.UsersWhoLiked || [];

//             let updatedLikeCount = currentLikeCount;
//             let updatedUsersWhoLiked = [...currentUsersWhoLiked];

//             if (currentUsersWhoLiked.includes(getCurrentUserId())) {
//               // User has already liked the recipe, so unlike it
//               updatedLikeCount--;
//               updatedUsersWhoLiked = updatedUsersWhoLiked.filter(
//                 (userId) => userId !== getCurrentUserId()
//               );
//               setIsLiked(false);
//             } else {
//               // User hasn't liked the recipe, so like it
//               updatedLikeCount++;
//               updatedUsersWhoLiked.push(getCurrentUserId());
//               setIsLiked(true);
//             }

//             await updateDoc(recipeLikesDocRef, {
//               LikeCount: updatedLikeCount,
//               UsersWhoLiked: updatedUsersWhoLiked,
//             });

//             // Directly update the Likes field in UserProfiles using updatedLikeCounts
//             const postedUserDocRef = doc(db, "userProfiles", postedByUserId);
//             const postedUserDoc = await getDoc(postedUserDocRef);

//             if (postedUserDoc.exists()) {
//               await updateDoc(postedUserDocRef, {
//                 Likes: updatedLikeCount,
//               });
//             } else {
//               console.error("User profile not found");
//             }

//             setLikeCount(updatedLikeCount);
//           } else {
//             // Create a new document in RecipeLikes
//             const newLikeCount = 1;
//             const newUsersWhoLiked = [getCurrentUserId()];

//             await setDoc(recipeLikesDocRef, {
//               LikeCount: newLikeCount,
//               UsersWhoLiked: newUsersWhoLiked,
//               RecipeId: recipeId,
//             });

//             setIsLiked(true);
//             setLikeCount(newLikeCount);

//             // Directly update the Likes field in UserProfiles using newLikeCount
//             const postedUserDocRef = doc(db, "userProfiles", postedByUserId);
//             const postedUserDoc = await getDoc(postedUserDocRef);

//             if (postedUserDoc.exists()) {
//               await updateDoc(postedUserDocRef, {
//                 Likes: newLikeCount,
//               });
//             } else {
//               console.error("User profile not found");
//             }
//           }
//         } else {
//           console.error("Recipe not found");
//         }
//       } catch (error) {
//         console.error("Error updating likes:", error.message);
//       }
//     } else {
//       alert("Please log in to like the recipe.");
//     }
//   };

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();

//           const userDocRef = doc(db, "Users", recipeData.userId);
//           const userDoc = await getDoc(userDocRef);

//           if (userDoc.exists()) {
//             const userData = userDoc.data();

//             const mergedData = {
//               ...recipeData,
//               postedByUserName: userData.name,
//             };

//             setRecipeDetails(mergedData);

//             const userId = getCurrentUserId();
//             setCurrentUserId(userId);

//             const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//             const recipeLikesDoc = await getDoc(recipeLikesDocRef);
//             if (recipeLikesDoc.exists()) {
//               setLikeCount(recipeLikesDoc.data().LikeCount);
//               setIsLiked(recipeLikesDoc.data().UsersWhoLiked.includes(userId));
//             }
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
//     if (user) {
//       router.push(`/recipes/${recipeId}/update`);
//     } else {
//       alert("Please log in to update the recipe.");
//     }
//   };

//   const handleDeleteRecipeClick = async () => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this recipe?"
//     );

//     if (isConfirmed) {
//       try {
//         if (user && currentUserId === recipeDetails.userId) {
//           // Get the RecipeLikes document
//           const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//           const recipeLikesDoc = await getDoc(recipeLikesDocRef);

//           // Delete the RecipeLikes document if it exists
//           if (recipeLikesDoc.exists()) {
//             await deleteDoc(recipeLikesDocRef);
//           }

//           // Update the user profile to decrement likes
//           const postedUserDocRef = doc(
//             db,
//             "userProfiles",
//             recipeDetails.userId
//           );
//           const postedUserDoc = await getDoc(postedUserDocRef);

//           if (postedUserDoc.exists()) {
//             const currentLikes = postedUserDoc.data().Likes || 0;
//             const updatedLikes = Math.max(0, currentLikes - likeCount);

//             await updateDoc(postedUserDocRef, {
//               Likes: updatedLikes,
//             });
//           } else {
//             console.error("User profile not found");
//           }

//           // Delete the recipe
//           await deleteDoc(doc(db, "Recipes", recipeId));
//           router.push("/recipes");
//         } else {
//           console.log("You are not authorized to delete this recipe.");
//         }
//       } catch (error) {
//         console.error("Error deleting recipe:", error.message);
//       }
//     } else {
//       console.log("Deletion cancelled.");
//     }
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
//           <div className="mb-4">
//             <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
//               {recipeDetails?.RecipeName}
//             </h2>
//             <p style={{ fontSize: "16px" }}>
//               By: {recipeDetails?.postedByUserName}
//             </p>

//             {currentUserId !== recipeDetails?.userId && currentUserId && (
//               <div className="mt-2">
//                 <button
//                   className={`btn ${
//                     recipeDetails?.followers?.includes(currentUserId)
//                       ? "btn-primary"
//                       : "btn-outline-primary"
//                   }`}
//                   type="button"
//                   onClick={handleFollowClick}
//                 >
//                   {recipeDetails?.followers?.includes(currentUserId) ? (
//                     <BiUserCheck className="me-1" />
//                   ) : (
//                     <BiUserPlus className="me-1" />
//                   )}
//                   {recipeDetails?.followersCount} Followers
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="mb-3">
//             <img
//               src={recipeDetails?.imgUrl}
//               alt="Recipe"
//               className="img-fluid"
//               style={{ width: "300px", height: "200px" }}
//             />
//             <div className="d-flex align-items-center mt-2">
//               <button
//                 className="btn btn-outline-danger"
//                 type="button"
//                 onClick={handleLikeClick}
//                 style={{ fontSize: "14px" }}
//               >
//                 {isLiked ? (
//                   <FaHeart className="me-1 text-danger" />
//                 ) : (
//                   <FaRegHeart className="me-1" />
//                 )}
//                 {likeCount}
//               </button>
//             </div>
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

//           <div>
//             <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
//               Cooking Instructions:
//             </h3>
//             <p style={{ fontSize: "16px", textAlign: "justify" }}>
//               {recipeDetails?.Instructions}
//             </p>
//           </div>

//           <div className="d-flex mt-3">
//             {currentUserId === recipeDetails?.userId && currentUserId && (
//               <>
//                 <button
//                   className="btn btn-primary flex-grow-1 me-2"
//                   type="button"
//                   onClick={handleUpdateRecipeClick}
//                   style={{ fontSize: "14px" }}
//                 >
//                   Update Recipe
//                 </button>
//                 <button
//                   className="btn btn-primary flex-grow-1"
//                   type="button"
//                   onClick={handleDeleteRecipeClick}
//                   style={{ fontSize: "14px" }}
//                 >
//                   Delete Recipe
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   deleteDocupdateDoc,
//   arrayUnion,
//   arrayRemove,
//   setDoc,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { useRouter } from "next/navigation";
// import { auth } from "../../../firebase";
// import { getAuth } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { BiUserCheck, BiUserPlus } from "react-icons/bi";

// export default function RecipeDetails({ params }) {
//   const [recipeDetails, setRecipeDetails] = useState(null);
//   const recipeId = params.id;
//   const router = useRouter();
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [user, loading, error] = useAuthState(auth);
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false); // New state variable

//   const getCurrentUserId = () => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       return user.uid;
//     } else {
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();

//           const userDocRef = doc(db, "Users", recipeData.userId); // Declare userDoc outside try block
//           const userDoc = await getDoc(userDocRef); // Use userDoc declared outside try block

//           if (userDoc.exists()) {
//             const userData = userDoc.data();

//             const mergedData = {
//               ...recipeData,
//               postedByUserName: userData.name,
//             };

//             setRecipeDetails(mergedData);

//             const userId = getCurrentUserId();
//             setCurrentUserId(userId);

//             const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//             const recipeLikesDoc = await getDoc(recipeLikesDocRef);
//             if (recipeLikesDoc.exists()) {
//               setLikeCount(recipeLikesDoc.data().LikeCount);
//               setIsLiked(recipeLikesDoc.data().UsersWhoLiked.includes(userId));
//             } // Check if the current user is already following the user

//             const userDocRef = doc(db, "userProfiles", recipeData.userId); // Use userDoc declared outside try block
//             const userDoc = await getDoc(userDocRef); // Use userDoc declared outside try block

//             if (userDoc.exists()) {
//               setIsFollowing(userDoc.data().followers.includes(userId));
//             } else {
//               console.log("User not found");
//             }
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

//   const handleFollowClick = async () => {
//     if (user) {
//       try {
//         const recipeDetailsUserId = recipeDetails?.userId;

//         const userDocRef = doc(db, "userProfiles", recipeDetailsUserId);
//         let userDoc = await getDoc(userDocRef); // Declare userDoc outside try block

//         if (userDoc.exists()) {
//           const currentUserDocRef = doc(db, "userProfiles", getCurrentUserId());
//           const currentUserDoc = await getDoc(currentUserDocRef);

//           if (currentUserDoc.exists()) {
//             const followersCount = userDoc.data().followersCount || 0;
//             const followers = userDoc.data().followers || [];

//             let updatedFollowersCount = followersCount;
//             let updatedFollowers = [...followers];

//             if (!followers.includes(getCurrentUserId())) {
//               // Follow the user
//               updatedFollowersCount++;
//               updatedFollowers.push(getCurrentUserId());
//             } else {
//               // Unfollow the user
//               updatedFollowersCount--;
//               updatedFollowers = updatedFollowers.filter(
//                 (followerId) => followerId !== getCurrentUserId()
//               );
//             }

//             // Update the user's followersCount and followers array
//             await updateDoc(userDocRef, {
//               followersCount: updatedFollowersCount,
//               followers: updatedFollowers,
//             });

//             // Update the current user's followingCount and following array
//             const currentFollowingCount =
//               currentUserDoc.data().followingCount || 0;
//             const currentFollowing = currentUserDoc.data().following || [];

//             let updatedFollowingCount = currentFollowingCount;
//             let updatedFollowing = [...currentFollowing];

//             if (!currentFollowing.includes(recipeDetailsUserId)) {
//               updatedFollowingCount++;
//               updatedFollowing.push(recipeDetailsUserId);
//             } else {
//               updatedFollowingCount--;
//               updatedFollowing = updatedFollowing.filter(
//                 (followingId) => followingId !== recipeDetailsUserId
//               );
//             }

//             await updateDoc(currentUserDocRef, {
//               followingCount: updatedFollowingCount,
//               following: updatedFollowing,
//             });

//             // Update the recipeDetails state with new follower count and array
//             setRecipeDetails((prevDetails) => ({
//               ...prevDetails,
//               followersCount: updatedFollowersCount,
//               followers: updatedFollowers,
//             }));

//             // Update the follow/unfollow status
//             setIsFollowing(updatedFollowers.includes(getCurrentUserId()));
//           } else {
//             console.error("Current user profile not found");
//           }
//         } else {
//           console.error("User profile not found");
//         }
//       } catch (error) {
//         console.error("Error updating follow status:", error.message);
//       }
//     } else {
//       alert("Please log in to follow the user.");
//     }
//   };

//   const handleLikeClick = async () => {
//     if (user) {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();
//           const postedByUserId = recipeData.userId;

//           const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//           const recipeLikesDoc = await getDoc(recipeLikesDocRef);

//           if (recipeLikesDoc.exists()) {
//             // Update the existing document in RecipeLikes
//             const currentLikeCount = recipeLikesDoc.data().LikeCount;
//             const currentUsersWhoLiked =
//               recipeLikesDoc.data()?.UsersWhoLiked || [];

//             let updatedLikeCount = currentLikeCount;
//             let updatedUsersWhoLiked = [...currentUsersWhoLiked];

//             if (currentUsersWhoLiked.includes(getCurrentUserId())) {
//               // User has already liked the recipe, so unlike it
//               updatedLikeCount--;
//               updatedUsersWhoLiked = updatedUsersWhoLiked.filter(
//                 (userId) => userId !== getCurrentUserId()
//               );
//               setIsLiked(false);
//             } else {
//               // User hasn't liked the recipe, so like it
//               updatedLikeCount++;
//               updatedUsersWhoLiked.push(getCurrentUserId());
//               setIsLiked(true);
//             }

//             await updateDoc(recipeLikesDocRef, {
//               LikeCount: updatedLikeCount,
//               UsersWhoLiked: updatedUsersWhoLiked,
//             });

//             // Directly update the Likes field in UserProfiles using updatedLikeCounts
//             const postedUserDocRef = doc(db, "userProfiles", postedByUserId);
//             const postedUserDoc = await getDoc(postedUserDocRef);

//             if (postedUserDoc.exists()) {
//               await updateDoc(postedUserDocRef, {
//                 Likes: updatedLikeCount,
//               });
//             } else {
//               console.error("User profile not found");
//             }

//             setLikeCount(updatedLikeCount);
//           } else {
//             // Create a new document in RecipeLikes
//             const newLikeCount = 1;
//             const newUsersWhoLiked = [getCurrentUserId()];

//             await setDoc(recipeLikesDocRef, {
//               LikeCount: newLikeCount,
//               UsersWhoLiked: newUsersWhoLiked,
//               RecipeId: recipeId,
//             });

//             setIsLiked(true);
//             setLikeCount(newLikeCount);

//             // Directly update the Likes field in UserProfiles using newLikeCount
//             const postedUserDocRef = doc(db, "userProfiles", postedByUserId);
//             const postedUserDoc = await getDoc(postedUserDocRef);

//             if (postedUserDoc.exists()) {
//               await updateDoc(postedUserDocRef, {
//                 Likes: newLikeCount,
//               });
//             } else {
//               console.error("User profile not found");
//             }
//           }
//         } else {
//           console.error("Recipe not found");
//         }
//       } catch (error) {
//         console.error("Error updating likes:", error.message);
//       }
//     } else {
//       alert("Please log in to like the recipe.");
//     }
//   };

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         const recipeDocRef = doc(db, "Recipes", recipeId);
//         const recipeDoc = await getDoc(recipeDocRef);

//         if (recipeDoc.exists()) {
//           const recipeData = recipeDoc.data();

//           const userDocRef = doc(db, "Users", recipeData.userId);
//           const userDoc = await getDoc(userDocRef);

//           if (userDoc.exists()) {
//             const userData = userDoc.data();

//             const mergedData = {
//               ...recipeData,
//               postedByUserName: userData.name,
//             };

//             setRecipeDetails(mergedData);

//             const userId = getCurrentUserId();
//             setCurrentUserId(userId);

//             const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//             const recipeLikesDoc = await getDoc(recipeLikesDocRef);
//             if (recipeLikesDoc.exists()) {
//               setLikeCount(recipeLikesDoc.data().LikeCount);
//               setIsLiked(recipeLikesDoc.data().UsersWhoLiked.includes(userId));
//             }
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
//     if (user) {
//       router.push(`/recipes/${recipeId}/update`);
//     } else {
//       alert("Please log in to update the recipe.");
//     }
//   };

//   const handleDeleteRecipeClick = async () => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this recipe?"
//     );

//     if (isConfirmed) {
//       try {
//         if (user && currentUserId === recipeDetails.userId) {
//           // Get the RecipeLikes document
//           const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
//           const recipeLikesDoc = await getDoc(recipeLikesDocRef);

//           // Delete the RecipeLikes document if it exists
//           if (recipeLikesDoc.exists()) {
//             await deleteDoc(recipeLikesDocRef);
//           }

//           // Update the user profile to decrement likes
//           const postedUserDocRef = doc(
//             db,
//             "userProfiles",
//             recipeDetails.userId
//           );
//           const postedUserDoc = await getDoc(postedUserDocRef);

//           if (postedUserDoc.exists()) {
//             const currentLikes = postedUserDoc.data().Likes || 0;
//             const updatedLikes = Math.max(0, currentLikes - likeCount);

//             await updateDoc(postedUserDocRef, {
//               Likes: updatedLikes,
//             });
//           } else {
//             console.error("User profile not found");
//           }

//           // Delete the recipe
//           await deleteDoc(doc(db, "Recipes", recipeId));
//           router.push("/recipes");
//         } else {
//           console.log("You are not authorized to delete this recipe.");
//         }
//       } catch (error) {
//         console.error("Error deleting recipe:", error.message);
//       }
//     } else {
//       console.log("Deletion cancelled.");
//     }
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
//           <div className="mb-4">
//             <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
//               {recipeDetails?.RecipeName}
//             </h2>
//             <p style={{ fontSize: "16px" }}>
//               By: {recipeDetails?.postedByUserName}
//             </p>

//             {currentUserId !== recipeDetails?.userId && currentUserId && (
//               <div className="mt-2">
//                 <button
//                   className={`btn ${
//                     isFollowing ? "btn-primary" : "btn-outline-primary"
//                   }`}
//                   type="button"
//                   onClick={handleFollowClick}
//                 >
//                   {isFollowing ? (
//                     <BiUserCheck className="me-1" />
//                   ) : (
//                     <BiUserPlus className="me-1" />
//                   )}
//                   {recipeDetails?.followersCount} Followers
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="mb-3">
//             <img
//               src={recipeDetails?.imgUrl}
//               alt="Recipe"
//               className="img-fluid"
//               style={{ width: "300px", height: "200px" }}
//             />
//             <div className="d-flex align-items-center mt-2">
//               <button
//                 className="btn btn-outline-danger"
//                 type="button"
//                 onClick={handleLikeClick}
//                 style={{ fontSize: "14px" }}
//               >
//                 {isLiked ? (
//                   <FaHeart className="me-1 text-danger" />
//                 ) : (
//                   <FaRegHeart className="me-1" />
//                 )}
//                 {likeCount}
//               </button>
//             </div>
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

//           <div>
//             <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
//               Cooking Instructions:
//             </h3>
//             <p style={{ fontSize: "16px", textAlign: "justify" }}>
//               {recipeDetails?.Instructions}
//             </p>
//           </div>

//           <div className="d-flex mt-3">
//             {currentUserId === recipeDetails?.userId && currentUserId && (
//               <>
//                 <button
//                   className="btn btn-primary flex-grow-1 me-2"
//                   type="button"
//                   onClick={handleUpdateRecipeClick}
//                   style={{ fontSize: "14px" }}
//                 >
//                   Update Recipe
//                 </button>
//                 <button
//                   className="btn btn-primary flex-grow-1"
//                   type="button"
//                   onClick={handleDeleteRecipeClick}
//                   style={{ fontSize: "14px" }}
//                 >
//                   Delete Recipe
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiUserCheck, BiUserPlus } from "react-icons/bi";

export default function RecipeDetails({ params }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const recipeId = params.id;
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

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

          let userDoc = null;

          const userDocRef = doc(db, "Users", recipeData.userId);
          userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const mergedData = {
              ...recipeData,
              postedByUserName: userData.name,
            };

            setRecipeDetails(mergedData);

            const userId = getCurrentUserId();
            setCurrentUserId(userId);

            const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
            const recipeLikesDoc = await getDoc(recipeLikesDocRef);
            if (recipeLikesDoc.exists()) {
              setLikeCount(recipeLikesDoc.data().LikeCount);
              setIsLiked(recipeLikesDoc.data().UsersWhoLiked.includes(userId));
            }

            const userProfileDocRef = doc(
              db,
              "userProfiles",
              recipeData.userId
            );
            const userProfileDoc = await getDoc(userProfileDocRef);

            if (userProfileDoc.exists()) {
              const followersCount = userProfileDoc.data().followersCount || 0;

              // Check if followers is an array before using includes
              const followers = Array.isArray(userProfileDoc.data().followers)
                ? userProfileDoc.data().followers
                : [];

              let updatedFollowersCount = followersCount;
              let updatedFollowers = [...followers];

              if (!followers.includes(userId)) {
                // Follow the user
                updatedFollowersCount++;
                updatedFollowers.push(userId);
              } else {
                // Unfollow the user
                updatedFollowersCount--;
                updatedFollowers = updatedFollowers.filter(
                  (followerId) => followerId !== userId
                );
              }

              await updateDoc(userProfileDocRef, {
                followersCount: updatedFollowersCount,
                followers: updatedFollowers,
              });

              const currentFollowingCount =
                userProfileDoc.data().followingCount || 0;
              const currentFollowing = userProfileDoc.data().following || [];

              let updatedFollowingCount = currentFollowingCount;
              let updatedFollowing = [...currentFollowing];

              if (!currentFollowing.includes(recipeData.userId)) {
                updatedFollowingCount++;
                updatedFollowing.push(recipeData.userId);
              } else {
                updatedFollowingCount--;
                updatedFollowing = updatedFollowing.filter(
                  (followingId) => followingId !== recipeData.userId
                );
              }

              await updateDoc(userProfileDocRef, {
                followingCount: updatedFollowingCount,
                following: updatedFollowing,
              });

              setRecipeDetails((prevDetails) => ({
                ...prevDetails,
                followersCount: updatedFollowersCount,
                followers: updatedFollowers,
              }));

              setIsFollowing(updatedFollowers.includes(userId));
            } else {
              console.log("User profile not found");
            }
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

  const handleFollowClick = async () => {
    if (user) {
      try {
        const recipeDetailsUserId = recipeDetails?.userId;

        if (recipeDetailsUserId === currentUserId) {
          console.log("You cannot follow yourself.");
          return;
        }

        const userDocRef = doc(db, "userProfiles", recipeDetailsUserId);
        let userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const currentUserDocRef = doc(db, "userProfiles", currentUserId);
          const currentUserDoc = await getDoc(currentUserDocRef);

          if (currentUserDoc.exists()) {
            const followersCount = userDoc.data().followersCount || 0;
            const followers = userDoc.data().followers || [];

            let updatedFollowersCount = followersCount;
            let updatedFollowers = [...followers];

            if (!followers.includes(currentUserId)) {
              // Follow the user
              updatedFollowersCount++;
              updatedFollowers.push(currentUserId);
            } else {
              // Unfollow the user
              updatedFollowersCount--;
              updatedFollowers = updatedFollowers.filter(
                (followerId) => followerId !== currentUserId
              );
            }

            // Update the user's followersCount and followers array
            await updateDoc(userDocRef, {
              followersCount: updatedFollowersCount,
              followers: updatedFollowers,
            });

            // Update the current user's followingCount and following array
            const currentFollowingCount =
              currentUserDoc.data().followingCount || 0;
            const currentFollowing = currentUserDoc.data().following || [];

            let updatedFollowingCount = currentFollowingCount;
            let updatedFollowing = [...currentFollowing];

            if (!currentFollowing.includes(recipeDetailsUserId)) {
              updatedFollowingCount++;
              updatedFollowing.push(recipeDetailsUserId);
            } else {
              updatedFollowingCount--;
              updatedFollowing = updatedFollowing.filter(
                (followingId) => followingId !== recipeDetailsUserId
              );
            }

            await updateDoc(currentUserDocRef, {
              followingCount: updatedFollowingCount,
              following: updatedFollowing,
            });

            // Update the recipeDetails state with new follower count and array
            setRecipeDetails((prevDetails) => {
              const newDetails = {
                ...prevDetails,
                followersCount: updatedFollowersCount,
                followers: updatedFollowers,
              };

              // Log the updated details for debugging
              console.log("Updated Recipe Details:", newDetails);

              return newDetails;
            });

            // Update the follow/unfollow status
            setIsFollowing(updatedFollowers.includes(currentUserId));
          } else {
            console.error("Current user profile not found");
          }
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error updating follow status:", error.message);
      }
    } else {
      alert("Please log in to follow the user.");
    }
  };

  const handleLikeClick = async () => {
    if (user) {
      try {
        const recipeDocRef = doc(db, "Recipes", recipeId);
        const recipeDoc = await getDoc(recipeDocRef);

        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();
          const postedByUserId = recipeData.userId;

          const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
          const recipeLikesDoc = await getDoc(recipeLikesDocRef);

          if (recipeLikesDoc.exists()) {
            const currentLikeCount = recipeLikesDoc.data().LikeCount;
            const currentUsersWhoLiked =
              recipeLikesDoc.data()?.UsersWhoLiked || [];

            let updatedLikeCount = currentLikeCount;
            let updatedUsersWhoLiked = [...currentUsersWhoLiked];

            const userId = getCurrentUserId();

            if (currentUsersWhoLiked.includes(userId)) {
              // User has already liked the recipe, so unlike it
              updatedLikeCount--;
              updatedUsersWhoLiked = updatedUsersWhoLiked.filter(
                (id) => id !== userId
              );
              setIsLiked(false);
            } else {
              // User hasn't liked the recipe, so like it
              updatedLikeCount++;
              updatedUsersWhoLiked.push(userId);
              setIsLiked(true);
            }

            await updateDoc(recipeLikesDocRef, {
              LikeCount: updatedLikeCount,
              UsersWhoLiked: updatedUsersWhoLiked,
            });

            // Update the Likes field in UserProfiles by accumulating likes for all recipes
            const postedUserDocRef = doc(db, "userProfiles", postedByUserId);
            const postedUserDoc = await getDoc(postedUserDocRef);

            if (postedUserDoc.exists()) {
              const userLikes = postedUserDoc.data().Likes || 0;

              // Calculate total likes by accumulating likes for all recipes
              const updatedLikes =
                userLikes + (updatedLikeCount - currentLikeCount);

              await updateDoc(postedUserDocRef, {
                Likes: updatedLikes,
              });

              setLikeCount(updatedLikeCount);
            } else {
              console.error("User profile not found");
            }
          } else {
            console.error("RecipeLikes document not found");
          }
        } else {
          console.error("Recipe not found");
        }
      } catch (error) {
        console.error("Error updating likes:", error.message);
      }
    } else {
      alert("Please log in to like the recipe.");
    }
  };

  const handleUpdateRecipeClick = () => {
    if (user) {
      router.push(`/recipes/${recipeId}/update`);
    } else {
      alert("Please log in to update the recipe.");
    }
  };

  const handleDeleteRecipeClick = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (isConfirmed) {
      try {
        if (user && currentUserId === recipeDetails.userId) {
          // Get the RecipeLikes document
          const recipeLikesDocRef = doc(db, "RecipeLikes", recipeId);
          const recipeLikesDoc = await getDoc(recipeLikesDocRef);

          // Delete the RecipeLikes document if it exists
          if (recipeLikesDoc.exists()) {
            await deleteDoc(recipeLikesDocRef);
          }

          // Update the user profile to decrement likes
          const postedUserDocRef = doc(
            db,
            "userProfiles",
            recipeDetails.userId
          );
          const postedUserDoc = await getDoc(postedUserDocRef);

          if (postedUserDoc.exists()) {
            const currentLikes = postedUserDoc.data().Likes || 0;
            const updatedLikes = Math.max(0, currentLikes - likeCount);

            await updateDoc(postedUserDocRef, {
              Likes: updatedLikes,
            });
          } else {
            console.error("User profile not found");
          }

          // Delete the recipe
          await deleteDoc(doc(db, "Recipes", recipeId));
          router.push("/recipes");
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
              By: {recipeDetails?.postedByUserName}
            </p>

            {currentUserId !== recipeDetails?.userId && currentUserId && (
              <div className="mt-2">
                <button
                  className={`btn ${
                    isFollowing ? "btn-primary" : "btn-outline-primary"
                  }`}
                  type="button"
                  onClick={handleFollowClick}
                >
                  {isFollowing ? (
                    <BiUserCheck className="me-1" />
                  ) : (
                    <BiUserPlus className="me-1" />
                  )}
                  {followersCount} Followers
                </button>
              </div>
            )}
          </div>

          <div className="mb-3">
            <img
              src={recipeDetails?.imgUrl}
              alt="Recipe"
              className="img-fluid"
              style={{ width: "300px", height: "200px" }}
            />
            <div className="d-flex align-items-center mt-2">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleLikeClick}
                style={{ fontSize: "14px" }}
              >
                {isLiked ? (
                  <FaHeart className="me-1 text-danger" />
                ) : (
                  <FaRegHeart className="me-1" />
                )}
                {likeCount}
              </button>
            </div>
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
