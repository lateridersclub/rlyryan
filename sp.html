<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sarah Burton - Interactive Resume</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
        /* --- Base Styles & Theme Variables --- */
        :root {
            /* Default Theme: Lavender Bliss */
            --primary-glow: #d8b4fe; /* Lavender */
            --background-dark: #1e1b2e; /* Dark Purple */
            --background-card: #2a2540; /* Lighter Purple */
            --text-primary: #f3e8ff; /* Light Lavender */
            --text-secondary: #c0a8e0; /* Muted Lavender */
            --border-color: rgba(216, 180, 254, 0.4); 
            --gradient-start: rgba(216, 180, 254, 0.1);
            --gradient-end: rgba(126, 34, 206, 0.1);
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--background-dark);
            background-image: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
            color: var(--text-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
            font-size: 16px;
            transition: background-color 1.5s ease;
        }

        /* --- Entry Animation --- */
        @keyframes fadeIn {
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- Widget Container --- */
        .resume-widget {
            background: var(--background-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 0; /* Remove padding to allow header to span full width */
            max-width: 600px;
            width: 100%;
            box-shadow: 0 0 15px var(--border-color), 0 10px 30px -15px #000;
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.8s ease-out 0.2s forwards;
            transition: background-color 1.5s ease, border-color 1.5s ease, box-shadow 1.5s ease;
        }
        
        /* --- Click-to-Copy Tooltip --- */
        .copy-feedback {
            position: fixed; /* Use fixed to position relative to viewport */
            background-color: var(--primary-glow);
            color: var(--background-dark);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 600;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            white-space: nowrap;
            z-index: 1000;
        }
        
        .copy-feedback.show {
            opacity: 1;
            transform: translate(-50%, -25px);
        }

        /* --- Clickable Items --- */
        [onclick] {
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            border-radius: 4px;
        }
        
        .section-content [onclick]:hover {
            background-color: rgba(255, 255, 255, 0.05);
            transform: scale(1.01);
        }

        /* --- Header --- */
        .header {
            text-align: center;
            padding: 2rem 2rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            transition: border-color 1.5s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
        }

        .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 3px solid var(--primary-glow);
            object-fit: cover;
            box-shadow: 0 0 15px var(--primary-glow);
            transition: border-color 1.5s ease, box-shadow 1.5s ease;
        }

        .header h1 {
            font-family: 'Playfair Display', serif;
            color: var(--primary-glow);
            font-size: 2.5rem;
            margin: 0;
            text-shadow: 0 0 10px var(--primary-glow);
            transition: color 1.5s ease, text-shadow 1.5s ease;
        }

        .header p {
            color: var(--text-secondary);
            font-size: 1.1rem;
            margin: -0.5rem 0 0;
            font-weight: 600;
            transition: color 1.5s ease;
        }
        
        /* --- Contact Actions Bar --- */
        .contact-actions {
            display: flex;
            justify-content: space-around;
            background-color: rgba(0,0,0,0.2);
            padding: 0.75rem 0;
        }

        .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 600;
            transition: color 0.3s ease, transform 0.3s ease;
        }
        
        .action-item:hover {
            color: var(--primary-glow);
            transform: translateY(-3px);
        }

        .action-item svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }


        /* --- Sections --- */
        .section-content {
            padding: 1.5rem 2rem 2rem;
        }
        .section-title {
            font-family: 'Playfair Display', serif;
            color: var(--primary-glow);
            font-size: 1.4rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
            transition: color 1.5s ease, border-color 1.5s ease;
        }

        /* --- Profile & Skills --- */
        .profile-text { color: var(--text-secondary); line-height: 1.6; transition: color 1.5s ease; }
        
        .skills-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.6rem; }
        
        .skill-tag {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 1.5s ease;
        }
        
        .skill-tag:hover {
            background-color: var(--primary-glow);
            color: var(--background-dark);
            transform: translateY(-3px) scale(1.05);
        }

        /* --- Work Experience --- */
        .job {
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-left: 3px solid var(--border-color);
            transition: all 1.5s ease;
        }

        .job:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-left-color: var(--primary-glow);
        }

        .job-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0; transition: color 1.5s ease; }
        .job-company { color: var(--text-secondary); font-weight: 600; transition: color 1.5s ease; }
        .job-company a { color: var(--text-secondary); text-decoration: none; transition: color 0.3s ease; }
        .job-company a:hover { color: var(--primary-glow); }
        .job-date { font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem; transition: color 1.5s ease; }
        
    </style>
