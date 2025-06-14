import React, { useEffect, useState } from 'react';

const ProfileImage = ({ src, size = 140 }) => {
  const [imgSrc, setImgSrc] = useState(src || '../../../src/images/profileDefault.png');

  useEffect(() => {
    setImgSrc(src || '../../../src/images/profileDefault.png');
  }, [src]);

  const handleError = () => {
    setImgSrc('../../../src/images/profileDefault.png');
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.12)',
      }}
    >
      <img
        src={imgSrc}
        alt="Perfil"
        onError={handleError}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default ProfileImage;
