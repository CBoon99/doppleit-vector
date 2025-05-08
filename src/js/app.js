// Main application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up event listeners for all interactive elements
    setupEventListeners();
    
    // Initialize the canvas
    initializeCanvas();
    
    // Set up the color picker
    initializeColorPicker();
    
    // Initialize the layer system
    initializeLayers();
    
    // Set up the export system
    initializeExport();
    
    // Initialize settings
    initializeSettings();
}

function setupEventListeners() {
    // File upload handling
    const fileUpload = document.getElementById('file-upload');
    const browseButton = document.getElementById('browse-button');
    const uploadArea = document.getElementById('upload-area');

    browseButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', handleFileUpload);
    setupDragAndDrop(uploadArea);

    // Tool buttons
    const toolButtons = document.querySelectorAll('#drawing-tools button');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => selectTool(button.id));
    });

    // Color controls
    setupColorControls();

    // Export controls
    setupExportControls();

    // Layer controls
    setupLayerControls();

    // Settings controls
    setupSettingsControls();
}

function setupDragAndDrop(uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('highlight');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('highlight');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
}

function handleFileUpload(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Show loading message
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.classList.remove('hidden');

    // Process the file based on its type
    if (fileType === 'image/jpeg' || fileType === 'image/png') {
        processImage(file);
    } else if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
        processSVG(file);
    } else if (fileName.endsWith('.json') || fileName.endsWith('.dopple')) {
        loadProject(file);
    } else {
        showError('Unsupported file type. Please upload a JPG, PNG, SVG, or project file.');
    }
}

function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            showPreview(img);
            // Show canvas section
            document.getElementById('canvas-section').classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processSVG(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(e.target.result, 'image/svg+xml');
        if (svgDoc.documentElement.tagName === 'svg') {
            showPreview(svgDoc.documentElement);
            // Show canvas section
            document.getElementById('canvas-section').classList.remove('hidden');
        } else {
            showError('Invalid SVG file');
        }
    };
    reader.readAsText(file);
}

function loadProject(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const project = JSON.parse(e.target.result);
            // Load project data
            loadProjectData(project);
            // Show canvas section
            document.getElementById('canvas-section').classList.remove('hidden');
        } catch (error) {
            showError('Invalid project file');
        }
    };
    reader.readAsText(file);
}

function showPreview(content) {
    const preview = document.getElementById('file-preview');
    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');

    if (content instanceof HTMLImageElement) {
        // Draw image on canvas
        canvas.width = content.width;
        canvas.height = content.height;
        ctx.drawImage(content, 0, 0);
    } else if (content instanceof SVGElement) {
        // Convert SVG to image
        const svgData = new XMLSerializer().serializeToString(content);
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    preview.classList.remove('hidden');
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Initialize other components
function initializeCanvas() {
    // Canvas initialization code
}

function initializeColorPicker() {
    // Color picker initialization code
}

function initializeLayers() {
    // Layer system initialization code
}

function initializeExport() {
    // Export system initialization code
}

function initializeSettings() {
    // Settings initialization code
}

// Export the initialization function
export { initializeApp }; 