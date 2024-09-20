import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const AdminLogin = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
   
  
    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/aLogin"; // Admin login endpoint
            const { data: res } = await axios.post(url, data);
            
            // Store the token and userType in localStorage
            localStorage.setItem("token", res.token);
            localStorage.setItem("userType", "admin");
            localStorage.setItem("firstName", res.firstName);

            console.log("Admin Login - Token:", res.token);
            console.log("Admin Login - UserType:", "admin");

            // Redirect to admin dashboard
            navigate("/adminDash");
        } catch (error) {
            if (error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500) {
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
                <Link to="/login">
                    <button className={styles.nav_button}>User Login</button>
                </Link>
            </nav>

            <div className={styles.adlogin_container}>
                <div className={styles.adlogin_form_container}>
                    <div className={styles.left}>
                        <form className={styles.form_container} onSubmit={handleSubmit}>
                            <h1>Admin Login</h1>
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
                            {error && <div className={styles.error_msg}>{error}</div>}
                            <button type="submit" className={styles.green_btn}>
                                Sign In
                            </button>
                        </form>
                    </div>
                    <div className={styles.right}>
                    <h1>New Here?</h1>
                        <Link to="/adminRegister">
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

export default AdminLogin;
