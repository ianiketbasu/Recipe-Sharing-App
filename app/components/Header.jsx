"use client";
import { auth } from "@/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

function Header() {
  const [user] = useAuthState(auth);
  // console.log(auth.currentUser.uid);
  return (
    <div>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <Link href={"/"} className="navbar-brand">
            Recipe App
          </Link>

          {/* <Link href={"/signin"} className="btn btn-outline-success">
            Signin
          </Link> */}
          {user ? (
            // User is signed in
            <button
              className="btn btn-outline-danger"
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          ) : (
            // User is not signed in
            <Link href={"/signin"} className="btn btn-outline-success">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
