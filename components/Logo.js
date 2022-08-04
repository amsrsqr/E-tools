import React from 'react';
import imageLogo from '../resources/logo.png';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      src={imageLogo}
      {...props}
    />
  );
};

export default Logo;
