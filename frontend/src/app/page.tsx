// frontend/src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [savedTexts, setSavedTexts] = useState<any[]>([]);

  useEffect(() => {
    // Buscar textos salvos no banco de dados
    const fetchTexts = async () => {
      const response = await fetch('http://localhost:3001/extractions');
      const data = await response.json();
      setSavedTexts(data);
    };
    fetchTexts();
  }, []);

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

    // Atualizar a lista de textos salvos
    setSavedTexts((prev) => [{ id: result.id, extractedText: result.text, createdAt: new Date().toISOString() }, ...prev]);
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
      <h2>Textos Salvos:</h2>
      <ul>
        {savedTexts.map((text) => (
          <li key={text.id}>
            <p>{text.extractedText}</p>
            <small>Salvo em: {new Date(text.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
