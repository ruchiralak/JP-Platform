import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./styles.modules.css";

const JobSeeker = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [activePage, setActivePage] = useState("job"); // Active page state
  const [stat, setStat] = useState([]); // For job application status data
  const [approvedJobs, setApprovedJobs] = useState([]); // For approved jobs
  const [jobs, setJobs] = useState([]); // Not sure if this is needed, but retained for your original design
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);

  const [searchItem, setSearchItem] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // useEffect to fetch user details from localStorage and fetch jobs
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    const storedEmail = localStorage.getItem("email");

    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedEmail) setEmail(storedEmail);

    fetchApprovedJobs(); // Fetch approved jobs when component mounts
  }, []);

  // Function to fetch approved jobs
  const fetchApprovedJobs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/takejob");
      if (!response.ok) {
        throw new Error("Failed to fetch approved job posts");
      }
      const data = await response.json();
      setApprovedJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch approved job posts:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to fetch job application status
  const fetchJobStatus = async () => {
    try {
      const email = localStorage.getItem("email"); // Ensure the email is fetched from localStorage
      if (!email) {
        console.error("No email found in localStorage");
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/takejob1/${email}`); // Check if this is correct
      if (!response.ok) {
        throw new Error("Failed to fetch job application statuses");
      }
      const data = await response.json();
      setStat(data); // Store fetched status data in state
    } catch (err) {
      console.error("Failed to fetch job application statuses:", err.message);
      setError(err.message);
    }
  };

  // Fetch job statuses only when activePage is 'status'
  useEffect(() => {
    if (activePage === "status") {
      fetchJobStatus();
    }
  }, [activePage]); // Fetch job status only when 'status' page is active

  // To filter job posts
  const handleInputChange = (e) => {
    const searchItem = e.target.value.toLowerCase();
    setSearchItem(searchItem);

    const filteredJobs = approvedJobs.filter((job) => {
      const lowerCaseSearchItem = searchItem.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(lowerCaseSearchItem);
      const matchesLocation = job.location.toLowerCase().includes(lowerCaseSearchItem);
      const matchesJobType = job.jobtype.toLowerCase().includes(lowerCaseSearchItem);
  
      return matchesTitle || matchesLocation || matchesJobType;
    });

    setFilteredJobs(filteredJobs);
  };

  // Function to upload resume
  const upload = async () => {
    if (file && selectedJobId && firstName && lastName && email) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobCustomId", selectedJobId);
      formData.append("username", `${firstName} ${lastName}`);
      formData.append("email", email);

      try {
        await axios.post("http://localhost:8080/api/jseeker", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setOpen(false);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
      }
    } else {
      alert("Please provide all required information before uploading.");
    }
  };

  // Handle opening the popup
  const handleOpenPopup = (jobId) => {
    setSelectedJobId(jobId); // Set the selected jobId
    setOpen(true); // Open the popup
  };

  // Render different content based on activePage
  const renderContent = () => {
    switch (activePage) {
      case "job":
        return (
          <div>
            <h1>
              Welcome JobSeeker: {firstName} {lastName}
            </h1>
            <div className="search-box">
              <input
                type="text"
                value={searchItem}
                onChange={handleInputChange}
                placeholder="Search for jobs..."
              />
            </div>
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <div className="job-cards">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.customId}
                      className="job-card"
                      style={{ color: "grey" }}
                    >
                      <h2>{job.title}</h2>
                      <h2>{job.companyName}</h2>
                      <p>Description: {job.description}</p>
                      <p>Requirements: {job.requirement}</p>
                      <p>Salary: {job.salary}</p>
                      <p>Location: {job.location}</p>
                      <p>Type: {job.jobtype}</p>
                      <p>ID: {job.customId}</p>
                      <div>
                        <button onClick={() => handleOpenPopup(job.customId)}>
                          Apply
                        </button>
                        <Popup
                          open={open && selectedJobId === job.customId}
                          onClose={() => setOpen(false)}
                          position="right center"
                          contentStyle={{ width: "250px", padding: "20px", borderRadius: "35px", opacity: "80%" }}
                        >
                          <div>Upload Your Resume here</div>
                          <br />
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                          <br />
                          <br />
                          <button type="button" onClick={upload}>
                            Upload
                          </button>
                        </Popup>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "status":
        return (
          <div>
            <h1>Application Status</h1>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Job Custom ID</th>
                    <th>Application Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stat.map((item, index) => (
                    <tr key={index}>
                      <td>{item.jobCustomId}</td>
                      <td>{item.applicationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return <h1>Job seeker Dashboard</h1>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <ul className="nav-list">
          <li>
            <Link to="#" onClick={() => setActivePage("job")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => setActivePage("status")}>
              Status
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setActivePage("logout")}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default JobSeeker;
