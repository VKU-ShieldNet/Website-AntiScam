# Website-ShieldNet

A modern Angular 17 web application for analyzing URLs, messages, and files for potential security threats using AI-powered analysis.

## Features

- 🔍 **URL Analysis**: Check websites for potential threats and malicious content
- 💬 **Message Analysis**: Scan text messages for scam and fraudulent content
- 📁 **File Analysis**: Upload and analyze images, PDFs, and other files
- 🛡️ **Real-time Protection**: Get instant analysis results
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🆓 **Free to Use**: Completely free for all users

## Technology Stack

- **Framework**: Angular 17
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Forms (Template-driven)

## Color Scheme

The application uses a comprehensive color palette including:

- **Primary**: Purple (#724CDA) - Main brand color
- **Secondary**: Dark purple (#34324C) - Supporting color
- **Success**: Green (#40C58B) - Safe indicators
- **Warning**: Yellow (#F9BB00) - Warning indicators
- **Danger**: Red (#E14747) - Threat indicators
- **Info**: Blue (#2A88F4) - Information

All colors have 10 shade variations for flexible design.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Navigation header
│   │   ├── home/            # Main landing page
│   │   └── about/           # About page
│   ├── services/
│   │   └── analysis.service.ts  # API service for analysis
│   ├── app-routing.module.ts    # Route configuration
│   └── app.module.ts            # Main module
├── environments/
│   ├── environment.ts           # Development config
│   └── environment.prod.ts      # Production config
└── styles.css                   # Global styles & color scheme
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI 17

### Installation

1. Clone the repository:

```bash
cd /Users/huyphan/Documents/AntiScam/Website-ShieldNet
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API endpoint:
   - Update `src/environments/environment.ts` for development
   - Update `src/environments/environment.prod.ts` for production

### Development Server

Run the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build

Build the project for production:

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The application connects to the Agent-ShieldNet backend API. Configure the API URL in the environment files:

### Development

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:8000/api",
};
```

### Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: "https://api.shieldnet.com/api",
};
```

### API Endpoints

The application expects the following endpoints:

- `POST /api/analyze/url` - Analyze a URL

  ```json
  {
    "url": "https://example.com",
    "deepScan": false
  }
  ```

- `POST /api/analyze/message` - Analyze a text message

  ```json
  {
    "message": "Your message content here"
  }
  ```

- `POST /api/analyze/file` - Analyze a file (multipart/form-data)
  - Field name: `file`

### Expected Response Format

```json
{
  "status": "safe" | "warning" | "danger",
  "score": 85,
  "details": "Analysis description",
  "threats": ["Threat 1", "Threat 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "timestamp": "2025-11-24T23:00:00Z"
}
```

## Features in Detail

### URL Analysis

- Enter any URL to check for threats
- Optional deep scan mode for comprehensive analysis
- Real-time results with threat indicators

### Message Analysis

- Paste suspicious messages or content
- AI-powered scam detection
- Detailed threat breakdown

### File Analysis

- Support for images, PDFs, text files, and HTML
- Drag-and-drop file upload
- Malicious content detection

## Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Component-based architecture
- CSS variables for theming

### Adding New Features

1. Generate components: `ng generate component components/feature-name`
2. Generate services: `ng generate service services/service-name`
3. Update routing in `app-routing.module.ts`
4. Add to module in `app.module.ts`

## Phase 1 Complete ✅

This is Phase 1 of the project, which includes:

- ✅ Angular 17 setup
- ✅ Simple structure (Home + About pages)
- ✅ Color scheme implementation (no gradients, simple CSS variables)
- ✅ URL checking feature
- ✅ Message analysis feature
- ✅ File upload and analysis feature
- ✅ API service integration
- ✅ Responsive design
- ✅ Modern UI with animations

## Next Steps (Phase 2)

After merging this branch, Phase 2 will include:

- Enhanced UI/UX improvements
- Additional features
- Performance optimizations
- Testing implementation
- Deployment configuration

## License

This project is part of the AntiScam initiative.

## Support

For issues or questions, please contact the development team.
