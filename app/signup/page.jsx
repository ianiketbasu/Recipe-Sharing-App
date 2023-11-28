"use client";// Import necessary functions from Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SignUp() {
  const [error, setError] = useState(null);
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword /* Add more fields as needed */ } = e.target.elements;

    // Validate password and confirmPassword
    if (password.value !== confirmPassword.value) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

      // Access the newly created user
      const user = userCredential.user;

      // Update user profile with additional details
      await setDoc(doc(db, "Users", user.uid), {
        name: name.value,
        email: email.value,
        // Add more fields as needed
      });

      // Redirect to login page or show success message
      router.push("/")
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle or display the error to the user
      setError(`${errorCode}: ${errorMessage}`);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="fs-3 my-3 text-center">Register</div>

        <div className="mb-3 row">
          <label htmlFor="exampleInputName" className="col-sm-2 col-form-label">
            Full Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              name="name"
              className="form-control"
              id="exampleInputName"
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="exampleInputEmail" className="col-sm-2 col-form-label">
            Email address
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              name="email"
              className="form-control"
              id="exampleInputEmail"
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="exampleInputPassword" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              name="password"
              className="form-control"
              id="exampleInputPassword"
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="exampleInputConfirmPassword" className="col-sm-2 col-form-label">
            Confirm Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              id="exampleInputConfirmPassword"
              required
            />
          </div>
        </div>

        {/* Add more fields as needed */}

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>

        <div>
          <Link href={"/signin"}>Existing user? Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
