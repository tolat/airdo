import React, { useState } from "react";
import "../styles/Pipelines.scss";
import KanBan from "../general/KanBan";
import { sample_pipeline } from "../../sample_data/pipeline";

function Pipelines() {
  const [pipeline, setPipeline] = useState(sample_pipeline); // Single string pipeline
  const [inputPipeline, setInputPipeline] = useState(pipeline);

  // Function to update pipeline when "Submit" button is clicked
  const handlePipelineSubmit = () => {
    if (typeof inputPipeline === "string" && inputPipeline.trim() !== "") {
      setPipeline(inputPipeline.trim());
    } else {
      alert("Pipeline must be a non-empty string.");
    }
  };

  return (
    <div className="pipelines">
      <header className="pipelines-header">
        <div className="pipelines-header-container">
          <div className="header-title">Pipeline: </div>
          <div className="pipelines-input-section">
            <textarea
              value={inputPipeline}
              onChange={(e) => setInputPipeline(e.target.value)}
              placeholder="Enter pipeline as a single string"
              rows="5"
              className="pipelines-textarea"
            />
            <button
              onClick={handlePipelineSubmit}
              className="pipelines-submit-button"
            >
              Submit
            </button>
          </div>
        </div>
      </header>
      <div className="pipelines-content">
        <KanBan pipeline={pipeline} />
      </div>
    </div>
  );
}

export default Pipelines;
