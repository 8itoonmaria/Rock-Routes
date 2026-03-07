## Dependencies to install

### Running servers

1. Terminal 1 (Backend): In VS Code, open one terminal and type cd backend, then node server.js.
2. Terminal 2 (Frontend): In VS Code, open another terminal and type cd frontend (or whatever you named your React app / folder), then npm start. This will open your browser at http://localhost:3000.

### /backend

1. Initialize the project: npm init -y
2. Install Express and CORS: npm install express cors
3. npm install mongoose dotenv
4. npm install bcryptjs: Used to scramble (hash) passwords.
5. npm install jsonwebtoken: Used to create the "digital wristband" (token).

### /frontend

1. npm install react-router-dom jwt-decode
