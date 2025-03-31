document.addEventListener("DOMContentLoaded", function() {
    // Debugging: Log to ensure the script is running
    console.log("DOM fully loaded and parsed. Initializing navbar loader...");

    // Path to your navbar file - adjust if nav-loader.js or navbar.html are in subdirectories
    const navbarPath = './navbar.html'; // Ensure this path is correct relative to the HTML file

    // Debugging: Log the path being fetched
    console.log(`Fetching navbar from: ${navbarPath}`);

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Insert the navbar HTML into the placeholder
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                console.log("Navbar successfully loaded and inserted.");
                // After inserting, highlight the active link
                setActiveNavLink();
            } else {
                console.error("Navbar placeholder not found!");
            }
        })
        .catch(error => {
            console.error('Error fetching or loading navbar:', error);
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = '<p class="text-danger text-center">Error loading navigation bar.</p>';
            }
        });
});

function setActiveNavLink() {
    // Get the current page's path relative to the root
    const currentPagePath = window.location.pathname;

    // Find the placeholder where the navbar was loaded
    const navbarContainer = document.getElementById('navbar-placeholder');
    if (!navbarContainer) return;

    // Get all nav links and dropdown items within the loaded navbar
    const navLinks = navbarContainer.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return; // Skip if link has no href

        // Normalize the link's path (remove leading './')
        const normalizedLinkPath = linkHref.startsWith('./') ? linkHref.substring(1) : linkHref;

        // Check if the link's href matches the current page path
        // Use endsWith to handle potential differences in leading slashes or full paths vs relative paths
        // This check might need refinement depending on your exact URL structure
        if (currentPagePath.endsWith(normalizedLinkPath)) {

            // Add 'active' to the matched link/item
            link.classList.add('active');
            if(link.classList.contains('nav-link')) { // Add aria-current only to top-level links for clarity
                link.setAttribute('aria-current', 'page');
            }

            // If the active link is a dropdown item, also highlight the dropdown toggle
            const dropdownMenu = link.closest('.dropdown-menu');
            if (dropdownMenu) {
                const dropdownToggle = dropdownMenu.previousElementSibling;
                if (dropdownToggle && dropdownToggle.classList.contains('dropdown-toggle')) {
                    dropdownToggle.classList.add('active');
                }
            }
        } else {
             // Ensure other links are not active
             link.classList.remove('active');
             if(link.classList.contains('nav-link')) {
                link.removeAttribute('aria-current');
             }
        }
    });

     // Special case: If we are on the root page (e.g., "yoursite.com/") make 'Home' active
    if (currentPagePath === '/' || currentPagePath.endsWith('/index.html')) {
        const homeLink = navbarContainer.querySelector('.nav-link[href*="index.html"]');
         if(homeLink && !homeLink.classList.contains('active')) { // Check if not already active by previous logic
            // Deactivate any potentially wrongly activated link first
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.classList.contains('nav-link')) {
                    link.removeAttribute('aria-current');
                 }
            });
            // Activate home link
            homeLink.classList.add('active');
            homeLink.setAttribute('aria-current', 'page');
        }
    }
}