# Black Film Trivia

A web-based trivia game that tests your knowledge of Black Cinema. Built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## Features

- Interactive trivia game with questions about Black-directed films
- Real-time scoring system with streak multipliers
- Movie poster display from OMDB API
- AI-powered question generation using Claude 3.5 Sonnet
- User authentication with Google Sign-In
- Global leaderboard
- Dark/Light mode support
- Responsive design

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Firebase project
- OMDB API key
- Claude API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
OMDB_API_KEY=your_omdb_api_key
CLAUDE_API_KEY=your_claude_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/black-film-trivia.git
cd black-film-trivia
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and Firestore
3. Add a web app to your project
4. Copy the Firebase configuration to your `.env.local` file
5. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
