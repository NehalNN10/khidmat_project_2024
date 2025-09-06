'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const DriveFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get('/api/drive-files')
      .then((res) => {
        console.log('Files:', res.data.files); // Debugging line
        setFiles(res.data.files);
      })
      .catch((err) => {
        console.log('Error:', err); // Debugging line
      });
  }, []);

  return (
    <>
      <h1>Google Drive Files</h1>
      {files.length === 0 && <p>No files found</p>} {/* Debugging line */}
      {files.map((file, i) => {
        const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
        console.log('Image URL:', imageUrl); // Debugging line
        return (
          <div key={i}>
            <p>{file.name}</p>
            <Image
              width={200}
              height={300}
              src={imageUrl}
              alt={file.name}
              onError={(e) => console.error(`Error loading image: ${imageUrl}`, e)} // Debugging line
            />
          </div>
        );
      })}
    </>
  );
};

export default DriveFiles;