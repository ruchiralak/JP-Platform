import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./adminDash.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// Sample users for demonstration purposes

const AdminDash = () => {
  const [activePage, setActivePage] = useState("home");
  const [jobPosts, setJobPosts] = useState([]); // State to store job posts
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    // Function to fetchuser details from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getusers");
        if (!response.ok) {
          throw new Error("Failed to fetch User details");
        }
        const data = await response.json();
        setUsers(data); // Set the retrieved user details
        setLoading(false); // Update loading status
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers(); // Call the fetch function on component mount
  }, []);

  //Delete users
  const deleteusers = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/deluser/${email}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the job post from the state
      setUsers(users.filter((user) => user.email !== email));
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  };
  useEffect(() => {
    // Function to fetch job posts from the backend
    const fetchJobPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getjob?approved=false"); // Adjust the URL to match your backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch job posts");
        }
        const data = await response.json();
        setJobPosts(data); // Set the retrieved job posts
        setLoading(false); // Update loading status
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobPosts(); // Call the fetch function on component mount
  }, []);

  const approveJobPost = async (customId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/getjob/${customId}/approve`,
        { 
          method: "PATCH" 
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve job post");
      }

      // After successfully approving, fetch the updated list of unapproved jobs
      // Remove the approved job post from the state
    setJobPosts(jobPosts.filter((job) => job.customId !== customId));
     
    } catch (err) {
      console.error("Failed to approve job post:", err.message);
    }
};

  const rejectJobPost = async (customId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/deljob/${customId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject job post");
      }

      // Remove the job post from the state
      setJobPosts(jobPosts.filter((job) => job.customId !== customId));
    } catch (err) {
      console.error("Failed to reject job post:", err.message);
    }
  };

  const userChartData = {
    labels: ["Total Users"],
    datasets: [
      {
        label: "Number of Users",
        data: [users.length],
        backgroundColor: ["#3498db"],
      },
    ],
  };

  const jobChartData = {
    labels: ["Total Job Posts"],
    datasets: [
      {
        label: "Number of Job Posts",
        data: [jobPosts.length],
        backgroundColor: ["#e74c3c"],
      },
    ],
  };

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return (
          <div>
            <h1>Users</h1>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{user.userType}</td>
                    <td>
                      <button className="view action-btn">View</button>
                      <button
                        className="delete action-btn"
                        onClick={() => deleteusers(user.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "job-posts":
        return (
          <div>
            <h1>Job Posts</h1>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className="job-cards">
                {jobPosts.map((job) => (
                  <div key={job.customId} className="job-card">
                    <h2>{job.title}</h2>
                    <h2>{job.companyName}</h2>
                    <p>Description :{job.description}</p>
                    <p>Requirements:{job.requirement}</p>
                    <p>Salary      :{job.salary}</p>
                    <p>location    :{job.location}</p>
                    <p>Type    :{job.jobtype}</p>
                    <p>ID     :{job.customId}</p>
                    <div className="job-actions">
                      <button
                        className="approve-btn action-btn"
                        onClick={() => approveJobPost(job.customId)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn action-btn"
                        onClick={() => rejectJobPost(job.customId)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    
     
      case "home":
        return (
          <div className="dashboard1">
            <h1 className="dashboard-h1" > Admin Dashboard</h1>
            <div className="dashboard-cards">
              {/* First small card for Users */}
              <table
                style={{ width: "1000px", borderSpacing: "20px" ,marginLeft:"150px"}}
                border={0}
              >
              <tbody>
              <tr>
                  <td style={{ width: "250px",flex:1 }}>
                    <div className="card small-card">
                      <h2>Number of Users</h2>
                      <div className="chart-container">
                        <Pie data={userChartData} />
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "250px" }}>
                    <div className="card small-card">
                      <h2>Number of Job Posts</h2>
                      <div className="chart-container">
                        <Pie data={jobChartData} />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
                
              </table>
            </div>
          </div>
        );
      default:
        return <h1>Welcome to the Admin Dashboard</h1>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <img src="/path-to-your-image.jpg" alt="Logo" className="logo" />
        <ul className="nav-list">
          <li>
            <Link to="#" onClick={() => setActivePage("home")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => setActivePage("users")}>
              Users
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => setActivePage("job-posts")}>
              Job Post
            </Link>
          </li>
         
          <li>
            <Link to="/adminlogin" onClick={() => setActivePage("logout")}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDash;
