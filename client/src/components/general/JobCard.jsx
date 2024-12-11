import React, { useEffect, useState } from "react";
import "../styles/JobCard.scss";

// Utility function to parse project string
const parseProjectField = (projectString, field) => {
  const regex = new RegExp(`\\$${field}:\\s*([^$]*)`, "i");
  const match = projectString.match(regex);
  return match ? match[1].trim() : "Not Available";
};

// Reusable function to call the backend
const fetchFromBackend = async (prompt) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.message) {
      return JSON.parse(data.message.trim());
    } else {
      throw new Error("No response message.");
    }
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return [];
  }
};

function JobCard({ project, pipeline, onProjectUpdate }) {
  const [summary, setSummary] = useState("Fetching summary...");
  const [actions, setActions] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState(project);

  // Parse fields from the project string
  const name = parseProjectField(project, "Name");
  const address = parseProjectField(project, "Address");
  const log = parseProjectField(project, "Log");

  console.log(log);

  // Function to fetch summary
  const fetchSummary = async () => {
    const prompt = `
      Pipeline: ${JSON.stringify(pipeline)}

      Log: ${log}

      Based on the above information, give a concise, one 
      to two short sentence summary of where the project is 
      at in the pipeline. Make sure to note any items marekd with exclamation marks, 
      or anythings that look unusual such as the client wanting to stop the install, 
      special requests, etc.
    `;
    setSummary("Fetching summary...");
    const result = await fetchFromBackend(prompt);
    setSummary(result || "Error fetching summary.");
  };

  // Function to fetch actions
  const fetchActions = async () => {
    const prompt = `
      Pipeline: ${JSON.stringify(pipeline)}

      Log: ${log}

      Based on the above information, return the available deliverables 
      for the pipeline phase this job is in as a JSON array of strings, 
      where each string represents a deliverable.
    `;
    const result = await fetchFromBackend(prompt);
    setActions(result || []);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchSummary();
    fetchActions();
  }, [pipeline, log, project]); // Re-fetch when pipeline or log changes

  // Function to handle modal submission
  const handleModalSubmit = () => {
    onProjectUpdate(modalInput); // Update the parent with new project data
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className={`job-card ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header with toggle button */}
      <div className="job-card-header">
        <span>{name}</span>
        <button
          className="toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "expand" : "collapse"}
        </button>
      </div>
      {isCollapsed && (
        <div className="job-card-section">
          <h4>✨ Summary</h4>
          <p>{summary}</p>
        </div>
      )}

      {!isCollapsed && (
        <>
          {/* Address */}
          <div className="job-card-address">{address}</div>

          {/* Summary */}
          <div className="job-card-section">
            <h4>✨ Summary</h4>
            <p>{summary}</p>
            <button
              className="show-log-button"
              onClick={() => setIsModalOpen(true)}
            >
              Show Log
            </button>
          </div>

          {/* Actions */}
          <div className="job-card-section">
            <h4>Actions</h4>
            <div className="actions-list">
              {actions.length > 0
                ? actions?.map((action, index) => (
                    <label key={index} className="action-item">
                      <input type="checkbox" className="action-checkbox" />
                      {action}
                    </label>
                  ))
                : "No actions available."}
            </div>
          </div>

          {/* Communications */}
          <div className="job-card-section">
            <h4>Communications</h4>
            <div className="communications-list">
              <button className="communication-button">📧 eMail</button>
              <button className="communication-button">☎️ Call</button>
              <button className="communication-button">💬 Text</button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4 className="modal-header">Edit Log</h4>
            <textarea
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              rows="10"
              className="modal-textarea"
            ></textarea>
            <div className="modal-actions">
              <button
                className="modal-submit-button"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
              <button
                className="modal-close-button"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCard;
