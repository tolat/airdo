import React, { useState, useEffect } from "react";
import "../styles/Kanban.scss";
import { projects } from "../../sample_data/projects.js";
import JobCard from "./JobCard";

// Utility function to format stage names for display
const formatStageName = (stage) => {
  return stage
    ?.replace(/([A-Z])/g, " $1") // Add space before capital letters
    .trim() // Remove extra spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

// Utility function to normalize stage names for comparison
const normalizeStageName = (stage) => {
  return stage?.replace(/\s+/g, "").toLowerCase(); // Remove spaces and convert to lowercase
};

// Utility function to parse a specific field from a project string
const parseProjectField = (projectString, field) => {
  const regex = new RegExp(`\\$${field}:\\s*(.*)`, "i");
  const match = projectString.match(regex);
  return match ? match[1].trim() : null;
};

// Fetch pipeline stages from the backend
const fetchStagesFromPipeline = async (pipeline) => {
  const prompt = `
    Pipeline: ${JSON.stringify(pipeline)}

    Give me back a list of the pipeline stages based on the pipeline definition.
    Your response should be a valid javascript array.
  `;

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
      throw new Error("No response message from API.");
    }
  } catch (error) {
    console.error("Error fetching stages:", error);
    return [];
  }
};

function KanBan({ pipeline }) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stages when the pipeline changes
  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      const fetchedStages = await fetchStagesFromPipeline(pipeline);
      setStages(fetchedStages || []);
      setLoading(false);
    };

    fetchStages();
  }, [pipeline]);

  if (loading) {
    return <div className="kanban-loader">Loading stages...</div>;
  }

  if (stages.length === 0) {
    return (
      <div className="kanban-no-stages">
        No stages could be found in pipeline
      </div>
    );
  }

  return (
    <div className="kanban">
      {stages.map((stage, index) => (
        <div key={index} className="kanban-column">
          <div className="kanban-header">{formatStageName(stage)}</div>
          <div className="kanban-content">
            {projects
              ?.filter(
                (project) =>
                  normalizeStageName(parseProjectField(project, "Stage")) ===
                  normalizeStageName(stage)
              )
              ?.map((project, idx) => (
                <JobCard key={idx} project={project} pipeline={pipeline} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanBan;
