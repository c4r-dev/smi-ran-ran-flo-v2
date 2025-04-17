'use client'; // Directive to mark as a Client Component

// Imports
import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Define environment keys directly here as they are static
const environmentKeys = [
    'none', 'time', 'batches', 'gradients', 'handling',
    'testing', 'personnel', 'edge', 'sites'
];
const midIndex = Math.ceil(environmentKeys.length / 2);
const envKeysCol1 = environmentKeys.slice(0, midIndex);
const envKeysCol2 = environmentKeys.slice(midIndex);

// Define labels for environment keys
const environmentLabels = {
    none: 'None', time: 'Time', batches: 'Batches', gradients: 'Gradients',
    handling: 'Handling', testing: 'Testing Order', personnel: 'Personnel',
    edge: 'Edge Effects', sites: 'Sites'
};


// --- Component to Read Search Params and Display Content ---
function FlowchartContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Retrieve data from query parameters (from app/page.js answers)
    const selectedCovariate = searchParams.get('covariates') || '';
    const environmentString = searchParams.get('environment');
    const selectedSampleSize = searchParams.get('sampleSize') || '';

    // Safely parse the environment JSON string
    let selectedEnvironment = {};
    if (environmentString) {
        try {
            selectedEnvironment = JSON.parse(environmentString);
        } catch (error) {
            console.error("Error parsing environment data:", error);
        }
    }

    // --- State for questions in the right box ---
    const [strongCovariates, setStrongCovariates] = useState(''); // New Q1 answer
    const [envBias, setEnvBias] = useState('');                   // New Q2 answer
    const [flowchartSampleSize, setFlowchartSampleSize] = useState(''); // New Q3 answer

    // --- State for Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recommendedMethodName, setRecommendedMethodName] = useState(''); // State for method name
    const [recommendedMethodDetails, setRecommendedMethodDetails] = useState(''); // State for method details

    // Helper function to determine font weight based on selection
    const getFontWeight = (isSelected) => (isSelected ? 'bold' : 'normal');
    // Helper function to conditionally add selected class
    const getSelectedClass = (isSelected) => (isSelected ? 'selected-disabled-option' : '');

    // --- Determine if all new questions are answered ---
    const allQuestionsAnswered = !!strongCovariates && !!envBias && !!flowchartSampleSize;

    // --- Function to determine recommendation and open the modal ---
    const handleShowRecommendation = () => {
        if (!allQuestionsAnswered) return; // Guard clause

        let methodName = '';
        let methodDetails = '';

        // Determine recommendation based on user's logic
        if (strongCovariates === 'yes' && envBias === 'yes') {
            methodName = 'Block and Stratified Randomization';
            methodDetails = 'For studies with strong covariates and environmental variations to worry about, block randomization and stratified randomization work together to balance selected covariates, and balance groups over time and place.';
        } else if (strongCovariates === 'yes' && envBias === 'no') {
            methodName = 'Stratified Randomization';
            methodDetails = 'When important covariates need to be controlled, stratified randomization helps balance selected covariates across treatment groups.';
        } else if (strongCovariates === 'no' && envBias === 'yes') {
            methodName = 'Block Randomization';
            methodDetails = 'For studies with environmental variations to worry about such time effects or different sites, block randomization can also create balance over time and place.';
        } else if (strongCovariates === 'no' && envBias === 'no') {
            if (flowchartSampleSize === 'small_moderate') {
                methodName = 'Block Randomization';
                // Using the same details as the Block case above, as specified
                methodDetails = 'For studies with environmental variations to worry about such time effects or different sites, block randomization can also create balance over time and place.';
            } else if (flowchartSampleSize === 'large') {
                methodName = 'Simple randomization';
                methodDetails = 'With a large sample size, simple randomization can produce sufficiently balanced groups. If you do not need to consider environmental sources of bias or strong covariates, simple is easy to implement and interpret.';
            }
        }

        // Update state with determined recommendation
        setRecommendedMethodName(methodName);
        setRecommendedMethodDetails(methodDetails);

        // Open the modal
        setIsModalOpen(true);
    };

    // --- Function to close the modal ---
    const closeModal = () => {
        setIsModalOpen(false);
        // Optionally reset recommendation state if desired when closing
        // setRecommendedMethodName('');
        // setRecommendedMethodDetails('');
    };

    // --- RENDER ---
    return (
        // Added id="flowchart-page-container"
        <div id="flowchart-page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', margin: '80px auto 20px auto', padding: '20px' }}>

            <div className="content-boxes-container" style={{ width: '100%', marginBottom: '30px', alignItems: 'stretch' }}>

                {/* Left Column: Display Provided Answers */}
                <div className="question-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <h4 style={{ marginBottom: '20px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Study Characteristics (Provided Answers)</h4>
                     {/* Question 1 Display */}
                     <div style={{ marginBottom: '25px' }}>
                        <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>1. Known important covariates / prognostic factors?</h5>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                            <div className={`radio-option ${getSelectedClass(selectedCovariate === 'none')}`} style={{ padding: '5px' }}>
                                <input type="radio" id="disp_cov_none" name="disp_covariates" value="none" checked={selectedCovariate === 'none'} disabled readOnly />
                                <label htmlFor="disp_cov_none" style={{ fontWeight: getFontWeight(selectedCovariate === 'none'), cursor: 'default' }}>None</label>
                            </div>
                            <div className={`radio-option ${getSelectedClass(selectedCovariate === 'one_or_more')}`} style={{ padding: '5px' }}>
                                <input type="radio" id="disp_cov_one_or_more" name="disp_covariates" value="one_or_more" checked={selectedCovariate === 'one_or_more'} disabled readOnly />
                                <label htmlFor="disp_cov_one_or_more" style={{ fontWeight: getFontWeight(selectedCovariate === 'one_or_more'), cursor: 'default' }}>One or more</label>
                            </div>
                        </div>
                     </div>

                     {/* Question 2 Display */}
                     <div style={{ marginBottom: '25px' }}>
                         <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>2. Potential sources of environmental variation?</h5>
                         <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', width: '100%', maxWidth: '450px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                {envKeysCol1.map((key) => {
                                    const isSelected = !!selectedEnvironment[key];
                                    return (
                                        <div key={`disp_${key}`} className={`checkbox-option ${getSelectedClass(isSelected)}`}>
                                            <input type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`} checked={isSelected} disabled readOnly />
                                            <label htmlFor={`disp_env_${key}`} style={{ fontWeight: getFontWeight(isSelected), cursor: 'default' }}>{environmentLabels[key] || key}</label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                {envKeysCol2.map((key) => {
                                    const isSelected = !!selectedEnvironment[key];
                                    return (
                                        <div key={`disp_${key}`} className={`checkbox-option ${getSelectedClass(isSelected)}`}>
                                            <input type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`} checked={isSelected} disabled readOnly />
                                            <label htmlFor={`disp_env_${key}`} style={{ fontWeight: getFontWeight(isSelected), cursor: 'default' }}>{environmentLabels[key] || key}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                     </div>

                     {/* Question 3 Display */}
                     <div style={{ marginBottom: '15px' }}>
                        <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>3. Sample size?</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                            <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'small')}`} style={{ padding: '5px' }}>
                                <input type="radio" id="disp_small" name="disp_sampleSize" value="small" checked={selectedSampleSize === 'small'} disabled readOnly />
                                <label htmlFor="disp_small" style={{ fontWeight: getFontWeight(selectedSampleSize === 'small'), cursor: 'default' }}>Small</label>
                            </div>
                            <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'moderate')}`} style={{ padding: '5px' }}>
                                <input type="radio" id="disp_moderate" name="disp_sampleSize" value="moderate" checked={selectedSampleSize === 'moderate'} disabled readOnly />
                                <label htmlFor="disp_moderate" style={{ fontWeight: getFontWeight(selectedSampleSize === 'moderate'), cursor: 'default' }}>Moderate</label>
                            </div>
                            <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'large')}`} style={{ padding: '5px' }}>
                                <input type="radio" id="disp_large" name="disp_sampleSize" value="large" checked={selectedSampleSize === 'large'} disabled readOnly />
                                <label htmlFor="disp_large" style={{ fontWeight: getFontWeight(selectedSampleSize === 'large'), cursor: 'default' }}>Large</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: New Questions */}
                <div className="flowchart-visual-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <h4 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Flowchart / Next Steps</h4>
                     {/* Container for the new questions */}
                     <div style={{ textAlign: 'left', width: '100%', marginTop: '5px', flexGrow: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '25px' }}>

                        {/* New Question 1 */}
                        <div>
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>1. Are there strong covariates you need to control for?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="strong_cov_yes" name="strongCovariates" value="yes" checked={strongCovariates === 'yes'} onChange={(e) => setStrongCovariates(e.target.value)} />
                                    <label htmlFor="strong_cov_yes" style={{ fontWeight: strongCovariates === 'yes' ? 'bold' : 'normal' }}>Yes</label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="strong_cov_no" name="strongCovariates" value="no" checked={strongCovariates === 'no'} onChange={(e) => setStrongCovariates(e.target.value)} />
                                    <label htmlFor="strong_cov_no" style={{ fontWeight: strongCovariates === 'no' ? 'bold' : 'normal' }}>No</label>
                                </div>
                            </div>
                        </div>

                        {/* New Question 2 */}
                        <div>
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>2. Are there environmental sources of bias you need to control for?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="env_bias_yes" name="envBias" value="yes" checked={envBias === 'yes'} onChange={(e) => setEnvBias(e.target.value)} />
                                    <label htmlFor="env_bias_yes" style={{ fontWeight: envBias === 'yes' ? 'bold' : 'normal' }}>Yes</label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="env_bias_no" name="envBias" value="no" checked={envBias === 'no'} onChange={(e) => setEnvBias(e.target.value)} />
                                    <label htmlFor="env_bias_no" style={{ fontWeight: envBias === 'no' ? 'bold' : 'normal' }}>No</label>
                                </div>
                            </div>
                        </div>

                        {/* New Question 3 */}
                         <div>
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>3. What is your sample size?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="flowchart_ss_small_mod" name="flowchartSampleSize" value="small_moderate" checked={flowchartSampleSize === 'small_moderate'} onChange={(e) => setFlowchartSampleSize(e.target.value)} />
                                    <label htmlFor="flowchart_ss_small_mod" style={{ fontWeight: flowchartSampleSize === 'small_moderate' ? 'bold' : 'normal' }}>Small to Moderate</label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="flowchart_ss_large" name="flowchartSampleSize" value="large" checked={flowchartSampleSize === 'large'} onChange={(e) => setFlowchartSampleSize(e.target.value)} />
                                    <label htmlFor="flowchart_ss_large" style={{ fontWeight: flowchartSampleSize === 'large' ? 'bold' : 'normal' }}>Large</label>
                                </div>
                            </div>
                        </div>

                     </div>
                </div>

            </div>

            {/* Added className="button-container" */}
            <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', width: '100%', flexWrap: 'wrap' }}>
                {/* Start Over Button */}
                <button
                    onClick={() => router.back()}
                    className="action-button"
                    style={{ background: '#6c757d' }}
                >
                    Start Over
                </button>

                {/* Randomization Method Button (triggers modal) */}
                <button
                    onClick={handleShowRecommendation}
                    className="action-button"
                    disabled={!allQuestionsAnswered} // Enable only when all answers are selected
                >
                    RANDOMIZATION METHOD
                </button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}> {/* Close on overlay click */}
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside content */}
                        <h3 style={{marginTop: 0, marginBottom: '10px'}}>Recommended Method</h3>
                        {/* Display Determined Recommendation */}
                        <p style={{marginBottom: '8px'}}>
                            <strong>{recommendedMethodName || 'Error: Could not determine method.'}</strong>
                        </p>
                        <p style={{marginTop: 0, marginBottom: '20px', textAlign: 'left'}}>
                            {recommendedMethodDetails || 'No details available.'}
                        </p>

                        <button
                            onClick={closeModal}
                            className="action-button"
                            style={{marginTop: '10px'}} // Adjusted margin
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* --- END MODAL --- */}

        </div> // End main container div (#flowchart-page-container)
    );
}

// --- Main Exported Component with Suspense ---
export default function FlowchartPage() {
    // This wrapper component handles Suspense for loading
    return (
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: '100px'}}>Loading answers...</div>}>
            <FlowchartContent />
        </Suspense>
    );
}