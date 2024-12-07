import React, { useEffect, useRef, useState } from 'react';

const IframeComponent = ({ apiurl }) => {
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(apiurl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Mobile Safari/537.36',
          },
        });

        if (response.ok) {
          const content = await response.text();
          const blob = new Blob([content], { type: 'text/html' });
          const blobUrl = URL.createObjectURL(blob);
          setIframeSrc(blobUrl);
        } else {
          console.error('Failed to fetch content:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [apiurl]);

  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      title="External Content"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
};

export default IframeComponent;
