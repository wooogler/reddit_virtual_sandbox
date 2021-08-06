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
      <img
        src='/images/base_interface_3.png'
        alt='base_interface_3'
        className='w-full'
      />
      <div className='category'>Feature 1: Sandbox</div>
      <img src='/images/sandbox.png' alt='sandbox' className='w-full' />
      <div className='category'>Feature 2: Post Collections</div>
      <img
        src='/images/post_collections_1.png'
        alt='post_collections_1'
        className='w-full'
      />
      <img
        src='/images/post_collections_2.png'
        alt='post_collections_2'
        className='w-full'
      />
      <div className='category'>
        Feature 3: View possible misses & false alarms
      </div>
      <img
        src='/images/smart_sorting.png'
        alt='smart_sorting'
        className='w-full'
      />
      <div className='category'>
        Feature 4: Configuration Analysis & Highlights
      </div>
      <img
        src='/images/conf_analysis_1.png'
        alt='conf_analysis_1'
        className='w-full'
      />
      <img
        src='/images/conf_analysis_2.png'
        alt='conf_analysis_2'
        className='w-full'
      />
      <img
        src='/images/conf_analysis_3.png'
        alt='conf_analysis_3'
        className='w-full'
      />
    </GuideDiv>
  );
}

const GuideDiv = styled.div`
   .category {
    font-size: 2rem;
    font-weight: bold;
  }
  .text {
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }
  img {
    margin-bottom: 1rem;
    border: silver 1px solid;
  }
`;

export default SystemGuide;
