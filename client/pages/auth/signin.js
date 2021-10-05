import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const SignIn = (props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => router.replace("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In!</h1>

      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary mt-3">
        Sign In
      </button>
    </form>
  );
};

SignIn.getInitialProps = ({ req, res, currentUser }) => {
  if (currentUser) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  return {};
};

export default SignIn;
