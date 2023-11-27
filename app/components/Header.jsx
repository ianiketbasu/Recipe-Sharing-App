import Link from "next/link";

function Header() {
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

          {/* <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            /> */}

          <Link href={"/signin"} className="btn btn-outline-success">
            Signin
          </Link>
          {/* </form> */}
        </div>
      </nav>
    </div>
  );
}

export default Header;
