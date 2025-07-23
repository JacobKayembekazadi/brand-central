# Brand Central AI

> A guided, AI-powered web application serving as the central operating system for brands

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)
[![Google Gemini AI](https://img.shields.io/badge/Gemini%20AI-Powered-orange.svg)](https://ai.google.dev/)

## 🎯 Overview

Brand Central AI transforms abstract branding concepts into interactive, actionable modules. It provides a structured, phased approach to brand development from positioning to content execution and analytics, all powered by Google Gemini AI.

### ✨ Key Features

- **🎯 Guided Brand Development**: 10-phase structured workflow from positioning to analytics
- **🤖 AI-Powered Content Creation**: Leverages Google Gemini AI for content generation and brand validation
- **🛡️ Brand Guardian**: Ensures content alignment with brand guidelines
- **📊 L-M-A-I Framework**: Brand alignment scoring (Lifestyle, Moodboard, Association, Inspire)
- **💡 Smart Content Tools**: Idea generation, prompt engineering, and template-based content creation
- **🎨 Visual Identity Management**: Complete brand asset organization and management

## 🏗️ Architecture

Brand Central AI is built as a modern Single Page Application (SPA) with the following architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Gemini Service  │    │  Google Gemini  │
│                 │───▶│                  │───▶│      API        │
│  • Dashboard    │    │  • Content Gen   │    │                 │
│  • World Foundry│    │  • Brand Analysis│    │                 │
│  • Content Studio    │  • Validation    │    │                 │
│  • Distribution │    │  • Mock Fallback │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Browser Storage │
│  (Local Data)   │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd brand-central-ai
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Create environment file
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Getting Started

1. **Phase 0 - Positioning**: Define your target audience and brand positioning
2. **Phase 1 - World Bible**: Develop brand lore, timeline, and vocabulary
3. **Phase 2 - Visual Identity**: Establish colors, fonts, and visual elements
4. **Phase 3 - Content Pillars**: Define key content themes
5. **Phase 4 - Distribution Setup**: Configure content channels
6. **Phases 5-9**: Content creation, campaigns, community building, and analytics

### Core Modules

#### 🌍 World Foundry
- **Audience Architect**: Define customer pain points, dreams, and behaviors
- **Macro Fantasy Generator**: AI-generated brand positioning statements
- **World Bible Editor**: Brand lore, timeline, and vocabulary management
- **Visual Identity Kit**: Logo, colors, fonts, and icon management

#### 🎨 Content Studio
- **Idea Generator**: AI-powered content brainstorming
- **Prompt Engineer**: Refine and optimize content prompts
- **Template Generator**: Create content from structured templates
- **Brand Guardian**: Validate content against brand guidelines
- **Community Engagement**: AI-suggested community responses

#### 📊 Dashboard
- **Phase Navigator**: Track progress through brand development phases
- **North Star Metrics**: Monitor awareness, engagement, conversion, loyalty
- **L-M-A-I Check**: Brand alignment analysis tool
- **Activity Feed**: Real-time activity and AI task logging

## 🛠️ Development

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 19.1.0 + TypeScript | UI framework with type safety |
| **Build Tool** | Vite 6.2.0 | Fast development and building |
| **Routing** | React Router DOM 7.6.1 | Client-side navigation |
| **AI Integration** | Google Gemini AI | Content generation and analysis |
| **Storage** | Browser LocalStorage | Client-side data persistence |

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Project Structure

```
brand-central-ai/
├── components/
│   ├── dashboard/          # Dashboard widgets and metrics
│   ├── worldfoundry/       # Brand strategy components
│   ├── contentstudio/      # Content creation tools
│   ├── distribution/       # Distribution management
│   └── shared/             # Reusable UI components
├── services/
│   └── GeminiService.ts    # AI integration layer
├── types.ts                # TypeScript type definitions
├── constants.ts            # Application constants
└── App.tsx                 # Main application component
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# The app will use mock data if API key is not provided
```

### API Configuration

The application uses Google Gemini AI with the following configuration:
- **Model**: `gemini-2.5-flash-preview-04-17`
- **Fallback**: Automatic mock responses when API unavailable
- **Rate Limiting**: Handled by Google's service

## 📱 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Web Server**: Nginx, Apache

### Environment Setup

Ensure your deployment platform has the `GEMINI_API_KEY` environment variable configured.

## 🔒 Security & Privacy

- **Local Storage Only**: All user data stored locally in browser
- **No Server Storage**: Zero server-side data persistence
- **API Key Management**: Environment-based configuration
- **Brand Compliance**: Built-in content validation

## 📊 Features & Capabilities

### AI-Powered Features
- ✅ L-M-A-I Framework Analysis
- ✅ Macro Fantasy Generation
- ✅ Content Idea Generation
- ✅ Prompt Refinement
- ✅ Template-Based Content Creation
- ✅ Brand Guardian Validation
- ✅ Community Engagement Suggestions

### Brand Management
- ✅ Audience Profile Definition
- ✅ World Bible Development
- ✅ Visual Identity Management
- ✅ Competitive Analysis
- ✅ Phase-Based Workflow
- ✅ Activity Tracking

## 🎯 Success Metrics

- **Adoption**: Brands completing onboarding and using 3+ modules
- **Engagement**: Content items generated per user per week
- **Brand Consistency**: Content passing Brand Guardian validation
- **AI Utilization**: Users leveraging AI-powered features
- **Performance**: <2s load time, <5s AI response time

## 🚧 Roadmap & Future Enhancements

- [ ] Team collaboration features
- [ ] Cloud storage integration
- [ ] External platform integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Custom AI model training

## 📚 Documentation

- [📐 Architecture Document](./architectural_document.md) - Technical architecture and system design
- [📋 Product Requirements](./product_requirements_document.md) - Detailed feature specifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the architecture and PRD documents
- **Issues**: Report bugs and feature requests via GitHub Issues
- **API Issues**: Verify your Gemini API key configuration

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