</head>
<body>

    <div class="resume-widget" id="resume-content">
        <!-- Header -->
        <header class="header">
             <!-- IMPORTANT: Replace the src with the direct URL to your photo -->
            <img src="https://i.imgur.com/AJqrij7.jpeg" alt="Sarah Burton" class="profile-pic" onclick="copyOnClick(this, 'Sarah Burton Photo')">
            <h1 onclick="copyOnClick(this, this.innerText)">Sarah Burton</h1>
            <p onclick="copyOnClick(this, this.innerText)">Seeking Package Handler Position in Panama City, FL</p>
        </header>

        <div class="contact-actions">
            <a href="tel:+18509600564" class="action-item" onclick="copyOnClick(this, '+1 (850) 960-0564')">
                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z"></path></svg>
                <span>Call</span>
            </a>
            <a href="mailto:sarah.sims4@gmail.com" class="action-item" onclick="copyOnClick(this, 'sarah.sims4@gmail.com')">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                <span>Email</span>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Youngstown,+FL" target="_blank" class="action-item" onclick="copyOnClick(this, 'Youngstown, FL')">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                <span>Location</span>
            </a>
        </div>

        <div class="section-content">
            <!-- Profile Section -->
            <section class="section">
                <h2 class="section-title">PROFILE</h2>
                <p class="profile-text" onclick="copyOnClick(this, this.innerText)">
                    Proven success in fast-paced retail environments. Eager to transition my skills into logistics. Looking for a package handling role or similar position. A reliable and quick learner dedicated to accuracy and team success.
                </p>
            </section>

            <!-- Key Skills -->
            <section class="section">
                <h2 class="section-title">KEY ATTRIBUTES</h2>
                <ul class="skills-list">
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Reliable Transportation</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Fast-Paced Operations</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Efficient Task Management</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Inventory & Stocking</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Strong Work Ethic</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Quick Learner</li>
                    <li class="skill-tag" onclick="copyOnClick(this, this.innerText)">Good with Computers & Tech</li>
                </ul>
            </section>

            <!-- Work Experience -->
            <section class="section">
                <h2 class="section-title">EXPERIENCE</h2>
                <div class="job" onclick="copyOnClick(this, this.innerText)">
                    <h3 class="job-title">Shift Lead Cashier</h3>
                    <p class="job-company">
                        360 Fuel Store
                        <a href="tel:+18504811290" title="Call 360 Fuel Store">✨ (850) 481-1290</a>
                    </p>
                    <p class="job-date">May 2024 - Present</p>
                </div>
                <div class="job" onclick="copyOnClick(this, this.innerText)">
                    <h3 class="job-title">Barista / Cashier</h3>
                    <p class="job-company">
                        Dunkin' Donuts
                         <a href="tel:+18504811392" title="Call Dunkin' Donuts (Panama City)">✨ (850) 481-1392</a>
                    </p>
                    <p class="job-date">Jan 2023 - May 2024</p>
                </div>
            </section>
        </div>
    </div>

    <script>
        const themes = [
            { // Lavender Bliss
                '--primary-glow': '#d8b4fe', '--background-dark': '#1e1b2e', '--background-card': '#2a2540',
                '--text-primary': '#f3e8ff', '--text-secondary': '#c0a8e0', '--border-color': 'rgba(216, 180, 254, 0.4)',
                '--gradient-start': 'rgba(216, 180, 254, 0.1)', '--gradient-end': 'rgba(126, 34, 206, 0.1)'
            },
            { // Rose Gold Serenity
                '--primary-glow': '#fecaca', '--background-dark': '#431414', '--background-card': '#572222',
                '--text-primary': '#fee2e2', '--text-secondary': '#fca5a5', '--border-color': 'rgba(254, 202, 202, 0.4)',
                '--gradient-start': 'rgba(254, 202, 202, 0.1)', '--gradient-end': 'rgba(159, 18, 57, 0.1)'
            },
            { // Peach Dream
                '--primary-glow': '#fed7aa', '--background-dark': '#4a2511', '--background-card': '#64381b',
                '--text-primary': '#fff7ed', '--text-secondary': '#fdbf6f', '--border-color': 'rgba(253, 191, 111, 0.4)',
                '--gradient-start': 'rgba(253, 191, 111, 0.1)', '--gradient-end': 'rgba(217, 119, 6, 0.1)'
            },
             { // Minty Fresh
                '--primary-glow': '#a7f3d0', '--background-dark': '#064e3b', '--background-card': '#105c48',
                '--text-primary': '#d1fae5', '--text-secondary': '#6ee7b7', '--border-color': 'rgba(110, 231, 183, 0.4)',
                '--gradient-start': 'rgba(167, 243, 208, 0.1)', '--gradient-end': 'rgba(5, 150, 105, 0.1)'
            }
        ];
        
        let currentThemeIndex = 0;
        const root = document.documentElement;

        function changeTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];
            for (const [key, value] of Object.entries(newTheme)) {
                root.style.setProperty(key, value);
            }
        }
        
        setInterval(changeTheme, 7000); // Change theme every 7 seconds

        let feedbackTooltip = null;

        function showCopyFeedback(targetElement) {
            if (!feedbackTooltip) {
                feedbackTooltip = document.createElement('div');
                feedbackTooltip.className = 'copy-feedback';
                feedbackTooltip.textContent = 'Copied!';
                document.body.appendChild(feedbackTooltip);
            }

            const rect = targetElement.getBoundingClientRect();
            feedbackTooltip.style.left = `${rect.left + rect.width / 2}px`;
            feedbackTooltip.style.top = `${rect.top}px`; // Position at the top of the element
            
            feedbackTooltip.classList.add('show');
            setTimeout(() => {
                feedbackTooltip.classList.remove('show');
            }, 1000);
        }

        function copyOnClick(element, textToCopy) {
            // Prevent event from bubbling up to parent elements
            event.stopPropagation();
            
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy.trim();
            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            textArea.style.left = '-9999px';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showCopyFeedback(element);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }

            document.body.removeChild(textArea);
        }
    </script>
</body>
</html>






