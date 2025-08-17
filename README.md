# 🤖 AI-Powered Resume Builder

A beautiful, feature-rich personal resume building web application built with vanilla HTML, CSS, and JavaScript. Create your resume, choose from multiple templates, get AI-powered suggestions, and download a professional PDF with style!

## ✨ Features

*   **📄 Resume Crafting**
    *   **Live Preview**: Instantly see changes as you type.
    *   **Dynamic Sections**: Add and remove skills, education, experience, and languages on the fly.
    *   **PDF Export**: Download a high-quality PDF of your final resume.

*   **🤖 AI Assistant**
    *   **Smart Summary**: Generate a professional summary from a job description.
    *   **Skill Suggestions**: Get AI-based skill recommendations tailored to a role.
    *   **Experience Enhancer**: Improve your job descriptions with powerful action verbs.

*   **🎨 User Experience**
    *   **Multiple Templates**: Choose from 5 distinct designs (Classic, Modern, Executive, etc.).
    *   **Responsive Design**: A clean, modern UI that works on desktop, tablet, and mobile.
    *   **Intuitive Interface**: Easy-to-use forms and controls for a smooth experience.

## 🚀 Getting Started

### Prerequisites
*   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
*   No other dependencies or installations are required.

### Installation
1.  Clone or download the project repository.
2.  Open the `main.html` file in your web browser.
3.  Start building your resume!

## 📁 Project Structure

```
resume-builder/
├── main.html         # Main HTML structure and UI components
├── styles.css        # All styling, animations, and responsive design
├── main.js           # Application logic and functionality
└── README.md         # Project documentation
```

### File Descriptions
*   **main.html**: Contains the semantic HTML structure for the input forms, AI assistant controls, and the resume preview pane.
*   **styles.css**: Provides all the styling for the application, including the layout, form elements, and the five unique resume templates.
*   **main.js**: Houses the complete client-side logic, including DOM manipulation, real-time preview updates, template switching, AI feature implementation, and PDF generation via `html2pdf.js`.

## 🎮 How to Use

1.  **Fill in Your Details**: Use the form on the left to enter your personal information, work experience, skills, etc.
2.  **Select a Template**: Click on the template options to see which one best fits your style.
3.  **Use the AI Assistant (Optional)**: Paste a job description into the AI assistant text area and click the buttons to generate content.
4.  **Download**: Once you're happy with the result, click the "Download Resume" button.

## 🔧 Customization

*   **Adding New Templates**: To add a new template, you would need to:
    1.  Add a new template option in `main.html`.
    2.  Create the corresponding CSS styles for the new template in `styles.css`.
    3.  Update the template switching logic in `main.js` to handle the new template.
*   **Modifying AI Behavior**: The AI's knowledge base (skills, summary templates, action verbs) is located in `main.js` and can be expanded or modified.

## 🤝 Contributing

Contributions are always welcome! If you spot a bug, have an idea for improvement, or want to add a new feature, feel free to open an issue or submit a pull request.

## 🙏 Acknowledgments

*   Inspired by modern resume-building tools.
---
**Built with ❤️ using HTML, CSS, and JavaScript.**
