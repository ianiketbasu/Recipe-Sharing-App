"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SignIn() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;

    try {
      setError(null); // Clear previous error
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      console.log(user);
      router.push("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/wrong-password") {
        setError("Wrong password. Please try again.");
        password.value = ""; // Clear the password field
      } else {
        setError(errorMessage);
      }

      console.error(errorCode, errorMessage);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <form className="card p-4" onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Sign In</h2>

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
            required
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
            className={`form-control ${error ? "is-invalid" : ""}`}
            id="exampleInputPassword1"
            required
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign In
        </button>

        <div className="mt-3 text-center">
          <Link href="/signup">New user? Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
