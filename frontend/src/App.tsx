import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import TranscriptionUploader from "./components/TranscriptionUploader";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Header />
        <main className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Transform Audio to
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Text
                </span>
              </h1>
            </div>
            <TranscriptionUploader />
          </div>
        </main>
        {/* <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>
                &copy; 2025 WaveToTxt 
              </p>
            </div>
          </div>
        </footer> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
