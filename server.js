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
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    console.log('Projects retrieved:', projects); // For testing
    res.render('projects', { projects: projects });
  } catch (err) {
    console.error('Error retrieving projects:', err);
    res.status(500).send('Error retrieving projects');
  }
});
// CATEGORIES PAGE ROUTE - NEW!
// When user visits http://localhost:3000/categories
// This route follows the exact same pattern as the routes above
// This consistency makes the code predictable and maintainable
app.get('/categories', async (req, res) => {
    // Title variable for the categories page
    // This will display in the browser tab and as the page header
    const title = 'Service Project Categories';
    
    // Render categories.ejs (the new file we created) with the title
    // categories.ejs will access this title with <%= title %>
    res.render('categories', { title });
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