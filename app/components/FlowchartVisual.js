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
        return step === 'environmentalBiasQuestion';
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
      case 'path_env_q_cov': // Covers both Yes/No from Env Bias
        return ['covariatesQuestion', 'largeResult', 'stratResult', 'stratOnlyResult', 'blockResult'].includes(step) && sampleSize === 'large';
      case 'path_cov_yes_env_yes_res_block_strat': // Env=Y, Cov=Y
        return step === 'stratResult';
       case 'path_cov_no_env_yes_res_block_large': // Env=Y, Cov=N
         return step === 'blockResult' && envBias === 'yes';
       case 'path_cov_yes_env_no_res_strat': // Env=N, Cov=Y
         return step === 'stratOnlyResult';
       case 'path_cov_no_env_no_res_simple': // Env=N, Cov=N
         return step === 'largeResult';

      default:
        return false;
    }
  };

  const getActiveClass = (id) => (isActive(id) ? 'active' : '');

  // Basic dimensions/positions (adjust as needed)
  const boxWidth = 150;
  const boxHeight = 60;
  const hSpace = 50; // Horizontal space between boxes
  const vSpace = 50; // Vertical space between levels

  const startX = 325; const startY = 20;
  const qSampleSizeX = startX; const qSampleSizeY = startY + boxHeight + vSpace;
  const qEnvBiasX = startX + boxWidth/2 + hSpace/2; const qEnvBiasY = qSampleSizeY + boxHeight + vSpace; // Large path
  const qCovariatesX = qEnvBiasX; const qCovariatesY = qEnvBiasY + boxHeight + vSpace;

  const resBlockSmallX = startX - boxWidth/2 - hSpace/2; const resBlockSmallY = qSampleSizeY; // Small/Mod path
  const resSimpleX = qCovariatesX + boxWidth + hSpace; const resSimpleY = qCovariatesY; // Large > No Env > No Cov
  const resStratX = qCovariatesX - boxWidth - hSpace; const resStratY = qCovariatesY + boxHeight + vSpace; // Large > No Env > Yes Cov
  const resBlockLargeX = qCovariatesX - boxWidth - hSpace; const resBlockLargeY = qCovariatesY; // Large > Yes Env > No Cov
  const resBlockStratX = qCovariatesX + boxWidth + hSpace; const resBlockStratXy = qCovariatesY + boxHeight + vSpace; // Large > Yes Env > Yes Cov


  return (
    <svg width="800" height="500" className="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Nodes (Boxes) - Added unique IDs */}
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
        <rect x={resBlockStratX} y={resBlockStratXy} width={boxWidth} height={boxHeight} />
        <text x={resBlockStratX + boxWidth / 2} y={resBlockStratXy + boxHeight / 2} >Block & Strat</text>
      </g>


      {/* Paths (Lines/Arrows) - Added unique IDs */}
      {/* Path: Start -> Q Sample Size */}
      <path id="path_start_q_sample" className={`edge ${getActiveClass('path_start_q_sample')}`}
        d={`M ${startX + boxWidth / 2} ${startY + boxHeight} V ${qSampleSizeY}`} />

      {/* Path: Q Sample Size -> Small/Mod -> Block */}
      <path id="path_sample_small_res_block" className={`edge ${getActiveClass('path_sample_small_res_block')}`}
         d={`M ${qSampleSizeX} ${qSampleSizeY + boxHeight / 2} H ${resBlockSmallX + boxWidth}`} />
      <text className={`edge-label ${getActiveClass('path_sample_small_res_block')}`} x={qSampleSizeX - hSpace/2} y={qSampleSizeY + boxHeight / 2 - 5}>Small/Mod</text>

       {/* Path: Q Sample Size -> Large -> Q Env Bias */}
      <path id="path_sample_large_q_env" className={`edge ${getActiveClass('path_sample_large_q_env')}`}
         d={`M ${qSampleSizeX + boxWidth / 2} ${qSampleSizeY + boxHeight} V ${qEnvBiasY} H ${qEnvBiasX}`} />
      <text className={`edge-label ${getActiveClass('path_sample_large_q_env')}`} x={qSampleSizeX + boxWidth / 2 + 5} y={qSampleSizeY + boxHeight + vSpace/2}>Large</text>

      {/* Path: Q Env Bias -> Q Covariates */}
      <path id="path_env_q_cov" className={`edge ${getActiveClass('path_env_q_cov')}`}
         d={`M ${qEnvBiasX + boxWidth / 2} ${qEnvBiasY + boxHeight} V ${qCovariatesY} H ${qCovariatesX + boxWidth}`} />
      {/* Labels Yes/No for EnvBias handled below on paths *from* Covariates */}

      {/* Paths from Q Covariates based on Env Bias */}
      {/* Env=Y, Cov=Y -> Block & Strat */}
      <path id="path_cov_yes_env_yes_res_block_strat" className={`edge ${getActiveClass('path_cov_yes_env_yes_res_block_strat')}`}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight/2} H ${resBlockStratX}`} />
      <text className={`edge-label ${getActiveClass('path_cov_yes_env_yes_res_block_strat')}`} x={qCovariatesX + boxWidth + 5} y={qCovariatesY + boxHeight/2 - 5}>Env=Y, Cov=Y</text>

      {/* Env=Y, Cov=N -> Block */}
       <path id="path_cov_no_env_yes_res_block_large" className={`edge ${getActiveClass('path_cov_no_env_yes_res_block_large')}`}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight/2} H ${resBlockLargeX + boxWidth}`} />
      <text className={`edge-label ${getActiveClass('path_cov_no_env_yes_res_block_large')}`} x={qCovariatesX - hSpace/2 - 20} y={qCovariatesY + boxHeight / 2 - 5}>Env=Y, Cov=N</text>

       {/* Env=N, Cov=Y -> Stratified */}
      <path id="path_cov_yes_env_no_res_strat" className={`edge ${getActiveClass('path_cov_yes_env_no_res_strat')}`}
         d={`M ${qCovariatesX} ${qCovariatesY + boxHeight} V ${resStratY} H ${resStratX + boxWidth}`} />
      <text className={`edge-label ${getActiveClass('path_cov_yes_env_no_res_strat')}`} x={qCovariatesX - hSpace} y={qCovariatesY + boxHeight + vSpace/2}>Env=N, Cov=Y</text>

      {/* Env=N, Cov=N -> Simple */}
      <path id="path_cov_no_env_no_res_simple" className={`edge ${getActiveClass('path_cov_no_env_no_res_simple')}`}
         d={`M ${qCovariatesX + boxWidth} ${qCovariatesY + boxHeight/2} H ${resSimpleX}`} />
      <text className={`edge-label ${getActiveClass('path_cov_no_env_no_res_simple')}`} x={qCovariatesX + boxWidth + 5} y={qCovariatesY + boxHeight/2 + 15}>Env=N, Cov=N</text>


    </svg>
  );
};

export default FlowchartVisual;