import React, { ReactElement } from 'react';
import styled from 'styled-components';

function SystemGuide(): ReactElement {
  return (
    <GuideDiv>
      <div className='category'>Base Interface</div>
      <img
        src='/images/base_interface_1.png'
        alt='base_interface_1'
        className='w-full'
      />
      <img
        src='/images/base_interface_2.png'
        alt='base_interface_2'
        className='w-full'
      />
      <div className='category'>Feature 0: Sandbox</div>
      <img src='/images/sandbox.png' alt='sandbox' className='w-full' />
      <div className='category'>Feature 1: Post Collections</div>
      <img
        src='/images/post_collections.png'
        alt='post_collections'
        className='w-full'
      />
      <div className='category'>
        Feature 2: Find possible misses & false alarms
      </div>
      <img src='/images/find_fpfn.png' alt='find_fpfn' className='w-full' />
      <div className='category'>Feature 3: Configuration Analysis</div>
      <img src='/images/configuration_analysis_1.png' alt='configuration_analysis_1' className='w-full' />
      <img src='/images/configuration_analysis_2.png' alt='configuration_analysis_2' className='w-full' />
      <img src='/images/configuration_analysis_3.png' alt='configuration_analysis_3' className='w-full' />
    </GuideDiv>
  );
}

const GuideDiv = styled.div`
  .category {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .text {
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }
`;

export default SystemGuide;
