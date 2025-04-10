'use client';

import React, { Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Keep for potential back/reset navigation

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


// --- Component to Read Search Params ---
function FlowchartContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Retrieve data from query parameters
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

    // Helper function to determine font weight based on selection
    const getFontWeight = (isSelected) => (isSelected ? 'bold' : 'normal');
    // Helper function to conditionally add selected class
    const getSelectedClass = (isSelected) => (isSelected ? 'selected-disabled-option' : '');

    // --- RENDER ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', margin: '80px auto 20px auto', padding: '20px' }}>

            <div className="content-boxes-container" style={{ width: '100%', marginBottom: '30px', alignItems: 'stretch' }}>

                {/* Left Column: Questions and Answers Displayed */}
                <div className="question-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '20px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Study Characteristics (Provided Answers)</h4>
                    <div style={{ textAlign: 'left', width: '100%', flexGrow: 1 }}>

                         {/* Question 1 Display */}
                         <div style={{ marginBottom: '25px' }}>
                            <h5 style={{ marginBottom: '8px', fontWeight: 'bold', width: '100%' }}>1. Known important covariates / prognostic factors?</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', width: 'fit-content' }}>
                                {/* Option 1 */}
                                <div className={`radio-option ${getSelectedClass(selectedCovariate === 'none')}`} style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_cov_none" name="disp_covariates" value="none" checked={selectedCovariate === 'none'} disabled readOnly />
                                    <label htmlFor="disp_cov_none" style={{ fontWeight: getFontWeight(selectedCovariate === 'none'), cursor: 'default' }}>
                                        None
                                    </label>
                                </div>
                                {/* Option 2 */}
                                <div className={`radio-option ${getSelectedClass(selectedCovariate === 'one_or_more')}`} style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_cov_one_or_more" name="disp_covariates" value="one_or_more" checked={selectedCovariate === 'one_or_more'} disabled readOnly />
                                    <label htmlFor="disp_cov_one_or_more" style={{ fontWeight: getFontWeight(selectedCovariate === 'one_or_more'), cursor: 'default' }}>
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
                                    {envKeysCol1.map((key) => {
                                        const isSelected = !!selectedEnvironment[key];
                                        return (
                                            <div key={`disp_${key}`} className={`checkbox-option ${getSelectedClass(isSelected)}`}>
                                                <input type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`} checked={isSelected} disabled readOnly />
                                                <label htmlFor={`disp_env_${key}`} style={{ fontWeight: getFontWeight(isSelected), cursor: 'default' }}>
                                                    {environmentLabels[key] || key}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Column 2 */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                    {envKeysCol2.map((key) => {
                                        const isSelected = !!selectedEnvironment[key];
                                        return (
                                            <div key={`disp_${key}`} className={`checkbox-option ${getSelectedClass(isSelected)}`}>
                                                <input type="checkbox" id={`disp_env_${key}`} name={`disp_${key}`} checked={isSelected} disabled readOnly />
                                                <label htmlFor={`disp_env_${key}`} style={{ fontWeight: getFontWeight(isSelected), cursor: 'default' }}>
                                                    {environmentLabels[key] || key}
                                                </label>
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
                                {/* Option 1 */}
                                <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'small')}`} style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_small" name="disp_sampleSize" value="small" checked={selectedSampleSize === 'small'} disabled readOnly />
                                    <label htmlFor="disp_small" style={{ fontWeight: getFontWeight(selectedSampleSize === 'small'), cursor: 'default' }}>Small</label>
                                </div>
                                {/* Option 2 */}
                                <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'moderate')}`} style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_moderate" name="disp_sampleSize" value="moderate" checked={selectedSampleSize === 'moderate'} disabled readOnly />
                                    <label htmlFor="disp_moderate" style={{ fontWeight: getFontWeight(selectedSampleSize === 'moderate'), cursor: 'default' }}>Moderate</label>
                                </div>
                                {/* Option 3 */}
                                <div className={`radio-option ${getSelectedClass(selectedSampleSize === 'large')}`} style={{ padding: '5px' }}>
                                    <input type="radio" id="disp_large" name="disp_sampleSize" value="large" checked={selectedSampleSize === 'large'} disabled readOnly />
                                    <label htmlFor="disp_large" style={{ fontWeight: getFontWeight(selectedSampleSize === 'large'), cursor: 'default' }}>Large</label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Placeholder */}
                <div className="flowchart-visual-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <h4 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign:'center', width:'100%' }}>Flowchart / Next Steps</h4>
                     <div style={{ textAlign: 'center', width: '100%', marginTop: '20px', flexGrow: 1 }}>
                        <p><em>Future questions or flowchart visualization will appear here based on the answers provided.</em></p>
                     </div>
                </div>

            </div>

            <button onClick={() => router.back()} className="action-button" style={{ background: '#6c757d' }}>
                Back to Questions
            </button>
        </div>
    );
}

// --- Main Exported Component with Suspense ---
export default function FlowchartPage() {
    return (
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: '100px'}}>Loading answers...</div>}>
            <FlowchartContent />
        </Suspense>
    );
}