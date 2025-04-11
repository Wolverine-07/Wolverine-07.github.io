// Analytics function to track user interactions
function initAnalytics() {
    // Track page view on initial load
    logPageView();
    
    // Track clicks on all elements
    document.addEventListener('click', function(e) {
        // Get the timestamp
        const timestamp = new Date().toISOString();
        
        // Get the event type (always "click" here)
        const eventType = "click";
        
        // Determine the object that was clicked
        let eventObject = getEventObject(e.target);
        
        // Log in the exact required format
        console.log(`${timestamp}, ${eventType}, ${eventObject}`);
    });
    
    // Function to log page views
    function logPageView() {
        const timestamp = new Date().toISOString();
        const eventType = "view";
        const eventObject = "page";
        
        // Log in the exact required format
        console.log(`${timestamp}, ${eventType}, ${eventObject}`);
    }
    
    // Helper function to determine event object type
    function getEventObject(element) {
        // First check for common UI elements
        if (element.tagName === 'SELECT' || element.closest('select')) {
            return "drop-down";
        } else if (element.tagName === 'IMG' || element.closest('img')) {
            return "image";
        } else if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
            return "text-input";
        } else if (element.tagName === 'TEXTAREA') {
            return "text-area";
        } else if (element.tagName === 'BUTTON' || element.closest('button')) {
            return "button";
        } else if (element.tagName === 'A' || element.closest('a')) {
            return "link";
        } else if (element.tagName === 'INPUT' && element.type === 'checkbox') {
            return "checkbox";
        } else if (element.tagName === 'INPUT' && element.type === 'radio') {
            return "radio-button";
        } else if (element.tagName === 'LABEL') {
            return "label";
        }
        
        // Check for specific elements on the website
        if (element.classList.contains('nav-button') || element.closest('.nav-button')) {
            return "navigation-button";
        } else if (element.classList.contains('theme-switch') || element.closest('.theme-switch')) {
            return "theme-toggle";
        } else if (element.classList.contains('interest-item') || element.closest('.interest-item')) {
            return "interest-tag";
        } else if (element.classList.contains('project-card') || element.closest('.project-card')) {
            return "project-card";
        } else if (element.classList.contains('course-badge') || element.closest('.course-badge')) {
            return "course-card";
        } else if (element.classList.contains('gallery-item') || element.closest('.gallery-item')) {
            return "gallery-item";
        } else if (element.classList.contains('contact-link') || element.closest('.contact-link')) {
            return "contact-button";
        } else if (element.classList.contains('download-btn') || element.closest('.download-btn')) {
            return "download-button";
        }
        
        // If it contains text, call it text
        if (element.textContent && element.textContent.trim() && 
            !element.children.length && 
            element.tagName !== 'HTML' && 
            element.tagName !== 'BODY') {
            return "text";
        }
        
        // Default to the element's tag name if nothing else matches
        return element.tagName.toLowerCase();
    }
    
    // Track page exit
    window.addEventListener('beforeunload', function() {
        const timestamp = new Date().toISOString();
        const eventType = "view";
        const eventObject = "page-exit";
        
        // Log in the exact required format
        console.log(`${timestamp}, ${eventType}, ${eventObject}`);
    });
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', initAnalytics);