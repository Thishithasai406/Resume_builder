let currentTemplate = 1;
let currentSuggestions = {};
let profilePictureData = null;

// AI Knowledge Base
const aiKnowledgeBase = {
    // Skills database by role/industry
    skillsByRole: {
        'frontend': ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Vue.js', 'Angular', 'Sass/SCSS', 'Webpack', 'Git', 'Responsive Design', 'REST APIs', 'GraphQL', 'Jest', 'Redux'],
        'backend': ['Node.js', 'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Git', 'Redis', 'Microservices', 'API Design'],
        'fullstack': ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Git', 'AWS', 'Docker', 'REST APIs', 'HTML5', 'CSS3', 'TypeScript', 'Redux', 'Express.js'],
        'data': ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'Excel', 'Statistics', 'Machine Learning', 'Data Visualization'],
        'marketing': ['Google Analytics', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Adobe Creative Suite', 'HubSpot', 'Salesforce', 'A/B Testing', 'Google Ads', 'Facebook Ads', 'Marketing Automation'],
        'design': ['Adobe Creative Suite', 'Figma', 'Sketch', 'InVision', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Responsive Design'],
        'project': ['Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Microsoft Project', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Team Leadership', 'Communication', 'Problem Solving'],
        'sales': ['CRM Software', 'Salesforce', 'Lead Generation', 'Negotiation', 'Cold Calling', 'Email Outreach', 'Pipeline Management', 'Customer Relationship Management', 'Presentation Skills', 'Market Research'],
        'hr': ['HRIS', 'Workday', 'Recruitment', 'Employee Relations', 'Performance Management', 'Training & Development', 'Compensation & Benefits', 'Employment Law', 'Organizational Development'],
        'finance': ['Excel', 'Financial Modeling', 'SAP', 'QuickBooks', 'Financial Analysis', 'Budgeting', 'Forecasting', 'Risk Assessment', 'Investment Analysis', 'Accounting Principles', 'GAAP']
    },
    
    // Summary templates by role
    summaryTemplates: {
        'tech': 'Experienced {role} with {years}+ years developing scalable solutions and driving technical innovation. Proven expertise in {skills} with a track record of delivering high-quality projects on time. Passionate about clean code, best practices, and continuous learning.',
        'marketing': 'Results-driven {role} with {years}+ years creating impactful marketing campaigns that drive growth and engagement. Expert in {skills} with proven ability to increase brand awareness and generate qualified leads. Data-driven approach to optimization and ROI improvement.',
        'design': 'Creative {role} with {years}+ years designing user-centered digital experiences. Proficient in {skills} with a strong portfolio of successful projects. Combines aesthetic sensibility with usability principles to create engaging, accessible designs.',
        'management': 'Strategic {role} with {years}+ years leading cross-functional teams and driving organizational success. Expertise in {skills} with proven track record of improving efficiency and achieving business objectives. Strong communicator with experience managing stakeholders at all levels.',
        'sales': 'Top-performing {role} with {years}+ years exceeding sales targets and building lasting client relationships. Skilled in {skills} with consistent track record of revenue growth and customer retention. Expert at identifying opportunities and closing complex deals.',
        'finance': 'Detail-oriented {role} with {years}+ years providing financial insights that drive business decisions. Proficient in {skills} with experience in budgeting, forecasting, and financial analysis. Strong analytical skills with ability to communicate complex financial information clearly.'
    },
    
    // Action verbs for job descriptions
    actionVerbs: {
        'leadership': ['Led', 'Managed', 'Directed', 'Supervised', 'Coordinated', 'Orchestrated', 'Spearheaded', 'Mentored', 'Guided', 'Facilitated'],
        'achievement': ['Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Secured', 'Generated', 'Increased', 'Improved', 'Enhanced'],
        'technical': ['Developed', 'Implemented', 'Designed', 'Built', 'Created', 'Programmed', 'Configured', 'Optimized', 'Integrated', 'Automated'],
        'analysis': ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Identified', 'Diagnosed', 'Measured', 'Calculated', 'Forecasted'],
        'communication': ['Presented', 'Communicated', 'Collaborated', 'Negotiated', 'Consulted', 'Advised', 'Trained', 'Educated', 'Influenced', 'Persuaded']
    }
};

function handlePictureUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePictureData = e.target.result;
            const preview = document.getElementById('picturePreview');
            preview.innerHTML = `<img src="${profilePictureData}" alt="Profile Picture">`;
            updatePreview();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function detectRole(jobDescription) {
    const text = jobDescription.toLowerCase();
    const roleKeywords = {
        'frontend': ['frontend', 'front-end', 'react', 'vue', 'angular', 'javascript', 'html', 'css', 'ui developer'],
        'backend': ['backend', 'back-end', 'server', 'api', 'database', 'node.js', 'python', 'java', 'php'],
        'fullstack': ['fullstack', 'full-stack', 'full stack'],
        'data': ['data scientist', 'data analyst', 'machine learning', 'ai', 'analytics', 'data engineer', 'tableau', 'python data'],
        'marketing': ['marketing', 'digital marketing', 'seo', 'sem', 'social media', 'content marketing', 'brand'],
        'design': ['designer', 'ui/ux', 'graphic design', 'web design', 'user experience', 'figma', 'sketch'],
        'project': ['project manager', 'program manager', 'scrum master', 'agile', 'project management'],
        'sales': ['sales', 'business development', 'account manager', 'sales representative', 'sales manager'],
        'hr': ['human resources', 'hr', 'recruiter', 'talent acquisition', 'people operations'],
        'finance': ['finance', 'financial analyst', 'accountant', 'controller', 'cpa', 'financial planning']
    };
    
    for (const [role, keywords] of Object.entries(roleKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return role;
        }
    }
    return 'general';
}

function extractExperienceLevel(jobDescription) {
    const text = jobDescription.toLowerCase();
    if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('5+ years') || text.includes('7+ years')) {
        return '5-8';
    } else if (text.includes('mid-level') || text.includes('3+ years') || text.includes('4+ years')) {
        return '3-5';
    } else if (text.includes('junior') || text.includes('entry') || text.includes('1+ year') || text.includes('2+ years')) {
        return '1-3';
    }
    return '2-4';
}

function generateSummary() {
    const jobDesc = document.getElementById('jobDescription').value;
    if (!jobDesc.trim()) {
        alert('Please enter a job description first!');
        return;
    }
    
    const role = detectRole(jobDesc);
    const years = extractExperienceLevel(jobDesc);
    const roleTitle = document.getElementById('jobTitle').value || 'Professional';
    
    let template = aiKnowledgeBase.summaryTemplates[role] || aiKnowledgeBase.summaryTemplates['tech'];
    let skills = '';
    
    if (aiKnowledgeBase.skillsByRole[role]) {
        skills = aiKnowledgeBase.skillsByRole[role].slice(0, 3).join(', ');
    }
    
    const summary = template
        .replace('{role}', roleTitle)
        .replace('{years}', years)
        .replace('{skills}', skills);
    
    currentSuggestions.summary = summary;
    
    showSuggestions('Summary', `
        <div class="suggestion-item">
            <div class="suggestion-category">Generated Professional Summary:</div>
            <div>${summary}</div>
        </div>
    `);
}

function suggestSkills() {
    const jobDesc = document.getElementById('jobDescription').value;
    if (!jobDesc.trim()) {
        alert('Please enter a job description first!');
        return;
    }
    
    const role = detectRole(jobDesc);
    let skills = aiKnowledgeBase.skillsByRole[role] || aiKnowledgeBase.skillsByRole['tech'];
    
    // Extract skills mentioned in job description
    const jobWords = jobDesc.toLowerCase().split(/\s+/);
    const relevantSkills = skills.filter(skill => {
        return jobWords.some(word => word.includes(skill.toLowerCase()) || skill.toLowerCase().includes(word));
    });
    
    // Combine with top skills for the role
    const suggestedSkills = [...new Set([...relevantSkills, ...skills.slice(0, 8)])].slice(0, 12);
    
    currentSuggestions.skills = suggestedSkills;
    
    const skillsHTML = suggestedSkills.map(skill => 
        `<span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block;">${skill}</span>`
    ).join('');
    
    showSuggestions('Skills', `
        <div class="suggestion-item">
            <div class="suggestion-category">Recommended Skills:</div>
            <div style="margin-top: 10px;">${skillsHTML}</div>
        </div>
    `);
}

function enhanceExperience() {
    const jobDesc = document.getElementById('jobDescription').value;
    if (!jobDesc.trim()) {
        alert('Please enter a job description first!');
        return;
    }
    
    const role = detectRole(jobDesc);
    const verbs = [
        ...aiKnowledgeBase.actionVerbs.achievement,
        ...aiKnowledgeBase.actionVerbs.technical,
        ...aiKnowledgeBase.actionVerbs.leadership
    ];
    
    const examples = [
        `${verbs[0]} project deliverables 20% ahead of schedule while maintaining 99% quality standards`,
        `${verbs[1]} team productivity by 35% through implementation of agile methodologies and process improvements`,
        `${verbs[2]} scalable solutions serving 10,000+ users with 99.9% uptime and optimized performance`,
        `${verbs[3]} cross-functional collaboration between 3 departments, resulting in 25% faster project completion`,
        `${verbs[4]} key performance metrics by implementing data-driven strategies and continuous monitoring`
    ];
    
    currentSuggestions.experience = examples;
    
    const examplesHTML = examples.map(example => 
        `<div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; margin: 5px 0; border-left: 3px solid rgba(255,255,255,0.5);">• ${example}</div>`
    ).join('');
    
    showSuggestions('Job Descriptions', `
        <div class="suggestion-item">
            <div class="suggestion-category">Enhanced Job Description Examples:</div>
            <div style="margin-top: 10px;">${examplesHTML}</div>
            <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">💡 Tip: Use specific numbers and metrics to quantify your achievements!</div>
        </div>
    `);
}

function showSuggestions(title, content) {
    document.getElementById('suggestionContent').innerHTML = content;
    document.getElementById('aiSuggestions').style.display = 'block';
}

function applySuggestions() {
    if (currentSuggestions.summary) {
        document.getElementById('profile').value = currentSuggestions.summary;
    }
    
    if (currentSuggestions.skills) {
        // Clear existing skills and add suggested ones
        const skillsList = document.getElementById('skillsList');
        const existingSkills = skillsList.querySelectorAll('.list-item:not(:has(.add-btn))');
        existingSkills.forEach(item => item.remove());
        
        currentSuggestions.skills.forEach(skill => {
            const newSkill = document.createElement('div');
            newSkill.className = 'list-item';
            newSkill.innerHTML = `
                <input type="text" value="${skill}" class="skill-input">
                <button type="button" class="remove-btn" onclick="removeItem(this)">Remove</button>
            `;
            skillsList.insertBefore(newSkill, skillsList.querySelector('.add-btn'));
            newSkill.querySelector('input').addEventListener('input', updatePreview);
        });
    }
    
    if (currentSuggestions.experience) {
        // Add example to the first job description field
        const firstJobDesc = document.querySelector('.job-description');
        if (firstJobDesc && !firstJobDesc.value.trim()) {
            firstJobDesc.value = currentSuggestions.experience.slice(0, 3).join('\n• ');
            firstJobDesc.addEventListener('input', updatePreview);
        }
    }
    
    updatePreview();
    closeSuggestions();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = '✅ Suggestions applied successfully!';
    successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px; border-radius: 6px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
}

function closeSuggestions() {
    document.getElementById('aiSuggestions').style.display = 'none';
    currentSuggestions = {};
}

function selectTemplate(templateNumber) {
    // Update active template
    currentTemplate = templateNumber;
    
    // Update visual selection
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelectorAll('.template-option')[templateNumber - 1].classList.add('active');
    
    // Show/hide picture section based on template
    const pictureSection = document.getElementById('pictureSection');
    if (templateNumber === 3) { // Executive template
        pictureSection.style.display = 'block';
    } else {
        pictureSection.style.display = 'none';
    }
    
    // Hide all template contents
    for (let i = 1; i <= 5; i++) {
        const content = document.getElementById(`template${i}Content`);
        if (content) content.style.display = 'none';
    }
    
    // Show selected template and update class
    const resumeContainer = document.getElementById('resumeTemplate');
    resumeContainer.className = `template-${templateNumber}`;
    document.getElementById(`template${templateNumber}Content`).style.display = 'block';
    
    // Update preview
    updatePreview();
}

function updatePreview() {
    // Get form values
    const name = document.getElementById('fullName').value || 'JONATHAN PATTERSON';
    const title = document.getElementById('jobTitle').value || 'GRAPHIC DESIGNER';
    const phone = document.getElementById('phone').value || '123-456-7890';
    const email = document.getElementById('email').value || 'hello@reallygreatsite.com';
    const website = document.getElementById('website').value || 'www.reallygreatsite.com';
    const address = document.getElementById('address').value || '123 Anywhere St., Any City';
    const profile = document.getElementById('profile').value || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';
    
    // Update all templates
    for (let i = 1; i <= 5; i++) {
        const nameElement = document.getElementById(`previewName${i}`);
        const titleElement = document.getElementById(`previewTitle${i}`);
        const phoneElement = document.getElementById(`previewPhone${i}`);
        const emailElement = document.getElementById(`previewEmail${i}`);
        const websiteElement = document.getElementById(`previewWebsite${i}`);
        const addressElement = document.getElementById(`previewAddress${i}`);
        const profileElement = document.getElementById(`previewProfile${i}`);
        
        if (nameElement) {
            nameElement.textContent = (i === 1) ? name.toUpperCase() : name;
        }
        if (titleElement) {
            titleElement.textContent = (i === 1) ? title.toUpperCase() : title;
        }
        if (phoneElement) {
            phoneElement.textContent = i === 1 || i === 3 || i === 4 || i === 5 ? `📞 ${phone}` : phone;
        }
        if (emailElement) {
            emailElement.textContent = i === 1 || i === 3 || i === 4 || i === 5 ? `📧 ${email}` : email;
        }
        if (websiteElement) {
            websiteElement.textContent = i === 1 || i === 3 || i === 4 || i === 5 ? `🌐 ${website}` : website;
        }
        if (addressElement) {
            addressElement.textContent = i === 1 || i === 3 || i === 4 || i === 5 ? `📍 ${address}` : address;
        }
        if (profileElement) {
            profileElement.textContent = profile;
        }
    }
    
    // Update profile picture for template 3
    if (profilePictureData && currentTemplate === 3) {
        const profilePicture = document.getElementById('profilePicture3');
        profilePicture.innerHTML = `<img src="${profilePictureData}" alt="Profile Picture">`;
    }
    
    updateSkills();
    updateEducation();
    updateExperience();
    updateLanguages();
}

function updateSkills() {
    const skills = document.querySelectorAll('.skill-input');
    
    for (let i = 1; i <= 5; i++) {
        const skillsContainer = document.getElementById(`previewSkills${i}`);
        if (!skillsContainer) continue;
        
        let skillsHTML = '';
        skills.forEach(skill => {
            if (skill.value) {
                if (i === 2) {
                    skillsHTML += `
                        <div class="skill-item">
                            <div>${skill.value}</div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: 80%"></div>
                            </div>
                        </div>
                    `;
                } else if (i === 5) {
                    skillsHTML += `<div style="margin-bottom: 8px; font-size: 14px; font-weight: 500;">${skill.value}</div>`;
                } else {
                    skillsHTML += `<div style="margin-bottom: 8px; font-size: 14px; font-weight: 500;">${skill.value}</div>`;
                }
            }
        });
        
        skillsContainer.innerHTML = skillsHTML || '<div>Add your skills</div>';
    }
}

function updateEducation() {
    const educationItems = document.querySelectorAll('#educationList .list-item');
    
    for (let i = 1; i <= 5; i++) {
        const educationContainer = document.getElementById(`previewEducation${i}`);
        if (!educationContainer) continue;
        
        let educationHTML = '';
        educationItems.forEach(item => {
            const degree = item.querySelector('.education-degree')?.value || 'Your Degree';
            const institution = item.querySelector('.education-institution')?.value || 'Your Institution';
            const years = item.querySelector('.education-years')?.value || '2016-2018';
            const desc = item.querySelector('.education-description')?.value || 'Description here';
            
            if (i === 5) {
                educationHTML += `
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 700; color: #805ad5;">${degree}</div>
                        <div style="color: #4a5568; margin-bottom: 5px; font-weight: 500;">${institution}</div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${years}</div>
                        <div style="font-size: 14px; color: #666;">${desc}</div>
                    </div>
                `;
            } else if (i === 1 || i === 4) {
                educationHTML += `
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 700; color: ${i === 1 ? '#2d3748' : '#38a169'};">${degree}</div>
                        <div style="color: #4a5568; margin-bottom: 5px; font-weight: 500;">${institution}</div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${years}</div>
                        <div style="font-size: 14px; color: #666;">${desc}</div>
                    </div>
                `;
            } else if (i === 2) {
                educationHTML += `
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 700; color: #2e5cb8;">${degree}</div>
                        <div style="font-weight: 500;">${institution} — ${years}</div>
                        <div style="color: #666; font-size: 14px;">${desc}</div>
                    </div>
                `;
            } else if (i === 3) {
                educationHTML += `
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 700; color: #1a202c;">${degree}</div>
                        <div style="color: #4a5568; font-weight: 500;">${institution} | ${years}</div>
                        <div style="font-size: 14px; color: #666; margin-top: 5px;">${desc}</div>
                    </div>
                `;
            }
        });
        
        educationContainer.innerHTML = educationHTML;
    }
}

function updateExperience() {
    const experienceItems = document.querySelectorAll('#experienceList .list-item');
    
    for (let i = 1; i <= 5; i++) {
        const experienceContainer = document.getElementById(`previewExperience${i}`);
        if (!experienceContainer) continue;
        
        let experienceHTML = '';
        experienceItems.forEach(item => {
            const title = item.querySelector('.job-title-input')?.value || 'Job Title';
            const company = item.querySelector('.job-company')?.value || 'Company Name';
            const duration = item.querySelector('.job-duration')?.value || '2020-2022';
            const description = item.querySelector('.job-description')?.value || 'Job description here';
            
            const bulletPoints = description.split('\n').filter(line => line.trim()).map(line => {
                const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                return `<li>${cleanLine}</li>`;
            }).join('');
            
            if (i === 5) {
                experienceHTML += `
                    <div style="margin-bottom: 25px;">
                        <div class="job-title">${title}</div>
                        <div class="job-company">${company} <span class="job-date">${duration}</span></div>
                        <div class="job-description">
                            <ul>${bulletPoints}</ul>
                        </div>
                    </div>
                `;
            } else if (i === 1 || i === 4) {
                experienceHTML += `
                    <div style="margin-bottom: 25px;">
                        <div class="job-title">${title}</div>
                        <div class="job-company">${company} <span class="job-date">${duration}</span></div>
                        <div class="job-description">
                            <ul>${bulletPoints}</ul>
                        </div>
                    </div>
                `;
            } else if (i === 2) {
                experienceHTML += `
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 700; color: #2e5cb8;">${title}, ${company}</div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 5px; font-weight: 500;">${duration}</div>
                        <ul style="margin-left: 15px;">${bulletPoints}</ul>
                    </div>
                `;
            } else if (i === 3) {
                experienceHTML += `
                    <div style="margin-bottom: 25px;">
                        <div style="font-weight: 700; color: #1a202c; font-size: 18px;">${title}</div>
                        <div style="color: #4a5568; font-weight: 600; margin-bottom: 3px;">${company} | ${duration}</div>
                        <ul style="margin-left: 15px; margin-top: 8px;">${bulletPoints}</ul>
                    </div>
                `;
            }
        });
        
        experienceContainer.innerHTML = experienceHTML;
    }
}

function updateLanguages() {
    const languageItems = document.querySelectorAll('#languagesList .list-item');
    
    for (let i = 1; i <= 5; i++) {
        const languagesContainer = document.getElementById(`previewLanguages${i}`);
        if (!languagesContainer) continue;
        
        let languagesHTML = '';
        languageItems.forEach(item => {
            const name = item.querySelector('.language-name')?.value || 'Language';
            const level = item.querySelector('.language-level')?.value || 5;
            const percentage = (level / 5) * 100;
            
            const levelText = level === '5' ? 'Native' : level === '4' ? 'Fluent' : level === '3' ? 'Intermediate' : level === '2' ? 'Basic' : 'Beginner';
            
            if (i === 5) {
                const barColor = '#805ad5';
                languagesHTML += `
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 14px; margin-bottom: 6px; font-weight: 500;">${name}</div>
                        <div style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; background: ${barColor}; width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
            } else if (i === 1 || i === 4) {
                const barColor = i === 1 ? '#2d3748' : '#38a169';
                languagesHTML += `
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 14px; margin-bottom: 6px; font-weight: 500;">${name}</div>
                        <div style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; background: ${barColor}; width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
            } else {
                languagesHTML += `
                    <div style="margin-bottom: 8px; font-weight: 500;">
                        <div>${name} (${levelText})</div>
                    </div>
                `;
            }
        });
        
        languagesContainer.innerHTML = languagesHTML;
    }
}

// Add event listeners to all form elements
function addEventListeners() {
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', updatePreview);
    });
}

