import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const AdminRegistration = () => {
  const [accessCode, setAccessCode] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "user", // Default to normal user
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAccessCodeField, setShowAccessCodeField] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const correctAccessCode = process.env.REACT_APP_ACCESS_CODE; // Consider using an env variable

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setData({
      ...data,
      userType: data.userType === "admin" ? "user" : "admin",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAccessCodeField(true); // Show access code field on first submit
  };

  const handleAccessCodeSubmit = async (e) => {
    e.preventDefault();
    if (accessCode === correctAccessCode) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect access code");
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/aregister";
      const { data: res } = await axios.post(url, data);
      navigate("/adminLogin");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome back</h1>
          <Link to="/adminLogin">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          {!isAuthorized ? (
            <form onSubmit={handleSubmit} className="access-code-form">
           
              {showAccessCodeField && (
                <div>
                  <label>
                    Enter Access Code:
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                    />
                  </label>
                  <button type="button" onClick={handleAccessCodeSubmit}>
                    Verify Code
                  </button>
                </div>
              )}
             {!showAccessCodeField && (
                <button type="submit" className="submit-button">
                    Submit Access Code
                </button>
            )}
            </form>
          ) : (
            <form
              className={styles.form_container}
              onSubmit={handleRegistrationSubmit}
            >
              <h1>Create an Account</h1>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <div className={styles.checkbox_container}>
                <input
                  type="checkbox"
                  id="admin"
                  checked={data.userType === "admin"}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="admin">Register as Admin</label>
              </div>

              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
