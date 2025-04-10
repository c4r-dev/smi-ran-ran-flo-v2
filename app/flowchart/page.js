'use client';

import React, { Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Keep for potential back/reset navigation

// --- Component to Read Search Params ---
function FlowchartContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Retrieve data from query parameters
    const covariates = searchParams.get('covariates') || 'Not provided';
    const environmentString = searchParams.get('environment');
    const sampleSize = searchParams.get('sampleSize') || 'Not provided';

    // Safely parse the environment JSON string
    let environment = {};
    let environmentDisplay = 'Not provided';
    if (environmentString) {
        try {
            environment = JSON.parse(environmentString);
            // Create a display string for environment factors
            environmentDisplay = Object.entries(environment)
                                    .filter(([, checked]) => checked)
                                    .map(([key]) => key === 'none' ? 'None' : key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize keys for display
                                    .join(', ') || 'None selected';
        } catch (error) {
            console.error("Error parsing environment data:", error);
            environmentDisplay = 'Error parsing data';
        }
    }

    // --- RENDER ---
    // Replace this with your actual flowchart component and logic
    // This example just displays the received answers
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px', margin: '80px auto 20px auto', padding: '20px' }}>
            <h2>Flowchart Page</h2>
            <p>This page will display the flowchart based on your answers.</p>

            <div className="content-box" style={{ marginTop: '20px', width: '100%' }}>
                <h4 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Received Answers:</h4>
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', width: 'fit-content', margin: '0 auto' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Covariates:</strong> {covariates === 'one_or_more' ? 'One or more' : 'None'}</li>
                    <li style={{ marginBottom: '8px' }}><strong>Environmental Factors:</strong> {environmentDisplay}</li>
                    <li style={{ marginBottom: '8px' }}><strong>Sample Size:</strong> {sampleSize.charAt(0).toUpperCase() + sampleSize.slice(1)}</li>
                </ul>
            </div>

            {/* Add your flowchart visualization and logic here */}
            {/* e.g., <FlowchartDiagram answers={{ covariates, environment, sampleSize }} /> */}

            <button
                onClick={() => router.back()} // Go back to the previous page (questions)
                className="action-button"
                style={{ marginTop: '30px', background: '#6c757d' }}
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
        <Suspense fallback={<div>Loading answers...</div>}>
            <FlowchartContent />
        </Suspense>
    );
}