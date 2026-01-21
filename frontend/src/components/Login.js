import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Backend base URL from Vercel env variables
const API_URL = process.env.REACT_APP_API_URL;

function Login({ setIsLogin }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErr("");
  };

  // ✅ REGISTER
  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/user/register`, {
        username: user.name,
        email: user.email,
        password: user.password,
      });

      setUser({ name: "", email: "", password: "" });
      setErr(res.data.msg);
    } catch (err) {
      err.response?.data?.msg && setErr(err.response.data.msg);
    }
  };

  // ✅ LOGIN
  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        email: user.email,
        password: user.password,
      });

      setUser({ name: "", email: "", password: "" });
      localStorage.setItem("tokenStore", res.data.token);
      setIsLogin(true);
    } catch (err) {
      err.response?.data?.msg && setErr(err.response.data.msg);
    }
  };

  return (
    <section className="login-page">
      <div className="login-signup">
        {!isRegistering ? (
          <div className="outer">
            <div className="inner">
              <form onSubmit={loginSubmit}>
                <h3>Log in</h3>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    name="email"
                    required
                    value={user.email}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    name="password"
                    required
                    value={user.password}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit">
                    Sign In
                  </button>
                </div>

                <p className="next_page">
                  You don't have an account?{" "}
                  <span onClick={() => setIsRegistering(true)}>
                    Register now
                  </span>
                </p>

                <h4>{err}</h4>
              </form>
            </div>
          </div>
        ) : (
          <div className="outer">
            <div className="inner">
              <form onSubmit={registerSubmit}>
                <h3>Register</h3>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    required
                    value={user.name}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    name="email"
                    required
                    value={user.email}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    name="password"
                    required
                    value={user.password}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit">
                    Register
                  </button>
                </div>

                <p className="next_page">
                  You have an account?{" "}
                  <span onClick={() => setIsRegistering(false)}>
                    Login Now
                  </span>
                </p>

                <h4>{err}</h4>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
