// components/FlowchartVisual.js
import React from 'react';

const FlowchartVisual = ({ step, sampleSize, envBias, hasStrongCovariates }) => {

  // Helper function to determine if a path/node is ACTIVE (for paths/labels/results)
  const isActive = (elementId) => {
     // (Keep the existing isActive logic)
     switch (elementId) {
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

  // Function to get node state class suffix: ' asking', ' answered', or ''
  const getNodeStateClassSuffix = (id) => {
    // (Keep the existing getNodeStateClassSuffix logic)
     switch (id) {
      case 'start':
        return ' answered';
      case 'q_sample_size':
        if (step === 'initial') return ' asking';
        if (step !== 'initial') return ' answered';
        return '';
      case 'q_env_bias':
        if (step === 'environmentalBiasQuestion') return ' asking';
        if (sampleSize === 'large' && ['covariatesQuestion', 'largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step)) {
            return ' answered';
        }
        return '';
      case 'q_covariates':
        if (step === 'covariatesQuestion') return ' asking';
        if (['largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step)) {
            return ' answered';
        }
        return '';
      case 'res_block_small':
      case 'res_block_large_env':
      case 'res_simple':
      case 'res_strat':
      case 'res_block_strat':
        return isActive(id) ? ' active' : '';
      default:
        return '';
    }
  };

  // Function to generate ' active' or '' part of the class FOR PATHS/LABELS
  const getActiveClassSuffix = (id) => (isActive(id) ? ' active' : '');

  // Function to get marker URL string
  const getActiveMarker = (id) => (isActive(id) ? 'url(#arrowhead-active)' : 'url(#arrowhead)');


  // --- Dimensions and Spacing (Keep Reduced) ---
  const boxWidth = 140;
  const boxHeight = 55;
  const hSpace = 65;
  const vSpace = 65;
  const svgWidth = 800; // Keep reduced width
  const svgHeight = 700; // Keep reduced height

  // --- Base Coordinates ---
  // MODIFIED: Set startX as requested
  const startX = 120;
  const startY = 15;

  // --- Recalculate ALL coordinates based on new startX ---
  const qSampleSizeX = startX;
  const qSampleSizeY = startY + boxHeight + vSpace;

  const qEnvBiasY = qSampleSizeY + boxHeight + vSpace;
  const qEnvBiasX = qSampleSizeX + boxWidth / 2 + hSpace;
  const resBlockSmallY = qEnvBiasY;
  // This value might be negative or very small, potentially cutting off the box
  const resBlockSmallX = qSampleSizeX - boxWidth / 2 - hSpace;

  const finalTopRowY = qEnvBiasY + boxHeight + vSpace * 1.1;
  const qCovariatesY = finalTopRowY + boxHeight + vSpace * 0.7;
  const finalBottomRowY = qCovariatesY + boxHeight + vSpace * 0.7;

  const finalHSpace = hSpace * 1.2;
  const resBlockLargeX = qEnvBiasX - boxWidth/2 - finalHSpace;
  const resSimpleX = qEnvBiasX + boxWidth/2 + finalHSpace;

  const finalCenterX = (resBlockLargeX + resSimpleX + boxWidth) / 2;
  const qCovariatesX = finalCenterX - boxWidth / 2;

  const resBlockLargeY = finalTopRowY;
  const resSimpleY = finalTopRowY;
  const resStratY = finalBottomRowY;
  const resBlockStratY = finalBottomRowY;
  const resStratX = resBlockLargeX;
  const resBlockStratX = resSimpleX;


  // --- PRE-CALCULATE Class Names (logic unchanged) ---
  const nodeClasses = {
    start: 'node' + getNodeStateClassSuffix('start'),
    q_sample_size: 'node' + getNodeStateClassSuffix('q_sample_size'),
    q_env_bias: 'node' + getNodeStateClassSuffix('q_env_bias'),
    q_covariates: 'node' + getNodeStateClassSuffix('q_covariates'),
    res_block_small: 'node result' + getNodeStateClassSuffix('res_block_small'),
    res_block_large_env: 'node result' + getNodeStateClassSuffix('res_block_large_env'),
    res_simple: 'node result' + getNodeStateClassSuffix('res_simple'),
    res_strat: 'node result' + getNodeStateClassSuffix('res_strat'),
    res_block_strat: 'node result' + getNodeStateClassSuffix('res_block_strat'),
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
       path_env_q_cov: 'edge-label' + getActiveClassSuffix('path_env_q_cov'),
       path_cov_no_env_no_res_simple: 'edge-label' + getActiveClassSuffix('path_cov_no_env_no_res_simple'),
       path_cov_no_env_yes_res_block_large: 'edge-label' + getActiveClassSuffix('path_cov_no_env_yes_res_block_large'),
       path_cov_yes_env_no_res_strat: 'edge-label' + getActiveClassSuffix('path_cov_yes_env_no_res_strat'),
       path_cov_yes_env_yes_res_block_strat: 'edge-label' + getActiveClassSuffix('path_cov_yes_env_yes_res_block_strat'),
  };
  // --- END PRE-CALCULATE ---


  return (
    <svg width={svgWidth} height={svgHeight} className="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
       {/* Definitions */}
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

      {/* Nodes (Boxes) - Using recalculated coordinates */}
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

      {/* Paths (Lines/Arrows) - Using recalculated coordinates */}
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
      {(envBias === 'yes' || envBias === 'no') && isActive('path_env_q_cov') && (
         <text className={labelClasses.path_env_q_cov}
           x={qEnvBiasX + boxWidth / 2 + 15}
           y={(qEnvBiasY + boxHeight + qCovariatesY) / 2}
         >
            {envBias === 'yes' ? 'Yes' : 'No'}
         </text>
      )}

      {/* Paths from Q Covariates */}
      <path id="path_cov_no_env_no_res_simple" className={edgeClasses.path_cov_no_env_no_res_simple}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY} L ${resSimpleX + boxWidth / 2} ${resSimpleY + boxHeight}`} // End middle-bottom
         markerEnd={getActiveMarker('path_cov_no_env_no_res_simple')} />
      <text className={labelClasses.path_cov_no_env_no_res_simple}
         x={(qCovariatesX + boxWidth + resSimpleX + boxWidth / 2) / 2 + 5}
         y={(qCovariatesY + resSimpleY + boxHeight) / 2} >Env=N, Cov=N</text>

      <path id="path_cov_no_env_yes_res_block_large" className={edgeClasses.path_cov_no_env_yes_res_block_large}
         d={`M ${qCovariatesX} ${qCovariatesY} L ${resBlockLargeX + boxWidth / 2} ${resBlockLargeY + boxHeight}`} // End middle-bottom
         markerEnd={getActiveMarker('path_cov_no_env_yes_res_block_large')} />
      <text className={labelClasses.path_cov_no_env_yes_res_block_large}
         x={(qCovariatesX + resBlockLargeX + boxWidth / 2) / 2 - 5}
         y={(qCovariatesY + resBlockLargeY + boxHeight) / 2}>Env=Y, Cov=N</text>

      <path id="path_cov_yes_env_no_res_strat" className={edgeClasses.path_cov_yes_env_no_res_strat}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight} L ${resStratX + boxWidth/2} ${resStratY}`} // End top-middle
         markerEnd={getActiveMarker('path_cov_yes_env_no_res_strat')} />
      <text className={labelClasses.path_cov_yes_env_no_res_strat}
        x={(qCovariatesX + resStratX + boxWidth/2) / 2 - 10}
        y={(qCovariatesY + boxHeight + resStratY) / 2 + 5 } >Env=N, Cov=Y</text>

      <path id="path_cov_yes_env_yes_res_block_strat" className={edgeClasses.path_cov_yes_env_yes_res_block_strat}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight} L ${resBlockStratX + boxWidth/2} ${resBlockStratY}`} // End top-middle
         markerEnd={getActiveMarker('path_cov_yes_env_yes_res_block_strat')} />
      <text className={labelClasses.path_cov_yes_env_yes_res_block_strat}
         x={(qCovariatesX + boxWidth + resBlockStratX + boxWidth/2) / 2 + 10}
         y={(qCovariatesY + boxHeight + resBlockStratY) / 2 + 5} >Env=Y, Cov=Y</text>

    </svg>
  );
};

export default FlowchartVisual;