// Add skill
function addSkill() {
    const skillsList = document.getElementById('skillsList');
    const addBtn = skillsList.querySelector('.add-btn');
    
    const newSkill = document.createElement('div');
    newSkill.className = 'list-item';
    newSkill.innerHTML = `
        <input type="text" placeholder="Skill name" class="skill-input">
        <button type="button" class="remove-btn" onclick="removeItem(this)">Remove</button>
    `;
    
    skillsList.insertBefore(newSkill, addBtn);
    newSkill.querySelector('input').addEventListener('input', updatePreview);
}

// Add education
function addEducation() {
    const educationList = document.getElementById('educationList');
    const addBtn = educationList.querySelector('.add-btn');
    
    const newEducation = document.createElement('div');
    newEducation.className = 'list-item';
    newEducation.innerHTML = `
        <div class="form-group">
            <label>Degree</label>
            <input type="text" placeholder="Your Degree Name" class="education-degree">
        </div>
        <div class="form-group">
            <label>Institution</label>
            <input type="text" placeholder="Your Institution Name" class="education-institution">
        </div>
        <div class="form-group">
            <label>Years</label>
            <input type="text" placeholder="2016-2018" class="education-years">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea placeholder="Brief description..." class="education-description"></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeItem(this)">Remove</button>
    `;
    
    educationList.insertBefore(newEducation, addBtn);
    newEducation.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
}

