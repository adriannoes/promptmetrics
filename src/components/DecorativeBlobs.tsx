import React from 'react';

export interface BlobProps {
  className?: string;
  style?: React.CSSProperties;
  ariaHidden?: boolean;
}

export const DecorativeBlobs: React.FC<{ blobs: BlobProps[] }> = ({ blobs }) => {
  return (
    <>
      {blobs.map((blob, index) => (
        <div
          key={index}
          className={blob.className}
          style={blob.style}
          aria-hidden={blob.ariaHidden ?? true}
        />
      ))}
    </>
  );
};

export default DecorativeBlobs;


