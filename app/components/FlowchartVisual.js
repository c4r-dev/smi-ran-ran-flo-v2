// components/FlowchartVisual.js
import React from 'react';

const FlowchartVisual = ({ step, sampleSize, envBias, hasStrongCovariates }) => {
  // Helper function to determine if a path/node is active
  const isActive = (elementId) => {
    // (Keep the existing isActive function logic as it was correct)
     switch (elementId) {
      // Nodes
      case 'start':
        return step === 'initial';
      case 'q_sample_size':
        return step === 'initial';
      case 'q_env_bias':
        return ['environmentalBiasQuestion', 'covariatesQuestion', 'largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step) && sampleSize === 'large';
      case 'q_covariates':
        return step === 'covariatesQuestion';
      case 'res_block_small':
         return step === 'blockRecommendation' && (sampleSize === 'small' || sampleSize === 'moderate');
      case 'res_block_large_env':
        return step === 'blockResult' && sampleSize === 'large' && envBias === 'yes';
      case 'res_simple':
        return step === 'largeResult';
      case 'res_strat':
        return step === 'stratOnlyResult';
      case 'res_block_strat':
        return step === 'stratResult';

      // Paths
      case 'path_start_q_sample':
        return step === 'initial';
      case 'path_sample_small_res_block':
        return (step === 'blockRecommendation' && (sampleSize === 'small' || sampleSize === 'moderate'));
      case 'path_sample_large_q_env':
        return ['environmentalBiasQuestion', 'covariatesQuestion', 'largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step) && sampleSize === 'large';
      case 'path_env_q_cov':
        return ['covariatesQuestion', 'largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step) && sampleSize === 'large';
       case 'path_cov_yes_env_yes_res_block_strat':
         return step === 'stratResult';
       case 'path_cov_no_env_yes_res_block_large':
         return step === 'blockResult' && envBias === 'yes';
       case 'path_cov_yes_env_no_res_strat':
         return step === 'stratOnlyResult';
       case 'path_cov_no_env_no_res_simple':
         return step === 'largeResult';

      default:
        return false;
    }
  };

  const getActiveClass = (id) => (isActive(id) ? 'active' : '');
  // Use active marker ID if path is active
  const getActiveMarker = (id) => (isActive(id) ? 'url(#arrowhead-active)' : 'url(#arrowhead)');


  // Dimensions and Spacing
  const boxWidth = 150;
  const boxHeight = 60;
  const hSpace = 70; // Adjusted horizontal space
  const vSpace = 70; // Adjusted vertical space

  // Base Coordinates
  const svgWidth = 800;
  const svgHeight = 650; // Increased height slightly more
  const startX = svgWidth / 2 - boxWidth / 2; // Center Start node
  const startY = 20;

  // Level 1: Sample Size Question
  const qSampleSizeX = startX;
  const qSampleSizeY = startY + boxHeight + vSpace;

  // Level 2: Block Result (Left) & Env Bias Question (Right)
  const resBlockSmallX = qSampleSizeX - boxWidth / 2 - hSpace;
  const resBlockSmallY = qSampleSizeY + boxHeight + vSpace;
  const qEnvBiasX = qSampleSizeX + boxWidth / 2 + hSpace;
  const qEnvBiasY = resBlockSmallY; // Same level

  // Level 3: Covariates Question (Below Env Bias)
  const qCovariatesX = qEnvBiasX;
  const qCovariatesY = qEnvBiasY + boxHeight + vSpace;

  // Level 4: Final Results (Relative to Covariates)
  const resSimpleX = qCovariatesX + boxWidth / 2 + hSpace; // Far right
  const resSimpleY = qCovariatesY;
  const resBlockLargeX = qCovariatesX - boxWidth / 2 - hSpace; // Far left
  const resBlockLargeY = qCovariatesY;
  const resStratX = resBlockLargeX; // Below Block Large
  const resStratY = qCovariatesY + boxHeight + vSpace;
  const resBlockStratX = resSimpleX; // Below Simple
  const resBlockStratY = qCovariatesY + boxHeight + vSpace;


  return (
    <svg width={svgWidth} height={svgHeight} className="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
       {/* Arrowhead Definitions - Using refX="0" */}
       <defs>
         <marker id="arrowhead" markerWidth="10" markerHeight="7"
           refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
           <polygon points="0 0, 10 3.5, 0 7" fill="#999" /> {/* Darker gray for visibility */}
         </marker>
         <marker id="arrowhead-active" markerWidth="10" markerHeight="7"
           refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
           <polygon points="0 0, 10 3.5, 0 7" fill="#1976d2" /> {/* Darker Active blue */}
         </marker>
       </defs>

      {/* Nodes (Boxes) - Using updated positions */}
      {/* (Node definitions remain the same, just using updated X/Y vars) */}
      <g id="start" className={`node ${getActiveClass('start')}`}>
        <rect x={startX} y={startY} width={boxWidth} height={boxHeight} />
        <text x={startX + boxWidth / 2} y={startY + boxHeight / 2} >Start</text>
      </g>
      <g id="q_sample_size" className={`node ${getActiveClass('q_sample_size')}`}>
        <rect x={qSampleSizeX} y={qSampleSizeY} width={boxWidth} height={boxHeight} />
        <text x={qSampleSizeX + boxWidth / 2} y={qSampleSizeY + boxHeight / 2} >Sample Size?</text>
      </g>
      <g id="q_env_bias" className={`node ${getActiveClass('q_env_bias')}`}>
        <rect x={qEnvBiasX} y={qEnvBiasY} width={boxWidth} height={boxHeight} />
        <text x={qEnvBiasX + boxWidth / 2} y={qEnvBiasY + boxHeight / 2}>Env Bias?</text>
      </g>
      <g id="q_covariates" className={`node ${getActiveClass('q_covariates')}`}>
        <rect x={qCovariatesX} y={qCovariatesY} width={boxWidth} height={boxHeight} />
        <text x={qCovariatesX + boxWidth / 2} y={qCovariatesY + boxHeight / 2}>Covariates?</text>
      </g>
      <g id="res_block_small" className={`node result ${getActiveClass('res_block_small')}`}>
        <rect x={resBlockSmallX} y={resBlockSmallY} width={boxWidth} height={boxHeight} />
        <text x={resBlockSmallX + boxWidth / 2} y={resBlockSmallY + boxHeight / 2}>Block</text>
      </g>
      <g id="res_block_large_env" className={`node result ${getActiveClass('res_block_large_env')}`}>
        <rect x={resBlockLargeX} y={resBlockLargeY} width={boxWidth} height={boxHeight} />
        <text x={resBlockLargeX + boxWidth / 2} y={resBlockLargeY + boxHeight / 2} >Block</text>
      </g>
      <g id="res_simple" className={`node result ${getActiveClass('res_simple')}`}>
        <rect x={resSimpleX} y={resSimpleY} width={boxWidth} height={boxHeight} />
        <text x={resSimpleX + boxWidth / 2} y={resSimpleY + boxHeight / 2}>Simple</text>
      </g>
       <g id="res_strat" className={`node result ${getActiveClass('res_strat')}`}>
        <rect x={resStratX} y={resStratY} width={boxWidth} height={boxHeight} />
        <text x={resStratX + boxWidth / 2} y={resStratY + boxHeight / 2} >Stratified</text>
      </g>
      <g id="res_block_strat" className={`node result ${getActiveClass('res_block_strat')}`}>
        <rect x={resBlockStratX} y={resBlockStratY} width={boxWidth} height={boxHeight} />
        <text x={resBlockStratX + boxWidth / 2} y={resBlockStratY + boxHeight / 2} >Block & Strat</text>
      </g>


      {/* Paths (Lines/Arrows) - Corrected 'd' attributes, using getActiveMarker */}
      {/* Path: Start -> Q Sample Size */}
      <path id="path_start_q_sample" className={`edge ${getActiveClass('path_start_q_sample')}`}
        d={`M ${startX + boxWidth / 2} ${startY + boxHeight} V ${qSampleSizeY}`}
        markerEnd={getActiveMarker('path_start_q_sample')} />

      {/* Path: Q Sample Size -> Small/Mod -> Block */}
      <path id="path_sample_small_res_block" className={`edge ${getActiveClass('path_sample_small_res_block')}`}
         d={`M ${qSampleSizeX} ${qSampleSizeY + boxHeight / 2} L ${resBlockSmallX + boxWidth} ${resBlockSmallY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_sample_small_res_block')} />
      {/* Adjusted label position */}
      <text className={`edge-label ${getActiveClass('path_sample_small_res_block')}`}
        x={(qSampleSizeX + resBlockSmallX + boxWidth) / 2}
        y={(qSampleSizeY + resBlockSmallY + boxHeight) / 2 - 5} // Position label slightly above line midpoint
      >Small/Mod</text>

       {/* Path: Q Sample Size -> Large -> Q Env Bias */}
      <path id="path_sample_large_q_env" className={`edge ${getActiveClass('path_sample_large_q_env')}`}
         d={`M ${qSampleSizeX + boxWidth} ${qSampleSizeY + boxHeight / 2} L ${qEnvBiasX} ${qEnvBiasY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_sample_large_q_env')} />
       {/* Adjusted label position */}
      <text className={`edge-label ${getActiveClass('path_sample_large_q_env')}`}
         x={(qSampleSizeX + boxWidth + qEnvBiasX) / 2}
         y={(qSampleSizeY + qEnvBiasY + boxHeight) / 2 - 5} // Position label slightly above line midpoint
      >Large</text>

      {/* Path: Q Env Bias -> Q Covariates */}
      <path id="path_env_q_cov" className={`edge ${getActiveClass('path_env_q_cov')}`}
        d={`M ${qEnvBiasX + boxWidth / 2} ${qEnvBiasY + boxHeight} V ${qCovariatesY}`}
        markerEnd={getActiveMarker('path_env_q_cov')} />
      {/* No label needed here, Yes/No shown on departing paths from Covariates */}


      {/* --- Paths from Q Covariates --- */}

      {/* Path: Covariates -> Simple (Env=N, Cov=N) */}
      <path id="path_cov_no_env_no_res_simple" className={`edge ${getActiveClass('path_cov_no_env_no_res_simple')}`}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight / 2} L ${resSimpleX} ${resSimpleY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_cov_no_env_no_res_simple')} />
      <text className={`edge-label ${getActiveClass('path_cov_no_env_no_res_simple')}`}
         x={(qCovariatesX + boxWidth + resSimpleX) / 2}
         y={qCovariatesY + boxHeight / 2 + 15}>Env=N, Cov=N</text>

      {/* Path: Covariates -> Block (Large Env) (Env=Y, Cov=N) */}
       <path id="path_cov_no_env_yes_res_block_large" className={`edge ${getActiveClass('path_cov_no_env_yes_res_block_large')}`}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight / 2} L ${resBlockLargeX + boxWidth} ${resBlockLargeY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_cov_no_env_yes_res_block_large')} />
      <text className={`edge-label ${getActiveClass('path_cov_no_env_yes_res_block_large')}`}
         x={(qCovariatesX + resBlockLargeX + boxWidth) / 2}
         y={qCovariatesY + boxHeight / 2 - 10}>Env=Y, Cov=N</text>

       {/* Path: Covariates -> Stratified (Env=N, Cov=Y) */}
      <path id="path_cov_yes_env_no_res_strat" className={`edge ${getActiveClass('path_cov_yes_env_no_res_strat')}`}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight} L ${resStratX + boxWidth/2} ${resStratY}`} // Points down-left
         markerEnd={getActiveMarker('path_cov_yes_env_no_res_strat')} />
      <text className={`edge-label ${getActiveClass('path_cov_yes_env_no_res_strat')}`}
        x={qCovariatesX - 30} // Adjusted position
        y={qCovariatesY + boxHeight + vSpace/2} >Env=N, Cov=Y</text>

      {/* Path: Covariates -> Block & Strat (Env=Y, Cov=Y) */}
      <path id="path_cov_yes_env_yes_res_block_strat" className={`edge ${getActiveClass('path_cov_yes_env_yes_res_block_strat')}`}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight} L ${resBlockStratX + boxWidth/2} ${resBlockStratY}`} // Points down-right
         markerEnd={getActiveMarker('path_cov_yes_env_yes_res_block_strat')} />
      <text className={`edge-label ${getActiveClass('path_cov_yes_env_yes_res_block_strat')}`}
         x={qCovariatesX + boxWidth + 30} // Adjusted position
         y={qCovariatesY + boxHeight + vSpace/2} >Env=Y, Cov=Y</text>

    </svg>
  );
};

export default FlowchartVisual;