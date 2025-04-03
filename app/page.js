'use client';

import { useState } from "react";
import FlowchartVisual from './components/FlowchartVisual'; // Use the correct path

export default function Home() {
  const [step, setStep] = useState("initial");
  const [sampleSize, setSampleSize] = useState("");
  const [envBias, setEnvBias] = useState("");
  const [hasStrongCovariates, setHasStrongCovariates] = useState("");

  const isResultStep = [
    "blockRecommendation",
    "largeResult",
    "stratResult",
    "stratOnlyResult",
    "blockResult"
  ].includes(step);

  // ... (Keep all your handlers: handleContinue, handleEnvBiasYes, etc.)
    const handleContinue = () => {
    if (sampleSize === "small" || sampleSize === "moderate") {
      setStep("blockRecommendation");
    } else if (sampleSize === "large") {
      setStep("environmentalBiasQuestion");
    }
  };

  const handleEnvBiasYes = () => {
    setEnvBias("yes");
    setStep("covariatesQuestion");
  };

  const handleEnvBiasNo = () => {
    setEnvBias("no");
    setStep("covariatesQuestion");
  };

  const handleStrongCovariates = () => {
    setHasStrongCovariates("yes");
    if (envBias === "yes") {
      setStep("stratResult");
    } else {
      setStep("stratOnlyResult");
    }
  };

  const handleNoStrongCovariates = () => {
    setHasStrongCovariates("no");
    if (envBias === "yes") {
      setStep("blockResult");
    } else {
      setStep("largeResult");
    }
  };

  const handleReset = () => {
    setStep("initial");
    setSampleSize("");
    setEnvBias("");
    setHasStrongCovariates("");
  };


  return (
    <div className="flowchart-container">
      <h1 className="main-heading">This interactive flowchart guides researchers...</h1>

      <div className="content-boxes-container">
        {/* === Left Box: Questions AND Results === */}
        <div className="question-box">
          {/* --- Question Rendering Logic --- */}
          {/* Initial Question */}
          {step === "initial" && (
            <div style={{ textAlign: 'center' }}>
              <h4 className="question-heading">What is your sample size?</h4>
              {/* ... radio buttons ... */}
               <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '10px' }}>
                  <input type="radio" id="small" name="sampleSize" value="small" checked={sampleSize === "small"} onChange={() => setSampleSize("small")} style={{ marginRight: '10px' }} />
                  <label htmlFor="small">Small</label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input type="radio" id="moderate" name="sampleSize" value="moderate" checked={sampleSize === "moderate"} onChange={() => setSampleSize("moderate")} style={{ marginRight: '10px' }} />
                  <label htmlFor="moderate">Moderate</label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input type="radio" id="large" name="sampleSize" value="large" checked={sampleSize === "large"} onChange={() => setSampleSize("large")} style={{ marginRight: '10px' }} />
                  <label htmlFor="large">Large</label>
                </div>
              </div>
              <button onClick={handleContinue} className="action-button" disabled={!sampleSize} style={{ opacity: !sampleSize ? 0.6 : 1 }}>
                Continue
              </button>
            </div>
          )}

          {/* Environmental Bias Question */}
          {step === "environmentalBiasQuestion" && (
             <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* ... content ... */}
                 <p className="result-description"><strong>Selected sample size: Large</strong></p>
                 <h4 className="question-heading">Are there environmental sources of bias you need to control for?</h4>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button onClick={handleEnvBiasYes} className="action-button">Yes</button>
                    <button onClick={handleEnvBiasNo} className="action-button">No</button>
                </div>
            </div>
          )}

          {/* Covariates Question */}
          {step === "covariatesQuestion" && (
             <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* ... content ... */}
               <p className="result-description">
                <strong>Selected sample size: Large</strong><br />
                <strong>Environmental sources of bias: {envBias === "yes" ? "Yes" : "No"}</strong>
              </p>
              <h4 className="question-heading">Are there strong covariates you need to control for?</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={handleStrongCovariates} className="action-button">Yes</button>
                <button onClick={handleNoStrongCovariates} className="action-button">No</button>
              </div>
            </div>
          )}

           {/* Placeholder message if not initial step and not a result step yet */}
          {step !== 'initial' && !isResultStep && step !== 'environmentalBiasQuestion' && step !== 'covariatesQuestion' && (
             <p style={{ textAlign: 'center', marginTop: '20px' }}>Make selections to continue.</p>
          )}

          {/* --- Results Section (Moved Inside question-box) --- */}
          {isResultStep && (
            <div className="result-container" style={{ textAlign: 'center', marginTop: '30px' }}> {/* Added margin-top */}
              {/* Block Randomization Recommendation */}
              {step === "blockRecommendation" && (
                <>
                  <p className="result-description"><strong>Selected sample size: {sampleSize === "small" ? "Small" : "Moderate"}</strong></p>
                  <h4 className="result-heading">Recommended Method: Block Randomization</h4>
                  <p className="result-description">For smaller studies, block randomization helps maintain balanced group sizes...</p>
                </>
              )}
              {/* Large Sample Result */}
              {step === "largeResult" && (
                <>
                  <p className="result-description">
                    <strong>Selected sample size: Large</strong><br />
                    <strong>Environmental sources of bias: No</strong><br />
                    <strong>Strong covariates: No</strong>
                  </p>
                  <h4 className="result-heading">Recommended Method: Simple Randomization</h4>
                  <p className="result-description">With a large sample size, simple randomization can produce sufficiently balanced groups...</p>
                </>
              )}
              {/* Block and Stratified Randomization Result */}
              {step === "stratResult" && (
                 <>
                  {/* ... content ... */}
                   <p className="result-description">
                      <strong>Selected sample size: Large</strong><br />
                      <strong>Environmental sources of bias: Yes</strong><br />
                      <strong>Strong covariates: Yes</strong>
                    </p>
                    <h4 className="result-heading">Recommended Method: Block and Stratified Randomization</h4>
                    <p className="result-description">For larger studies with strong covariates and environmental variations...</p>
                 </>
              )}
              {/* Stratified Randomization Only Result */}
              {step === "stratOnlyResult" && (
                 <>
                  {/* ... content ... */}
                   <p className="result-description">
                      <strong>Selected sample size: Large</strong><br />
                      <strong>Environmental sources of bias: No</strong><br />
                      <strong>Strong covariates: Yes</strong>
                    </p>
                    <h4 className="result-heading">Recommended Method: Stratified Randomization</h4>
                    <p className="result-description">When important covariates need to be controlled, stratified randomization helps balance...</p>
                 </>
              )}
              {/* Block Randomization Result (for specific large sample path) */}
              {step === "blockResult" && (
                 <>
                  {/* ... content ... */}
                  <p className="result-description">
                      <strong>Selected sample size: Large</strong><br />
                      <strong>Environmental sources of bias: {envBias === "yes" ? "Yes" : "No"}</strong><br />
                      <strong>Strong covariates: No</strong>
                    </p>
                  <h4 className="result-heading">Recommended Method: Block Randomization</h4>
                  <p className="result-description">For larger studies with environmental variations to worry about...</p>
                 </>
              )}

              {/* Reset Button - Now inside result container which is inside question box */}
              <button onClick={handleReset} className="reset-button">
                Start Over
              </button>
            </div>
          )} {/* End of isResultStep conditional block */}

        </div> {/* === End of Left Box (question-box) === */}

        {/* === Right Box: Flowchart Visual === */}
        <div className="flowchart-visual-box">
           <FlowchartVisual
             step={step}
             sampleSize={sampleSize}
             envBias={envBias}
             hasStrongCovariates={hasStrongCovariates}
           />
        </div> {/* === End of Right Box === */}

      </div> {/* === End of content-boxes-container === */}

      {/* Results section is now removed from here */}

    </div> // End of flowchart-container
  );
}