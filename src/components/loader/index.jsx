// src/components/Loading.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => (
    <div className='loader-common'>
        <ClipLoader size={80} color={"#697865"} loading={true} />
    </div>
);

export default Loading;
