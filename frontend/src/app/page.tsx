// frontend/src/app/page.tsx

import React, { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setExtractedText(result.text);
  };

  return (
    <div>
      <h1>Digitalização de Arquivos</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Fazer Upload</button>
      {extractedText && (
        <div>
          <h2>Texto Extraído:</h2>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
}
