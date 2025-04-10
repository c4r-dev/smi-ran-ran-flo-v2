'use client';

import React, { Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Keep for potential back/reset navigation

// Define environment keys directly here as they are static
// Matches the structure in /app/page.js
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


// --- Component to Read Search Params ---
function FlowchartContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Retrieve data from query parameters
    const selectedCovariate = searchParams.get('covariates') || ''; // Use empty string if not provided
    const environmentString = searchParams.get('environment');
    const selectedSampleSize = searchParams.get('sampleSize') || ''; // Use empty string if not provided

    // Safely parse the environment JSON string
    let selectedEnvironment = {}; // Use empty object if not provided or error
    if (environmentString) {
        try {
            selectedEnvironment = JSON.parse(environmentString);
        } catch (error) {
            console.error("Error parsing environment data:", error);
            // Keep selectedEnvironment as an empty object on error
        }
    }

    // --- RENDER ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', margin: '80px auto 20px auto', padding: '20px' }}>

            {/* Use the existing container class from globals.css for the two-column layout */}
            <div className="content-boxes-container" style={{ width: '100%', marginBottom: '30px', alignItems: 'stretch' }}> {/* Align stretch */}

                {/* Left Column: Questions and Answers Displayed */}
                {/* Use the existing question-box class or content-box */}
                <div className="question-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}> {/* Added flex styles */}
                    <h4 style={{ marginBottom: '20px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Study Characteristics (Provided Answers)</h4>
                    <div style={{ textAlign: 'left', width: '100%', flexGrow: 1 }}> {/* Added flexGrow */}

                         {/* Question 1 Display */}
                         <div style={{ marginBottom: '25px' }}>
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>1. Known important covariates / prognostic factors?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input
                                        type="radio" id="disp_cov_none" name="disp_covariates" value="none"
                                        checked={selectedCovariate === 'none'}
                                        disabled // Disable input
                                        readOnly // Prevent interaction just in case
                                    />
                                    <label
                                        htmlFor="disp_cov_none"
                                        style={{ fontWeight: selectedCovariate === 'none' ? 'bold' : 'normal', cursor: 'default' }} // Bold if selected, default cursor
                                    >
                                        None
                                    </label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input
                                        type="radio" id="disp_cov_one_or_more" name="disp_covariates" value="one_or_more"
                                        checked={selectedCovariate === 'one_or_more'}
                                        disabled // Disable input
                                        readOnly
                                    />
                                    <label
                                        htmlFor="disp_cov_one_or_more"
                                        style={{ fontWeight: selectedCovariate === 'one_or_more' ? 'bold' : 'normal', cursor: 'default' }} // Bold if selected
                                    >
                                        One or more
                                    </label>
                                </div>
                            </div>
                         </div>

                         {/* Question 2 Display */}
                         <div style={{ marginBottom: '25px' }}>
                             <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>2. Potential sources of environmental variation?</h5>
                             <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', width: '100%', maxWidth: '450px' }}>
                                {/* Column 1 */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                    {envKeysCol1.map((key) => (
                                        <div key={`disp_${key}`} className="checkbox-option">
                                            <input
                                                type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`}
                                                checked={!!selectedEnvironment[key]} // Check if key exists and is true-like
                                                disabled // Disable input
                                                readOnly
                                            />
                                            <label
                                                htmlFor={`disp_env_${key}`}
                                                style={{ fontWeight: selectedEnvironment[key] ? 'bold' : 'normal', cursor: 'default' }} // Bold if selected
                                            >
                                                {environmentLabels[key] || key}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {/* Column 2 */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                    {envKeysCol2.map((key) => (
                                        <div key={`disp_${key}`} className="checkbox-option">
                                            <input
                                                type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`}
                                                checked={!!selectedEnvironment[key]} // Check if key exists and is true-like
                                                disabled // Disable input
                                                readOnly
                                            />
                                            <label
                                                htmlFor={`disp_env_${key}`}
                                                style={{ fontWeight: selectedEnvironment[key] ? 'bold' : 'normal', cursor: 'default' }} // Bold if selected
                                            >
                                                {environmentLabels[key] || key}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>

                         {/* Question 3 Display */}
                         <div style={{ marginBottom: '15px' }}> {/* Less margin bottom for last item */}
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>3. Sample size?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_small" name="disp_sampleSize" value="small" checked={selectedSampleSize === 'small'} disabled readOnly />
                                    <label htmlFor="disp_small" style={{ fontWeight: selectedSampleSize === 'small' ? 'bold' : 'normal', cursor: 'default' }}>Small</label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_moderate" name="disp_sampleSize" value="moderate" checked={selectedSampleSize === 'moderate'} disabled readOnly />
                                    <label htmlFor="disp_moderate" style={{ fontWeight: selectedSampleSize === 'moderate' ? 'bold' : 'normal', cursor: 'default' }}>Moderate</label>
                                </div>
                                <div className="radio-option" style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_large" name="disp_sampleSize" value="large" checked={selectedSampleSize === 'large'} disabled readOnly />
                                    <label htmlFor="disp_large" style={{ fontWeight: selectedSampleSize === 'large' ? 'bold' : 'normal', cursor: 'default' }}>Large</label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Placeholder for Future Questions */}
                 {/* Use the existing flowchart-visual-box class or content-box */}
                <div className="flowchart-visual-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}> {/* Added flex styles */}
                     <h4 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Flowchart / Next Steps</h4>
                     <div style={{ textAlign: 'center', width: '100%', marginTop: '20px', flexGrow: 1 }}> {/* Added flexGrow */}
                        {/* Placeholder for future flowchart or questions */}
                        <p><em>Future questions or flowchart visualization will appear here based on the answers provided.</em></p>
                     </div>
                </div>

            </div>

            {/* Button remains below the columns */}
            <button
                onClick={() => router.back()} // Go back to the previous page (questions)
                className="action-button"
                style={{ background: '#6c757d' }} // Keep gray style for back button
            >
                Back to Questions
            </button>
        </div>
    );
}

// --- Main Exported Component with Suspense ---
export default function FlowchartPage() {
    // Wrap the component that uses useSearchParams in Suspense
    return (
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: '100px'}}>Loading answers...</div>}>
            <FlowchartContent />
        </Suspense>
    );
}