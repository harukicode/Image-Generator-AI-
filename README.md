# Banner Generator

A project that uses AI to generate professional banner images from your prompts and reference images.

## Features

- **AI-Enhanced Prompts**: Convert simple descriptions into optimized image generation prompts
- **Banner Generation**: Create multiple banner variations with Ideogram AI
- **Template Management**: Save and reuse your favorite prompts
- **Image Library**: Organize and manage your generated images

## Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React, Tailwind CSS, Shadcn UI
- **AI Services**: OpenAI (GPT), Claude (Anthropic), and Ideogram APIs

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for OpenAI, Anthropic, and Ideogram

### Backend Setup

1. Clone the repository and navigate to the backend directory:

```bash
git clone <repository-url>
cd image-generator/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
# Required API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
IDEOGRAM_API_KEY=your_ideogram_api_key

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173
# MAX_FILE_SIZE=10485760  # 10MB
```

4. Initialize the database:

```bash
npm run migrate
```

5. Start the development server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Usage

1. **Upload Reference Image**: Start by uploading an image or selecting one from your library
2. **Write a Prompt**: Describe what kind of banner you want (e.g., "Create a modern tech banner for XYZ company")
3. **Generate AI-Enhanced Prompt**: The system will create an optimized prompt for better results
4. **Review and Edit**: You can edit the AI-generated prompt if needed
5. **Generate Images**: Create multiple banner variations based on the prompt
6. **Download or Save**: Download your favorite images or save them to your library

## Project Structure

### Backend
- `/src/controllers` - Request handlers for different features
- `/src/routes` - API route definitions
- `/src/services` - Services for AI models and image processing
- `/src/db` - Database models and migrations
- `/src/utils` - Utility functions

### Frontend
- `/src/features` - Feature-specific components and logic
- `/src/widgets` - Complex reusable components
- `/src/shared` - UI components and utilities
- `/src/stores` - State management with Zustand
