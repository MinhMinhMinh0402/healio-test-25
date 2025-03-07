# Healio - Personal Health Platform

A modern health management platform that helps users track their health records, schedule appointments, and get AI-powered health insights.

## Live Demo

[View Demo](https://minhminhminh0402.github.io/healio-test-25/)

## Features

- 🏥 Health Records Management
- 🤖 AI-Powered Health Assistant
- 📅 Appointment Scheduling
- 👤 Personal Health Profile
- 📱 Responsive Design for all devices

## GitHub Pages Deployment

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/healio-test-25.git
cd healio-test-25
```

2. Install dependencies:
```bash
npm install
```

### Deployment Steps

1. Create a production build:
```bash
npm run build
```

2. Create a new branch for GitHub Pages if you haven't already:
```bash
git checkout -b gh-pages
```

3. Copy the built files to the root:
```bash
cp -r dist/* .
```

4. Update your GitHub repository settings:
- Go to Settings > Pages
- Source: Deploy from a branch
- Branch: gh-pages
- Folder: / (root)

5. Commit and push your changes:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

Your site will be available at: `https://[username].github.io/healio-test-25`

## Important Notes

- The application uses client-side routing with wouter
- All routes are prefixed with `/healio-test-25` when deployed to GitHub Pages
- Assets and API calls are configured to work with the GitHub Pages base path

## Tech Stack

- React + TypeScript
- Tailwind CSS
- shadcn/ui Components
- Vite
- React Query

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.