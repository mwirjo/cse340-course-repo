// Import any needed model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// Number of upcoming projects to display on the projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Shows the next 5 upcoming service projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Shows the details of a single service project
// Also fetches the categories for that project to display as tags
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    // Get all categories associated with this project
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Service Project Details';

    res.render('project', { title, project, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };