import express from 'express';

// Import controller functions for each page
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';


// Create a new router instance
// This router will handle all routes and be exported to server.js
const router = express.Router();

// Home page route
router.get('/', showHomePage);

// Organizations list page - shows all partner organizations
router.get('/organizations', showOrganizationsPage);

// Organization details page - shows a specific organization by ID
// :id is a route parameter that captures the organization ID from the URL
// For example: /organization/13 will pass 13 as req.params.id
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects list page - shows all service projects
router.get('/projects', showProjectsPage);
// Route for service project details page
router.get('/project/:id', showProjectDetailsPage);

// Categories list page - shows all service project categories
router.get('/categories', showCategoriesPage);
// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Test route to simulate a 500 server error (development use only)
router.get('/test-error', testErrorPage);

// Silence Chrome DevTools probe
router.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});
// Export the router to be used in server.js
export default router;