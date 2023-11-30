// // Import necessary modules and components
// "use client";
// import { auth } from "@/firebase";
// import Link from "next/link";
// import { useAuthState } from "react-firebase-hooks/auth";

// // Define the Header component
// function Header() {
//   const [user] = useAuthState(auth);

//   return (
//     <div>
//       <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
//         <div className="container d-flex justify-content-between align-items-center">
//           <div className="d-flex">
//             {/* Home Link */}
//             <Link href={"/"} className="navbar-brand">
//               Home
//             </Link>

//             {/* Recipes Link */}
//             <Link href={"/recipes"} className="navbar-brand">
//               Recipes
//             </Link>

//             {/* Your Recipes Link (conditionally rendered) */}
//             {user && (
//               <Link href={"/your-recipes"} className="navbar-brand">
//                 Your Recipes
//               </Link>
//             )}
//           </div>

//           {/* Authentication buttons */}
//           <div className="d-flex">
//             {user ? (
//               // User is signed in
//               <button className="btn btn-outline-danger me-2" onClick={() => auth.signOut()}>
//                 Logout
//               </button>
//             ) : (
//               // User is not signed in
//               <Link href={"/signin"} className="btn btn-outline-success me-2">
//                 Sign In/Register
//               </Link>
//             )}

//             {/* {!user && (
//               <Link href={"/signup"} className="btn btn-outline-primary">
//                 Register
//               </Link>
//             )} */}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// // Export the Header component
// export default Header;


// Import necessary modules and components
"use client";
import { auth } from "@/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

// Define the Header component
function Header() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <nav className="navbar" style={{ backgroundColor: '#e3f2fd' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex">
            {/* Home Link */}
            <Link href={"/"} className="navbar-brand">
              Home
            </Link>

            {/* Recipes Link */}
            <Link href={"/recipes"} className="navbar-brand">
              Recipes
            </Link>

            {/* Your Recipes Link (conditionally rendered) */}
            {user && (
              <Link href={"/your-recipes"} className="navbar-brand">
                Your Recipes
              </Link>
            )}
          </div>

          {/* Authentication buttons */}
          <div className="d-flex">
            {user ? (
              // User is signed in
              <button className="btn btn-outline-danger me-2" onClick={() => auth.signOut()}>
                Logout
              </button>
            ) : (
              // User is not signed in
              <Link href={"/signin"} className="btn btn-outline-success me-2">
                Sign In/Register
              </Link>
            )}

            {/* {!user && (
              <Link href={"/signup"} className="btn btn-outline-primary">
                Register
              </Link>
            )} */}
          </div>
        </div>
      </nav>
    </div>
  );
}

// Export the Header component
export default Header;
