"use client";
import { auth } from "@/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import "../CSS/header.css";
// Define the Header component
function Header() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <nav className="navbar" >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex">
            {/* Home Link */}
            <Link href={"/"} className="navbar-brand my-colour">
              <div className="my-colour">HOME</div>
            </Link>

            {/* Recipes Link */}
            <Link href={"/recipes"} className="navbar-brand ">
              <div className="my-colour">RECIPES</div>
            </Link>

            {/* Your Recipes Link (conditionally rendered) */}
            {user && (
              <Link href={"/your-recipes"} className="navbar-brand my-colour">
                <div className="my-colour">YOUR-RECIPES</div>
              </Link>
            )}
          </div>

          {/* Authentication buttons */}
          <div className="d-flex">
            {user ? (
              // User is signed in
              <button
                className="btn btn-outline-danger me-2"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            ) : (
              // User is not signed in
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

// Export the Header component
export default Header;

