import { GoogleLogin } from '@react-oauth/google';
import React from 'react';

const Services = () => {
    return <div><GoogleLogin
    onSuccess={credentialResponse => {
      console.log(credentialResponse);
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  /></div>;
};

export default Services;
