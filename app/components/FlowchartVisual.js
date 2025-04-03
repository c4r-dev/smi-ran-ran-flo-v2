// components/FlowchartVisual.js
import React from 'react';

const FlowchartVisual = ({ step, sampleSize, envBias, hasStrongCovariates }) => {
  // Helper function to determine if a path/node is active
  const isActive = (elementId) => {
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

  // Function to generate 'active' or '' part of the class
  const getActiveClassSuffix = (id) => (isActive(id) ? ' active' : ''); // Note space before 'active'

  // Function to get marker URL string
  const getActiveMarker = (id) => (isActive(id) ? 'url(#arrowhead-active)' : 'url(#arrowhead)');


  // Dimensions and Spacing (Using dimensions from previous step)
  const boxWidth = 150;
  const boxHeight = 60;
  const hSpace = 90;
  const vSpace = 80;
  const svgWidth = 950;
  const svgHeight = 800;
  const startX = svgWidth / 2 - boxWidth / 2;
  const startY = 20;

  // Coordinate Calculations (remain the same)
  const qSampleSizeX = startX;
  const qSampleSizeY = startY + boxHeight + vSpace;
  const qEnvBiasY = qSampleSizeY + boxHeight + vSpace;
  const qEnvBiasX = qSampleSizeX + boxWidth / 2 + hSpace;
  const resBlockSmallY = qEnvBiasY;
  const resBlockSmallX = qSampleSizeX - boxWidth / 2 - hSpace;
  const finalTopRowY = qEnvBiasY + boxHeight + vSpace * 1.2;
  const qCovariatesY = finalTopRowY + boxHeight + vSpace * 0.8;
  const finalBottomRowY = qCovariatesY + boxHeight + vSpace * 0.8;
  const finalHSpace = hSpace * 1.3;
  const resBlockLargeX = startX + boxWidth/2 + hSpace - boxWidth / 2 - finalHSpace;
  const resSimpleX = startX + boxWidth/2 + hSpace + boxWidth / 2 + finalHSpace;
  const finalCenterX = (resBlockLargeX + resSimpleX + boxWidth) / 2;
  const qCovariatesX = finalCenterX - boxWidth / 2;
  const resBlockLargeY = finalTopRowY;
  const resSimpleY = finalTopRowY;
  const resStratY = finalBottomRowY;
  const resBlockStratY = finalBottomRowY;
  const resStratX = resBlockLargeX;
  const resBlockStratX = resSimpleX;

  // --- PRE-CALCULATE Class Names ---
  const nodeClasses = {
    start: 'node' + getActiveClassSuffix('start'),
    q_sample_size: 'node' + getActiveClassSuffix('q_sample_size'),
    q_env_bias: 'node' + getActiveClassSuffix('q_env_bias'),
    q_covariates: 'node' + getActiveClassSuffix('q_covariates'),
    res_block_small: 'node result' + getActiveClassSuffix('res_block_small'),
    res_block_large_env: 'node result' + getActiveClassSuffix('res_block_large_env'),
    res_simple: 'node result' + getActiveClassSuffix('res_simple'),
    res_strat: 'node result' + getActiveClassSuffix('res_strat'),
    res_block_strat: 'node result' + getActiveClassSuffix('res_block_strat'),
  };

  const edgeClasses = {
      path_start_q_sample: 'edge' + getActiveClassSuffix('path_start_q_sample'),
      path_sample_small_res_block: 'edge' + getActiveClassSuffix('path_sample_small_res_block'),
      path_sample_large_q_env: 'edge' + getActiveClassSuffix('path_sample_large_q_env'),
      path_env_q_cov: 'edge' + getActiveClassSuffix('path_env_q_cov'),
      path_cov_no_env_no_res_simple: 'edge' + getActiveClassSuffix('path_cov_no_env_no_res_simple'),
      path_cov_no_env_yes_res_block_large: 'edge' + getActiveClassSuffix('path_cov_no_env_yes_res_block_large'),
      path_cov_yes_env_no_res_strat: 'edge' + getActiveClassSuffix('path_cov_yes_env_no_res_strat'),
      path_cov_yes_env_yes_res_block_strat: 'edge' + getActiveClassSuffix('path_cov_yes_env_yes_res_block_strat'),
  };

  const labelClasses = {
       path_sample_small_res_block: 'edge-label' + getActiveClassSuffix('path_sample_small_res_block'),
       path_sample_large_q_env: 'edge-label' + getActiveClassSuffix('path_sample_large_q_env'),
       path_cov_no_env_no_res_simple: 'edge-label' + getActiveClassSuffix('path_cov_no_env_no_res_simple'),
       path_cov_no_env_yes_res_block_large: 'edge-label' + getActiveClassSuffix('path_cov_no_env_yes_res_block_large'),
       path_cov_yes_env_no_res_strat: 'edge-label' + getActiveClassSuffix('path_cov_yes_env_no_res_strat'),
       path_cov_yes_env_yes_res_block_strat: 'edge-label' + getActiveClassSuffix('path_cov_yes_env_yes_res_block_strat'),
  };
  // --- END PRE-CALCULATE ---


  return (
    <svg width={svgWidth} height={svgHeight} className="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
       {/* Arrowhead Definitions */}
       <defs>
         <marker id="arrowhead" markerWidth="10" markerHeight="7"
           refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
           <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
         </marker>
         <marker id="arrowhead-active" markerWidth="10" markerHeight="7"
           refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
           <polygon points="0 0, 10 3.5, 0 7" fill="#1976d2" />
         </marker>
       </defs>

      {/* Nodes (Boxes) - Using pre-calculated className variables */}
      <g id="start" className={nodeClasses.start}>
        <rect x={startX} y={startY} width={boxWidth} height={boxHeight} />
        <text x={startX + boxWidth / 2} y={startY + boxHeight / 2} >Start</text>
      </g>
      <g id="q_sample_size" className={nodeClasses.q_sample_size}>
        <rect x={qSampleSizeX} y={qSampleSizeY} width={boxWidth} height={boxHeight} />
        <text x={qSampleSizeX + boxWidth / 2} y={qSampleSizeY + boxHeight / 2} >Sample Size?</text>
      </g>
      <g id="q_env_bias" className={nodeClasses.q_env_bias}>
        <rect x={qEnvBiasX} y={qEnvBiasY} width={boxWidth} height={boxHeight} />
        <text x={qEnvBiasX + boxWidth / 2} y={qEnvBiasY + boxHeight / 2}>Env Bias?</text>
      </g>
      <g id="q_covariates" className={nodeClasses.q_covariates}>
        <rect x={qCovariatesX} y={qCovariatesY} width={boxWidth} height={boxHeight} />
        <text x={qCovariatesX + boxWidth / 2} y={qCovariatesY + boxHeight / 2}>Covariates?</text>
      </g>
      <g id="res_block_small" className={nodeClasses.res_block_small}>
        <rect x={resBlockSmallX} y={resBlockSmallY} width={boxWidth} height={boxHeight} />
        <text x={resBlockSmallX + boxWidth / 2} y={resBlockSmallY + boxHeight / 2}>Block</text>
      </g>
      <g id="res_block_large_env" className={nodeClasses.res_block_large_env}>
        <rect x={resBlockLargeX} y={resBlockLargeY} width={boxWidth} height={boxHeight} />
        <text x={resBlockLargeX + boxWidth / 2} y={resBlockLargeY + boxHeight / 2} >Block</text>
      </g>
      <g id="res_simple" className={nodeClasses.res_simple}>
        <rect x={resSimpleX} y={resSimpleY} width={boxWidth} height={boxHeight} />
        <text x={resSimpleX + boxWidth / 2} y={resSimpleY + boxHeight / 2}>Simple</text>
      </g>
       <g id="res_strat" className={nodeClasses.res_strat}>
        <rect x={resStratX} y={resStratY} width={boxWidth} height={boxHeight} />
        <text x={resStratX + boxWidth / 2} y={resStratY + boxHeight / 2} >Stratified</text>
      </g>
      <g id="res_block_strat" className={nodeClasses.res_block_strat}>
        <rect x={resBlockStratX} y={resBlockStratY} width={boxWidth} height={boxHeight} />
        <text x={resBlockStratX + boxWidth / 2} y={resBlockStratY + boxHeight / 2} >Block & Strat</text>
      </g>


      {/* Paths (Lines/Arrows) - Using pre-calculated className variables */}
      <path id="path_start_q_sample" className={edgeClasses.path_start_q_sample}
        d={`M ${startX + boxWidth / 2} ${startY + boxHeight} V ${qSampleSizeY}`}
        markerEnd={getActiveMarker('path_start_q_sample')} />

      <path id="path_sample_small_res_block" className={edgeClasses.path_sample_small_res_block}
         d={`M ${qSampleSizeX} ${qSampleSizeY + boxHeight / 2} L ${resBlockSmallX + boxWidth / 2} ${resBlockSmallY}`}
         markerEnd={getActiveMarker('path_sample_small_res_block')} />
      <text className={labelClasses.path_sample_small_res_block}
        x={(qSampleSizeX + resBlockSmallX + boxWidth / 2) / 2}
        y={(qSampleSizeY + boxHeight / 2 + resBlockSmallY) / 2 - 5}
      >Small/Mod</text>

       <path id="path_sample_large_q_env" className={edgeClasses.path_sample_large_q_env}
         d={`M ${qSampleSizeX + boxWidth} ${qSampleSizeY + boxHeight / 2} L ${qEnvBiasX + boxWidth / 2} ${qEnvBiasY}`}
         markerEnd={getActiveMarker('path_sample_large_q_env')} />
      <text className={labelClasses.path_sample_large_q_env}
         x={(qSampleSizeX + boxWidth + qEnvBiasX + boxWidth / 2) / 2}
         y={(qSampleSizeY + boxHeight / 2 + qEnvBiasY) / 2 - 5}
      >Large</text>

      <path id="path_env_q_cov" className={edgeClasses.path_env_q_cov}
         d={`M ${qEnvBiasX + boxWidth / 2} ${qEnvBiasY + boxHeight} V ${qCovariatesY}`}
         markerEnd={getActiveMarker('path_env_q_cov')} />

      {/* --- Paths from Q Covariates --- */}
      <path id="path_cov_no_env_no_res_simple" className={edgeClasses.path_cov_no_env_no_res_simple}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY} L ${resSimpleX} ${resSimpleY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_cov_no_env_no_res_simple')} />
      <text className={labelClasses.path_cov_no_env_no_res_simple}
         x={(qCovariatesX + boxWidth + resSimpleX) / 2 + 10}
         y={(qCovariatesY + resSimpleY + boxHeight / 2) / 2 - 5} >Env=N, Cov=N</text>

      <path id="path_cov_no_env_yes_res_block_large" className={edgeClasses.path_cov_no_env_yes_res_block_large}
         d={`M ${qCovariatesX} ${qCovariatesY} L ${resBlockLargeX + boxWidth} ${resBlockLargeY + boxHeight / 2}`}
         markerEnd={getActiveMarker('path_cov_no_env_yes_res_block_large')} />
      <text className={labelClasses.path_cov_no_env_yes_res_block_large}
         x={(qCovariatesX + resBlockLargeX + boxWidth) / 2 - 10}
         y={(qCovariatesY + resBlockLargeY + boxHeight / 2) / 2 - 5}>Env=Y, Cov=N</text>

      <path id="path_cov_yes_env_no_res_strat" className={edgeClasses.path_cov_yes_env_no_res_strat}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight} L ${resStratX + boxWidth/2} ${resStratY}`}
         markerEnd={getActiveMarker('path_cov_yes_env_no_res_strat')} />
      <text className={labelClasses.path_cov_yes_env_no_res_strat}
        x={(qCovariatesX + resStratX + boxWidth/2) / 2 - 10}
        y={(qCovariatesY + boxHeight + resStratY) / 2 + 5 } >Env=N, Cov=Y</text>

      <path id="path_cov_yes_env_yes_res_block_strat" className={edgeClasses.path_cov_yes_env_yes_res_block_strat}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight} L ${resBlockStratX + boxWidth/2} ${resBlockStratY}`}
         markerEnd={getActiveMarker('path_cov_yes_env_yes_res_block_strat')} />
      <text className={labelClasses.path_cov_yes_env_yes_res_block_strat}
         x={(qCovariatesX + boxWidth + resBlockStratX + boxWidth/2) / 2 + 10}
         y={(qCovariatesY + boxHeight + resBlockStratY) / 2 + 5} >Env=Y, Cov=Y</text>

    </svg>
  );
};

export default FlowchartVisual;