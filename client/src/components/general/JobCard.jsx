import React, { useEffect, useState } from "react";
import "../styles/JobCard.scss";

// Utility function to parse project string
const parseProjectField = (projectString, field) => {
  const regex = new RegExp(`\\$${field}:\\s*(.*)`, "i");
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

function JobCard({ project, pipeline }) {
  const [summary, setSummary] = useState("Fetching summary...");
  const [actions, setActions] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Parse fields from the project string
  const name = parseProjectField(project, "Name");
  const address = parseProjectField(project, "Address");
  const log = parseProjectField(project, "Log");

  // Function to fetch summary
  const fetchSummary = async () => {
    const prompt = `
      Pipeline: ${JSON.stringify(pipeline)}

      Log: ${log}

      Based on the above information, give a concise, one 
      to two short sentence summary of where the project is 
      at in the pipeline. Make sure to note any special cases 
      or requests made by the client. 
    `;
    const result = await fetchFromBackend(prompt);
    setSummary(result || "Error fetching summary.");
  };

  // Function to fetch actions
  const fetchActions = async () => {
    const prompt = `
      Pipeline: ${JSON.stringify(pipeline)}

      Log: ${log}

      Based on the above information, return the available deliverables for the pipeline phase this job is in as a JSON array of strings, where each string represents a deliverable.
    `;
    const result = await fetchFromBackend(prompt);
    setActions(result || []);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchSummary();
    fetchActions();
  }, [pipeline, log]); // Re-fetch when pipeline or log changes

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
          </div>

          {/* Actions */}
          <div className="job-card-section">
            <h4>Actions</h4>
            <div className="actions-list">
              {actions.length > 0
                ? actions.map((action, index) => (
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
    </div>
  );
}

export default JobCard;
