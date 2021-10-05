import React, { Fragment } from "react";
import Link from "next/link";

const Navbar = (props) => {
  const { currentUser } = props;

  const links = [
    !currentUser && { id: 1, label: "Sign Up", href: "/auth/signup" },
    !currentUser && { id: 2, label: "Sign In", href: "/auth/signin" },
    currentUser && { id: 3, label: "Sign Out", href: "/auth/signout" },
  ].filter((linkConfig) => linkConfig);

  return (
    <Fragment>
      <nav className="navbar navbar-light bg-light">
        <Link href="/">
          <a className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">
            {links.map((link) => (
              <li className="nav-item" key={link.id}>
                <Link href={link.href}>
                  <a className="nav-link">{link.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* This is the _app component children */}
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Navbar;
