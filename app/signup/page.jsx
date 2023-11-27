"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Link from "next/link";

function SignUp() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;

    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      // Redirect to login page or show success message
      console.log("Sign-up successful!");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle or display the error to the user
      console.error(errorCode, errorMessage);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="fs-3 my-3 text-center">Register</div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        <div>
          <Link href={"/signin"}>existing user ? Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
