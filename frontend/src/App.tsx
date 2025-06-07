import TranscriptionUploader from './components/TranscriptionUploader';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">WaveToTxt</h1>
        <div className="text-2xl">🌙</div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <TranscriptionUploader />
      </main>
    </div>
  );
}

export default App;