// ============================================
// IMPORT STATEMENTS
// ============================================
// These imports bring in Node.js modules and external packages we need

// fileURLToPath converts a file URL to a file path
import { fileURLToPath } from 'url';

// path module provides utilities for working with file and directory paths
import path from 'path';

// express is the web framework that handles routing and HTTP requests
import express from 'express';

// imports test function and logic from db.js
import { testConnection } from './src/models/db.js';

// imports all routes from the routes.js file
// all route definitions and controller logic have been moved there
import router from './src/routes.js';

//import session
import session from 'express-session';

//import flash from flash.js
import flash from './src/middleware/flash.js';
// ========================================
// ====
// ENVIRONMENT SETUP
// ============================================

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the application environment (development or production)
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET;
// ============================================
// EXPRESS APP SETUP
// ============================================

// Create an Express application instance
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files (CSS, images, JavaScript) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find EJS template files
app.set('views', path.join(__dirname, 'src/views'));

// ============================================
// MIDDLEWARE
// ============================================

// Middleware to log all incoming requests
// Only logs in development mode to avoid noise in production
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to all EJS templates
// This allows templates to conditionally show development-only content
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});
app.use(flash);

// ============================================
// ROUTES
// ============================================

// Use the imported router to handle all routes
// All route definitions have been moved to src/routes.js
// and all controller logic has been moved to src/controllers/
app.use(router);

// ============================================
// ERROR HANDLING
// ============================================

// Catch-all route for 404 errors
// This runs when no other route matches the request
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
// The four parameters (err, req, res, next) tell Express this is an error handler
// It catches all errors passed via next(err) from anywhere in the app
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    res.status(status).render(`errors/${template}`, context);
});

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});