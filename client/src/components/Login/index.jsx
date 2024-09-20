import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const getRedirectPath = (userType) => {
        switch (userType) {
            case "jobSeeker":
                return "/jobseeker";
            case "employer":
                return "/employer";
            case "admin":
                return "/adminDash";
            default:
                return "/login";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);

            // Store the token, userType, and firstName in localStorage
            localStorage.setItem("token", res.token);
            localStorage.setItem("userType", res.userType);
            localStorage.setItem("firstName", res.firstName); // Store firstName instead of username
            localStorage.setItem("lastName",res.lastName);
            localStorage.setItem("email",res.email);

            console.log("API Response:", res);
            console.log("User Type:", res.userType);
            console.log("First Name:", res.firstName);
            console.log("Last Name:",res.lastName);
            console.log("Email:",res.email);
            console.log("Redirect Path:", getRedirectPath(res.userType));

            // Redirect based on userType
            navigate(getRedirectPath(res.userType));
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <Link to="/adminlogin">
                    <button className={styles.nav_button}>Admin Login</button>
                </Link>
            </nav>
            <div className={styles.login_container}>
                <div className={styles.login_form_container}>
                    <div className={styles.left}>
                        <form className={styles.form_container} onSubmit={handleSubmit}>
                            <h1>Login to Your Account</h1>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                required
                                className={styles.input}
                                autoComplete="email"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                                className={styles.input}
                                autoComplete="current-password"
                            />
                            {error && <div className={styles.error_msg}>{error}</div>}
                            <button type="submit" className={styles.green_btn}>
                                Sign In
                            </button>
                        </form>
                    </div>
                    <div className={styles.right}>
                        <h1>New Here?</h1>
                        <Link to="/signup">
                            <button type="button" className={styles.white_btn}>
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
