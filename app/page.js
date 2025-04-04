'use client';

import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function WelcomePage() {
  const router = useRouter();

  // Function to handle button click
  const handleContinue = () => {
    router.push('/flowchart'); // Navigate to the flowchart page
  };

  return (
    // Basic styling to center the content
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to the Randomization Method Selector</h1>
      <p style={{ marginTop: '10px', marginBottom: '20px' }}>
        This tool helps guide researchers in selecting appropriate randomization methods. Click continue to start the interactive flowchart.
      </p>
      {/* Use the existing action-button style from globals.css */}
      <button onClick={handleContinue} className="action-button">
        Continue
      </button>
    </div>
  );
}