import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const EmployerJobListing = () => {
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [activePage, setActivePage] = useState("job-posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [approvedJobIds, setApprovedJobIds] = useState([]);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // For editing or deleting job
  const [selectedStat, setSelectedStat] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    requirement: "",
    salary: "",
    location: "",
    jobtype: "",
    email: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: storedEmail,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Creating a job post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);
      await axios.post("http://localhost:8080/api/jp", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setFormData({
        title: "",
        companyName: "",
        description: "",
        requirement: "",
        salary: "",
        location: "",
        jobtype: "",
        email: "",
      });
      setSuccess("Job post created successfully!");
    } catch (error) {
      console.error("Error creating job post:", error);
      setError("Error creating job post");
    }
  };

  // Fetch approved jobs from the backend
  const fetchApprovedJobs = useCallback(async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("No email found in localStorage");
        return;
      }
      console.log("Fetching jobs for email:", email);

      const response = await fetch(
        `http://localhost:8080/api/getjob1/${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch approved job posts");
      }

      const data = await response.json();
      console.log("Fetched jobs data:", data);

      if (Array.isArray(data)) {
        setApprovedJobs(data);
        const ids = data.map((job) => job.customId);
        setApprovedJobIds(ids);
      } else {
        console.error("Unexpected data format:", data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch approved job posts:", err.message);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedJobs();
  }, [fetchApprovedJobs]);

  // Fetch applicants
  const fetchApplicants = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/getappli");

      if (!response.ok) {
        throw new Error("Failed to fetch applicant details");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const filteredApplicants = data.filter((applicant) =>
          approvedJobIds.includes(applicant.jobCustomId)
        );
        setUsers(filteredApplicants);
      } else {
        console.error("Unexpected data format:", data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch applicant data:", err.message);
      setError(err.message);
      setLoading(false);
    }
  }, [approvedJobIds]);

  useEffect(() => {
    if (approvedJobIds.length > 0) {
      fetchApplicants();
    }
  }, [approvedJobIds, fetchApplicants]);

  const handleStatusClick = (applicant) => {
    const job = approvedJobs.find(
      (job) => job.customId === applicant.jobCustomId
    );
    if (!job) {
      setError("Job related to applicant not found.");
      return;
    }
    setSelectedApplicant(applicant);
    setSelectedStat(job);
    setApplicationStatus("");
  };

  const handleStatusChange = async () => {
    if (!selectedApplicant || !applicationStatus || !selectedStat) {
      setError(
        "Please select an applicant, a valid status, and ensure a job is selected."
      );
      return;
    }

    console.log(
      "Updating status for applicant:",
      selectedApplicant.email,
      "with status:",
      applicationStatus,
      "and jobCustomId:",
      selectedStat.customId
    );

    try {
      const response = await axios.patch(`http://localhost:8080/api/status`, {
        email: selectedApplicant.email,
        applicationStatus,
        jobCustomId: selectedStat.customId, // Include jobCustomId in the request
      });

      if (response.status === 200) {
        setSuccess("Application status updated successfully!");
        setSelectedApplicant(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Error updating application status");
    }
  };

  // Handle job edit and delete
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      companyName: job.companyName,
      description: job.description,
      requirement: job.requirement,
      salary: job.salary,
      location: job.location,
      jobtype: job.jobtype,
      email: job.email,
    });
  };

  //update job posts
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    try {
      await axios.put(
        `http://localhost:8080/api/update/${selectedJob.customId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Job post updated successfully!");
      setSelectedJob(null);
      fetchApprovedJobs(); // Refresh job list
    } catch (error) {
      console.error("Error updating job post:", error);
      setError("Error updating job post");
    }
  };

  //delete job post
  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8080/api/deljob/${jobId}`);
      setSuccess("Job post deleted successfully!");
      setApprovedJobs((prevJobs) =>
        prevJobs.filter((job) => job.customId !== jobId)
      );
    } catch (error) {
      console.error(
        "Error deleting job post:",
        error.response ? error.response.data : error.message
      );
      setError("Error deleting job post");
    }
  };

  // Loading or Error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderContent = () => {
    switch (activePage) {
      case "applicant":
        return (
          <div>
            <h1>Applicants</h1>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Job Custom ID</th>
                  <th>Email</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.jobCustomId}</td>
                    <td>{user.email}</td>
                    <td>
                      <a
                        href={`http://localhost:8080/api/getappli/download/${user._id}`}
                        download={user.fileName}
                        className="resume-link"
                      >
                        {user.fileName}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`mailto:${user.email}?subject=Job Application&body=Hi ${user.username},%0D%0A%0D%0AThank you for your application. We will review your application and get back to you.`}
                        className="view action-btn"
                      >
                        Email
                      </a>
                      <button
                        className="view action-btn"
                        onClick={() => handleStatusClick(user)}
                      >
                        Status
                      </button>
                      <Popup
                        open={selectedApplicant === user}
                        closeOnDocumentClick
                        onClose={() => setSelectedApplicant(null)}
                      >
                        <div>
                          <h2>Update Status for {user.username}</h2>
                          <select
                            value={applicationStatus}
                            onChange={(e) =>
                              setApplicationStatus(e.target.value)
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                          <button onClick={handleStatusChange}>Submit</button>
                        </div>
                      </Popup>
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
            <h1>Employer Dashboard</h1>
            <div className="job-cards">
              {approvedJobs.map((job) => (
                <div key={job.customId} className="job-card">
                  <h2>{job.title}</h2>
                  <h3>{job.companyName}</h3>
                  <p>{job.customId}</p>
                  <p>{job.description}</p>
                  <p>{job.requirement}</p>
                  <p>{job.salary}</p>
                  <p>{job.location}</p>
                  <p>{job.jobtype}</p>
                  <div className="job-card-actions">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="view action-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.customId)}
                      className="view action-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "manage-jobs":
        return (
          <div>
            <h1>Manage Jobs</h1>
            <div className={styles.profile_form_card}>
              <h1>Create a Job Post</h1>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form className={styles.profile_form} onSubmit={handleSubmit}>
                <div className={styles.form_group}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter your title"
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your Company Name"
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  ></textarea>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="requirement">Requirements</label>
                  <textarea
                    id="requirement"
                    name="requirement"
                    rows="3"
                    value={formData.requirement}
                    onChange={handleChange}
                    placeholder="Requirements"
                  ></textarea>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="salary">Salary</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter your Salary"
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your Location"
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="jobtype">Job Type</label>
                  <input
                    type="text"
                    id="jobtype"
                    name="jobtype"
                    value={formData.jobtype}
                    onChange={handleChange}
                    placeholder="Enter your Job Type"
                  />
                </div>

                <button type="submit" className="view action-btn">
                  Create a Job
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return <h1>Employer Dashboard</h1>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <img src="/path-to-your-image.jpg" alt="Logo" className="logo" />
        <ul className="nav-list">
          <li>
            <Link to="#" onClick={() => setActivePage("job-posts")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => setActivePage("applicant")}>
              Applicants
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => setActivePage("manage-jobs")}>
              Manage Jobs
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setActivePage("logout")}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">
        {renderContent()}
        <Popup
          open={selectedJob !== null}
          closeOnDocumentClick
          onClose={() => setSelectedJob(null)}
        >
          <div className={styles.editForm}>
            {" "}
            {/* Apply styles here */}
            <h2>Edit Job Post</h2>
            <form onSubmit={handleUpdateJob}>
              <div className={styles.form_group}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your title"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your Company Name"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                ></textarea>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="requirement">Requirements</label>
                <textarea
                  id="requirement"
                  name="requirement"
                  rows="3"
                  value={formData.requirement}
                  onChange={handleChange}
                  placeholder="Requirements"
                ></textarea>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="salary">Salary</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter your Salary"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your Location"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="jobtype">Job Type</label>
                <input
                  type="text"
                  id="jobtype"
                  name="jobtype"
                  value={formData.jobtype}
                  onChange={handleChange}
                  placeholder="Enter your Job Type"
                />
              </div>

              <button type="submit">Update Job</button>
            </form>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default EmployerJobListing;
