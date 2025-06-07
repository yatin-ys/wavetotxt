import React, { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

export default function TranscriptionUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError("Please select an audio file first.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("File is too large. Maximum size is 25MB.");
      return;
    }

    setIsLoading(true);
    setError("");
    setTranscription("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setTranscription(data.transcription);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div
        className="w-full p-10 border-2 border-dashed border-gray-600 rounded-lg bg-[#2c2c3a] text-gray-400 text-center cursor-pointer transition hover:bg-[#353546] hover:border-gray-500"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <UploadCloud size={48} />
          <p className="font-bold text-lg text-gray-300">
            Drop your audio file here or click to upload
          </p>
          <p className="text-sm">
            Supported formats: FLAC, MP3, MP4, M4A, OGG, WAV, etc.
          </p>
          <p className="text-xs">Maximum file size: 25MB</p>
          {selectedFile && (
            <p className="mt-4 font-semibold text-green-400">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      <button
        className="w-full py-3 px-6 bg-blue-600 rounded-lg text-white font-semibold transition hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        onClick={handleTranscribe}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? "Transcribing..." : "Transcribe Audio"}
      </button>

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {transcription && (
        <div className="w-full p-4 bg-[#2c2c3a] rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold mb-2">Transcription:</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{transcription}</p>
        </div>
      )}
    </div>
  );
}
