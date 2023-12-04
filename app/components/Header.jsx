
"use client";
import { auth, db, firestore } from "@/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa"; 
import { doc, getDoc } from "firebase/firestore"; // Import getDoc from firestore

import "../CSS/header.css";

function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "userProfiles", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userProfileData = userDoc.data();
            // console.log(userProfileData)
            setUserData(userProfileData);
          } else {
            console.log("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    router.push("/");
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

          <div className="d-flex align-items-center user-name">
            {user ? (
              <div className="d-flex align-items-center me-2">
                <Link href={"/profile"}>
                  <div className="btn btn-light me-2 ">
                    
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt="Profile"
                        className="rounded-circle profile-picture"
                        style={{ width: "23px", height: "23px" }} // Set the desired size
                      />
                    ) : (
                      <FaUser className="rounded-circle profile-icon" />
                    )}
                    <span style={{color: "#ff4d4d"}}  className="ms-2">{userData?.name}</span>
                  </div>
                </Link>
                <div className="d-flex flex-column my-btn">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                    style={{color: "white"}} 
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
