// ============================================
// IMPORT STATEMENTS
// ============================================
// These imports bring in Node.js modules and external packages we need

// fileURLToPath converts a file URL to a file path
// This is needed because ES modules use 'file://' URLs instead of file paths
import { fileURLToPath } from 'url';

// path module provides utilities for working with file and directory paths
import path from 'path';

// express is the web framework that handles routing and HTTP requests
import express from 'express';
// imports test function and logic from db js
import { testConnection } from './src/models/db.js';

import { getAllOrganizations }  from './src/models/organizations.js';

import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';
// ============================================
// ENVIRONMENT SETUP
// ============================================

// Get the current file's directory path
// In ES modules, __dirname isn't available by default, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the application environment (development or production)
// This checks if NODE_ENV is set in .env, defaults to 'production' if not
// .toLowerCase() ensures consistent casing (dev, development, prod, production, etc.)
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
// This checks if PORT is set in .env or environment, defaults to 3000 if not
// This allows the server to run on different ports in different environments
const PORT = process.env.PORT || 3000;

// ============================================
// EXPRESS APP SETUP
// ============================================

// Create an Express application instance
const app = express();

// Serve static files (CSS, images, JavaScript) from the 'public' folder
// When a client requests /css/main.css, Express looks in public/css/main.css
// path.join(__dirname, 'public') creates the correct file path regardless of OS
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
// EJS allows us to embed JavaScript in HTML templates using <% %> syntax
app.set('view engine', 'ejs');

// Tell Express where to find EJS template files
// All .ejs files should be in src/views/ directory
// path.join creates a platform-independent path (works on Windows, Mac, Linux)
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});


// ============================================
// ROUTES
// ============================================

// HOME PAGE ROUTE
// When user visits http://localhost:3000/ or http://yoursite.com/
// async allows this route handler to use await for asynchronous operations
app.get('/', async (req, res) => {
    // Create a title variable that will be passed to the EJS template
    // This title appears in the browser tab AND in the page header partial
    const title = 'Home';
    
    // res.render() loads the home.ejs file and sends it to the browser
    // The second parameter { title } passes the title variable to the template
    // The EJS file can access this with <%= title %>
    res.render('home', { title });
});

// ORGANIZATIONS PAGE ROUTE
// When user visits http://localhost:3000/organizations
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});
// PROJECTS PAGE ROUTE
// When user visits http://localhost:3000/projects
// Service Projects route
// Service Projects route
// Projects route
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render('projects', { 
      title: 'Service Projects',
      projects: projects 
    });
  } catch (err) {
    console.error('Error retrieving projects:', err);
    res.status(500).send('Error retrieving projects');
  }
});
// CATEGORIES PAGE ROUTE - NEW!
// When user visits http://localhost:3000/categories
// This route follows the exact same pattern as the routes above
// This consistency makes the code predictable and maintainable
// Categories route
app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { 
      title: 'Service Project Categories',
      categories: categories 
    });
  } catch (err) {
    console.error('Error retrieving categories:', err);
    res.status(500).send('Error retrieving categories');
  }
});

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
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

// Listen on the specified PORT and start accepting requests
// The callback function runs once the server successfully starts
//this function was made asynchrounous and try catch logic was made with a waiting the test logic
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});