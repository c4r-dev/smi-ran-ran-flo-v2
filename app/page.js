'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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


// Initial modal content state
const initialModalContent = {
    title: '', questionSummary: '', heading: '', body: '', showReset: false
};

export default function WelcomePage() {
    const router = useRouter();
    // State variables - REMOVED currentStep
    const [covariates, setCovariates] = useState(''); // Q1
    const [environment, setEnvironment] = useState(initialEnvironmentState); // Q2
    const [sampleSize, setSampleSize] = useState(''); // Q3
    const [questionsFinished, setQuestionsFinished] = useState(false); // Still potentially useful
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(initialModalContent);

    // Reset function - REMOVED setCurrentStep
    const handleReset = () => {
        setCovariates('');
        setEnvironment(initialEnvironmentState);
        setSampleSize('');
        setQuestionsFinished(false);
        setIsModalOpen(false);
        setModalContent(initialModalContent);
    }

    // --- Question Logic (Simplified) ---

    // Q1 (Covariates): Update state and reset subsequent if modal was open
    const handleCovariatesChange = (event) => {
        setCovariates(event.target.value);
        // Reset subsequent steps only if modal was open, ensuring a fresh state
        if (isModalOpen) {
            setEnvironment(initialEnvironmentState);
            setSampleSize('');
            setQuestionsFinished(false);
            setIsModalOpen(false); // Close modal implicitly on new interaction
        }
    };
    // REMOVED handleGoToStep2 function

    // Q2 (Environment): Update state and reset subsequent if modal was open
    const handleEnvironmentChange = (event) => {
        const { name, checked } = event.target;
        setEnvironment(prevState => {
            const newState = { ...prevState };
            if (name === 'none') {
                // If 'None' is checked, uncheck everything else and check 'None'
                if (checked) {
                    for (const key in newState) newState[key] = false;
                    newState.none = true;
                } else {
                    // If 'None' is unchecked, just uncheck 'None'
                    newState.none = false;
                }
            } else {
                // If any other option is checked/unchecked
                newState[name] = checked;
                // If an option is checked, ensure 'None' is unchecked
                if (checked) newState.none = false;
            }
            // Reset subsequent step only if modal was open
            if (isModalOpen) {
                setSampleSize('');
                setQuestionsFinished(false);
                setIsModalOpen(false); // Close modal implicitly
            }
            return newState;
        });
    };
    // REMOVED handleGoToStep3 function

    // Q3 (Sample Size): Update state only
    const handleSampleSizeChange = (event) => {
        setSampleSize(event.target.value);
        // Reset finished/modal state if it was open
        if (questionsFinished || isModalOpen) {
            setQuestionsFinished(false);
            setIsModalOpen(false); // Close modal implicitly
        }
    };

    // Q3 (Sample Size): Button action -> Show Final Result/Modal - REMOVED currentStep check
    const handleFinishQuestions = () => {
        // Only proceed if all questions are answered
        if (isStepComplete(3)) {
            const covariatesAnswer = covariates === 'none' ? 'None' : 'One or more';
            // Check if any environment option *other than* 'none' is checked
            const environmentAnswer = Object.entries(environment)
                                          .filter(([key]) => key !== 'none')
                                          .some(([, isChecked]) => isChecked)
                                       ? 'Yes' : 'No';


            setQuestionsFinished(true); // Mark questions as finished

            let modalBody = '';
            let modalHeading = '';
            const modalSummary = `Covariates: ${covariatesAnswer}. Env Factors: ${environmentAnswer}. Sample Size: ${sampleSize.charAt(0).toUpperCase() + sampleSize.slice(1)}`;

            // Recommendation logic (remains the same)
            if (covariates === 'one_or_more' && environmentAnswer === 'Yes') {
                modalHeading = 'Block & Stratified Randomization';
                modalBody = 'With a large sample size, strong covariates, and environmental factors, using both Block and Stratified randomization provides the most control.';
            } else if (covariates === 'one_or_more' && environmentAnswer === 'No') {
                modalHeading = 'Stratified Randomization';
                modalBody = 'With a large sample size and strong covariates (but no significant environmental factors), Stratified randomization helps balance the covariates.';
            } else if (environmentAnswer === 'Yes') {
                modalHeading = 'Block Randomization';
                modalBody = 'Block randomization helps maintain balanced group sizes. For studies with environmental variations to worry about such time effects or different sites, block randomization can also create balance over time and place.';
            } else if (sampleSize === 'large') {
                modalHeading = 'Simple Randomization';
                modalBody = 'With a large sample size and no strong covariates or environmental factors to control for, simple randomization is often sufficient.';
            } else { // Handles small/moderate sample size with no covariates and no env factors
                modalHeading = 'Block Randomization';
                modalBody = 'For small and moderate studies with no strong covariates and no environmental variations to worry about, block randomization helps maintain balanced group sizes.';
            }

            setModalContent({
                title: 'Recommended method:',
                questionSummary: modalSummary,
                heading: modalHeading,
                body: modalBody,
                showReset: true
            });
            setIsModalOpen(true); // Open the modal
        }
    }
    // Close Modal Action
    const closeModal = () => setIsModalOpen(false);

    // Helper function check step completion (still useful for enabling final button)
    const isStepComplete = (step) => {
        if (step === 1) return !!covariates;
        if (step === 2) return !!covariates && Object.values(environment).some(isChecked => isChecked);
        if (step === 3) return !!covariates && Object.values(environment).some(isChecked => isChecked) && !!sampleSize;
        return false;
    };

    // --- RENDER ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* <h1>Welcome to the Randomization Method Selector</h1> */}
            <br />
            <p style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center' }}>
                This interactive flowchart guides researchers through selecting an appropriate randomization method for their study design. Users answer questions about their study characteristics to receive a recommended randomization approach with relevant considerations and implementation guidance.
            </p>

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
                                    disabled={isModalOpen} // REMOVED currentStep check
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
                                    disabled={isModalOpen} // REMOVED currentStep check
                                />
                                <label
                                    htmlFor="cov_one_or_more"
                                    style={{ fontWeight: covariates === 'one_or_more' ? 'bold' : 'normal' }}
                                >
                                    One or more
                                </label>
                            </div>
                        </div>
                        {/* REMOVED Next Question Button */}
                    </div>
                </div>

                {/* --- Question 2 --- */}
                {/* REMOVED visibility style */}
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
                                            disabled={isModalOpen} // REMOVED currentStep check
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
                                            disabled={isModalOpen} // REMOVED currentStep check
                                        />
                                        <label htmlFor={`env_${key}`}>
                                            {{ testing: 'Testing Order', personnel: 'Personnel', edge: 'Edge Effects', sites: 'Sites' }[key] || key}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* REMOVED Next Question Button */}
                    </div>
                </div>

                {/* --- Question 3 --- */}
                 {/* REMOVED visibility style */}
                <div className="content-box question-box-override">
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                        <h4 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>3. Sample size?</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px 20px', width: 'fit-content', maxWidth: '350px', marginBottom: '15px' }}>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="small" name="sampleSize" value="small" checked={sampleSize === 'small'} onChange={handleSampleSizeChange} disabled={isModalOpen} />
                                <label htmlFor="small" style={{ fontWeight: sampleSize === 'small' ? 'bold' : 'normal' }}>Small</label>
                            </div>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="moderate" name="sampleSize" value="moderate" checked={sampleSize === 'moderate'} onChange={handleSampleSizeChange} disabled={isModalOpen} />
                                <label htmlFor="moderate" style={{ fontWeight: sampleSize === 'moderate' ? 'bold' : 'normal' }}>Moderate</label>
                            </div>
                            <div className="radio-option" style={{ padding: '5px' }}>
                                <input type="radio" id="large" name="sampleSize" value="large" checked={sampleSize === 'large'} onChange={handleSampleSizeChange} disabled={isModalOpen} />
                                <label htmlFor="large" style={{ fontWeight: sampleSize === 'large' ? 'bold' : 'normal' }}>Large</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* End question grid container */}

            {/* --- Button and Modal --- */}
             {/* REMOVED currentStep check from condition */}
            {!isModalOpen && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={handleFinishQuestions} className="action-button" disabled={!isStepComplete(3)} style={{ opacity: !isStepComplete(3) ? 0.6 : 1, width: 'auto', padding: '10px 24px' }}> Show Recommendation </button>
                </div>
            )}
            {/* Modal remains the same */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {modalContent.title && <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{modalContent.title}</h4>}
                        {modalContent.questionSummary && <p style={{ fontStyle: 'italic', fontWeight:'bold', marginBottom: '15px', fontSize: '0.9em', color: '#555' }}>{modalContent.questionSummary}</p>}
                        {modalContent.heading && <h3 style={{ fontWeight: 'bold', marginBottom: '15px', marginTop: '0' }}>{modalContent.heading}</h3>}
                        {modalContent.body && <p style={{ fontSize: '0.9em', textAlign: 'center', marginBottom: '20px', padding: '0 10px' }}>{modalContent.body}</p>}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                            <button onClick={closeModal} className="action-button" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px', background: '#6c757d' }}>Close</button>
                            {modalContent.showReset && (
                                <button onClick={handleReset} className="action-button" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}>Start Over</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div> // End main page container
    );
}