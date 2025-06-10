# WaveToTxt
WaveToTxt is a modern, full-stack web application that transcribes audio files to text with high accuracy and speed. It features a sleek React frontend and a robust .NET backend, utilizing the Groq API for its powerful transcription capabilities.

Live - https://wavetotxt.yatin-ys.tech/

## 🚀 Getting Started

### Prerequisites

You will need the following tools installed on your system:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 or later recommended)

The backend requires an API key from Groq to function.

1.  **Get a Groq API Key**:
    - Sign up for a free account at [GroqCloud](https://console.groq.com/).
    - Navigate to the "API Keys" section and create a new secret key.
    - Copy the key.

2.  **Set up Environment File**:
    - In the `backend/` directory, create a new file named `.env`.
    - Add your API key to this file like so:

      ```.env
      GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
      ```

### Local Development Setup

You will need to run both the backend and frontend servers simultaneously.

#### 1. Backend Server

Open a terminal and navigate to the `backend` directory.

```bash
# Navigate to the backend folder
cd backend

# Restore .NET dependencies
dotnet restore

# Run the backend application
dotnet run
```

#### 2. Frontend Server

Open a second terminal and navigate to the frontend directory.

```bash
# Navigate to the frontend folder
cd frontend

# Install npm dependencies
npm install

# Run the frontend development server
npm run dev
```
