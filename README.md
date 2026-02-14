**Finance Tracker**

Follow these steps:

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <repo-folder>

# 2. install dependencies
npm install

# 3. Set up environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

MONGO_URI=your_mongo_uri
SUPABASE_JWT_SECRET=your_supabase_jwt_key

# 4. Start the development server

# The command below is a custom script that runs both the frontend (React/Vite) 
# and backend (Express) servers together for development convenience:
npm run dev:all

# Alternatively, you can run the frontend and backend separately in two terminals:

# Terminal 1 (frontend):
npm run dev

# Terminal 2 (backend):
# (from the project root)
npx tsx server/index.ts
```

This project is built with:

- React (with TypeScript)
- Node.js (runtime)
- Express (web server)
- Vite
- Supabase (for authentication)
- MongoDB
- AnyChart