// Add language
function addLanguage() {
    const languagesList = document.getElementById('languagesList');
    const addBtn = languagesList.querySelector('.add-btn');
    
    const newLanguage = document.createElement('div');
    newLanguage.className = 'list-item';
    newLanguage.innerHTML = `
        <div class="form-group">
            <label>Language</label>
            <input type="text" placeholder="Language name" class="language-name">
        </div>
        <div class="form-group">
            <label>Proficiency (1-5)</label>
            <input type="range" min="1" max="5" value="5" class="language-level">
        </div>
        <button type="button" class="remove-btn" onclick="removeItem(this)">Remove</button>
    `;
    
    languagesList.insertBefore(newLanguage, addBtn);
    newLanguage.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
}

// Add experience
function addExperience() {
    const experienceList = document.getElementById('experienceList');
    const addBtn = experienceList.querySelector('.add-btn');
    
    const newExperience = document.createElement('div');
    newExperience.className = 'list-item';
    newExperience.innerHTML = `
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" placeholder="Your Job Position" class="job-title-input">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" placeholder="Company name" class="job-company">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" placeholder="2020-2022" class="job-duration">
        </div>
        <div class="form-group">
            <label>Job Description (one point per line)</label>
            <textarea placeholder="• Achievement or responsibility&#10;• Another achievement&#10;• Key accomplishment" class="job-description"></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeItem(this)">Remove</button>
    `;
    
    experienceList.insertBefore(newExperience, addBtn);
    newExperience.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
}

// Remove item
function removeItem(button) {
    button.parentElement.remove();
    updatePreview();
}

// Download function
function downloadResume() {
    const template = document.getElementById('resumeTemplate');
    
    // Configure pdf options
    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };

    // Generate PDF
    html2pdf().set(opt).from(template).save();
}

// Initialize
addEventListeners();
updatePreview();
