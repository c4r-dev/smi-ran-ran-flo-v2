'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Keep useRouter

// Initial state for environment checkboxes
const initialEnvironmentState = {
    none: false, time: false, batches: false, gradients: false,
    handling: false, testing: false, personnel: false, edge: false, sites: false,
};
// Get keys for environment options to split into columns
const environmentKeys = Object.keys(initialEnvironmentState);
const midIndex = Math.ceil(environmentKeys.length / 2);
const envKeysCol1 = environmentKeys.slice(0, midIndex);
const envKeysCol2 = environmentKeys.slice(midIndex);

// REMOVED initialModalContent state

export default function WelcomePage() {
    const router = useRouter(); // Initialize router
    // State variables
    const [covariates, setCovariates] = useState(''); // Q1
    const [environment, setEnvironment] = useState(initialEnvironmentState); // Q2
    const [sampleSize, setSampleSize] = useState(''); // Q3
    // REMOVED questionsFinished state
    // REMOVED isModalOpen state
    // REMOVED modalContent state

    // Reset function - Simplified
    const handleReset = () => {
        setCovariates('');
        setEnvironment(initialEnvironmentState);
        setSampleSize('');
        // REMOVED modal related resets
    }

    // --- Question Logic (Simplified, Removed modal checks) ---

    // Q1 (Covariates): Update state
    const handleCovariatesChange = (event) => {
        setCovariates(event.target.value);
        // Reset subsequent steps (optional, keep if desired)
        setEnvironment(initialEnvironmentState);
        setSampleSize('');
    };

    // Q2 (Environment): Update state
    const handleEnvironmentChange = (event) => {
        const { name, checked } = event.target;
        setEnvironment(prevState => {
            const newState = { ...prevState };
            if (name === 'none') {
                if (checked) {
                    for (const key in newState) newState[key] = false;
                    newState.none = true;
                } else {
                    newState.none = false;
                }
            } else {
                newState[name] = checked;
                if (checked) newState.none = false;
            }
            // Reset subsequent step (optional, keep if desired)
            setSampleSize('');
            return newState;
        });
    };

    // Q3 (Sample Size): Update state only
    const handleSampleSizeChange = (event) => {
        setSampleSize(event.target.value);
    };

    // MODIFIED: Button action -> Navigate to Flowchart page
    const handleContinue = () => {
        if (isStepComplete(3)) {
            // Prepare data for query parameters
            const queryParams = new URLSearchParams({
                covariates: covariates,
                // Stringify the environment object to pass it in the URL
                environment: JSON.stringify(environment),
                sampleSize: sampleSize
            });

            // Navigate to the flowchart page with answers in query string
            router.push(`/flowchart?${queryParams.toString()}`);
        }
    }

    // REMOVED closeModal function

    // Helper function check step completion (still useful for enabling button)
    const isStepComplete = (step) => {
        if (step === 1) return !!covariates;
        if (step === 2) return !!covariates && Object.values(environment).some(isChecked => isChecked);
        if (step === 3) return !!covariates && Object.values(environment).some(isChecked => isChecked) && !!sampleSize;
        return false;
    };

    // --- RENDER ---
    return (
        // Keep the overall structure, but remove modal-related disabled states if not needed
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* ... Intro text ... */}
             <br />
            {/* <p style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center' }}>
                This interactive flowchart guides researchers through selecting an appropriate randomization method for their study design. Users answer questions about their study characteristics to receive a recommended randomization approach with relevant considerations and implementation guidance.
            </p> */}

            {/* --- Container for Questions --- */}
            <div className="question-grid">

                {/* --- Question 1 --- */}
                <div className="content-box question-box-override">
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                        <h4 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>1. Known important covariates / prognostic factors?</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px 20px', width: 'fit-content', maxWidth: '300px', marginBottom: '15px' }}>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input
                                    type="radio"
                                    id="cov_none"
                                    name="covariates"
                                    value="none"
                                    checked={covariates === 'none'}
                                    onChange={handleCovariatesChange}
                                    // disabled={isModalOpen} // REMOVED
                                />
                                <label
                                    htmlFor="cov_none"
                                    style={{ fontWeight: covariates === 'none' ? 'bold' : 'normal' }}
                                >
                                    None
                                </label>
                            </div>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input
                                    type="radio"
                                    id="cov_one_or_more"
                                    name="covariates"
                                    value="one_or_more"
                                    checked={covariates === 'one_or_more'}
                                    onChange={handleCovariatesChange}
                                     // disabled={isModalOpen} // REMOVED
                                />
                                <label
                                    htmlFor="cov_one_or_more"
                                    style={{ fontWeight: covariates === 'one_or_more' ? 'bold' : 'normal' }}
                                >
                                    One or more
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* --- Question 2 --- */}
                <div className="content-box question-box-override">
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                        <h4 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>2. Potential sources of environmental variation?</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', width: '100%', maxWidth: '450px', marginBottom: '15px' }}>
                            {/* Column 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                {envKeysCol1.map((key) => (
                                    <div key={key} className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            id={`env_${key}`}
                                            name={key}
                                            checked={environment[key]}
                                            onChange={handleEnvironmentChange}
                                            // disabled={isModalOpen} // REMOVED
                                        />
                                        <label htmlFor={`env_${key}`}>
                                            {{ none: 'None', time: 'Time', batches: 'Batches', gradients: 'Gradients', handling: 'Handling' }[key] || key}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {/* Column 2 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                {envKeysCol2.map((key) => (
                                    <div key={key} className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            id={`env_${key}`}
                                            name={key}
                                            checked={environment[key]}
                                            onChange={handleEnvironmentChange}
                                             // disabled={isModalOpen} // REMOVED
                                        />
                                        <label htmlFor={`env_${key}`}>
                                            {{ testing: 'Testing Order', personnel: 'Personnel', edge: 'Edge Effects', sites: 'Sites' }[key] || key}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Question 3 --- */}
                <div className="content-box question-box-override">
                     <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                        <h4 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>3. Sample size?</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px 20px', width: 'fit-content', maxWidth: '350px', marginBottom: '15px' }}>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="small" name="sampleSize" value="small" checked={sampleSize === 'small'} onChange={handleSampleSizeChange} /* disabled={isModalOpen} REMOVED */ />
                                <label htmlFor="small" style={{ fontWeight: sampleSize === 'small' ? 'bold' : 'normal' }}>Small</label>
                            </div>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="moderate" name="sampleSize" value="moderate" checked={sampleSize === 'moderate'} onChange={handleSampleSizeChange} /* disabled={isModalOpen} REMOVED */ />
                                <label htmlFor="moderate" style={{ fontWeight: sampleSize === 'moderate' ? 'bold' : 'normal' }}>Moderate</label>
                            </div>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="large" name="sampleSize" value="large" checked={sampleSize === 'large'} onChange={handleSampleSizeChange} /* disabled={isModalOpen} REMOVED */ />
                                <label htmlFor="large" style={{ fontWeight: sampleSize === 'large' ? 'bold' : 'normal' }}>Large</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* End question grid container */}

            {/* --- Buttons Section (Swapped Order) --- */}
             {/* REMOVED !isModalOpen check */}
             <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                 {/* Start Over button is now first */}
                <button
                    onClick={handleReset}
                    className="action-button"
                    style={{ background: '#6c757d', marginRight: '15px', width: 'auto', padding: '10px 24px' }}>
                        Start Over
                </button>
                {/* Continue button is now second */}
                <button
                    onClick={handleContinue}
                    className="action-button"
                    disabled={!isStepComplete(3)}
                    style={{ opacity: !isStepComplete(3) ? 0.6 : 1, width: 'auto', padding: '10px 24px' }}>
                        CONTINUE
                </button>
            </div>

            {/* REMOVED Modal */}

        </div> // End main page container
    );
}