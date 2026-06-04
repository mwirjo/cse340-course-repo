// Import any needed model functions (none needed for home page)

// Define any controller functions
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// Export any controller functions
export { showHomePage };