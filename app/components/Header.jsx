
// "use client";
// import { auth } from "@/firebase";
// import Link from "next/link";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useRouter } from "next/navigation";
// import { FiLogOut } from "react-icons/fi"; // You may need to install the 'react-icons' library

// import "../CSS/header.css";

// function Header() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();

//   const handleLogout = () => {
//     auth.signOut();
//     router.push("/"); // Redirect to home after logout
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <div className="container d-flex justify-content-between align-items-center">
//           <div className="d-flex">
//             <Link href={"/"} className="navbar-brand my-colour">
//               <div className="my-colour">HOME</div>
//             </Link>

//             <Link href={"/recipes"} className="navbar-brand">
//               <div className="my-colour">RECIPES</div>
//             </Link>

//             {user && (
//               <Link href={"/your-recipes"} className="navbar-brand my-colour">
//                 <div className="my-colour">YOUR-RECIPES</div>
//               </Link>
//             )}
//           </div>

//           <div className="d-flex align-items-center">
//             {user ? (
//               <div className="d-flex align-items-center me-2">
//                 <Link href={"/profile"}>
//                   <div className="btn btn-outline-secondary me-2">
//                     {/* Add your profile picture logic here */}
//                     <img
//                       src={user.photoURL || "/default-profile-picture.png"}
//                       alt="Profile"
//                       className="rounded-circle profile-picture"
//                     />
//                   </div>
//                 </Link>
//                 <div className="d-flex flex-column">
//                   <span className="text-white">{user.displayName}</span>
//                   <button
//                     className="btn btn-outline-danger"
//                     onClick={handleLogout}
//                   >
//                     <FiLogOut className="me-1" />
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link href={"/signin"} className="btn btn-outline-success me-2">
//                 Sign In/Register
//               </Link>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default Header;










"use client";
// Import necessary libraries and components
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

import "../CSS/header.css";
import { doc, getDoc } from "firebase/firestore";

function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("/default-profile-picture.png");

  // useEffect(() => {
  //   // Update user name and profile picture when the user changes
  //   if (user) {
  //     console.log(user.uid, user.displayName ,user.photoURL);
  //     setUserName(user.displayName || "");
  //     setUserProfilePic(user.photoURL || "/default-profile-picture.png");
  //   } else {
  //     setUserName("");
  //     setUserProfilePic("/default-profile-picture.png");
  //   }
  // }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const userProfileDoc = await getDoc(doc(db, "userProfile", user.uid));
          // await ensures that the state update occurs after the data is retrieved
  
          if (userProfileDoc.exists()) {
            const userProfileData = userProfileDoc.data();
            setUserName(userProfileData.name || "");
            setUserProfilePic(userProfileData.photoURL || "/default-profile-picture.png");
          } else {
            // Handle the case when user profile document is not found
            console.log("User profile not found");
          }
        } else {
          setUserName("");
          setUserProfilePic("/default-profile-picture.png");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };
  
    // Call the fetchUserProfile function
    fetchUserProfile();
  }, [user]);
  
  

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/"); // Redirect to home after logout
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <Link href={"/"} className="navbar-brand my-colour">
              <div className="my-colour">HOME</div>
            </Link>

            <Link href={"/recipes"} className="navbar-brand">
              <div className="my-colour">RECIPES</div>
            </Link>

            {user && (
              <Link href={"/your-recipes"} className="navbar-brand my-colour">
                <div className="my-colour">YOUR-RECIPES</div>
              </Link>
            )}
          </div>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center me-2">
                <Link href={"/profile"}>
                  <div className="btn btn-outline-secondary me-2">
                    {/* Display the user's profile picture */}
                    <img
                      src={userProfilePic}
                      alt="Profile"
                      className="rounded-circle profile-picture"
                    />
                  </div>
                </Link>
                <div className="d-flex flex-column">
                  {/* Display the user's name */}
                  <span className="text-white">{userName}</span>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="me-1" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href={"/signin"} className="btn btn-outline-success me-2">
                Sign In/Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
