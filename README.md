<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CodeSathi - Interactive Coding Platform for Kids

CodeSathi is a gamified, interactive platform designed to teach children (ages 7-14) how to code through fun lessons and projects. Learn Scratch, Python, and JavaScript with an AI tutor, progress tracking, and reward systems.

## 🌟 Features

- **Multi-Track Learning**: Choose from Scratch (visual programming), Python (logic & data), or JavaScript (web development)
- **Gamified Experience**: Earn XP, maintain streaks, unlock badges, and complete challenges
- **AI-Powered Tutor**: Get personalized help with Sathi, our friendly AI assistant
- **Progress Tracking**: Monitor learning journey with detailed progress analytics
- **Interactive Lessons**: Learn through a 5-step pedagogical loop (Intro → Theory → Practice → Challenge → Celebrate)
- **Real Projects**: Build actual games and applications as you progress
- **Parent Dashboard**: Track your child's progress and achievements

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for authentication and database)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/taskboarddcell-ops/codesathi.git
   cd codesathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here

   # Gemini AI Configuration
   GEMINI_API_KEY=your-gemini-api-key-here

   # OpenRouter AI (Optional)
   VITE_OPENROUTER_API_KEY=your-openrouter-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting API Keys

- **Supabase**: Sign up at [https://supabase.com](https://supabase.com), create a project, and find your keys in Project Settings → API
- **Gemini API**: Get your key from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **OpenRouter** (Optional): Get your key from [https://openrouter.ai/keys](https://openrouter.ai/keys)

## 🏗️ Project Structure

```
codesathi/
├── components/          # React components
│   ├── Auth.tsx        # Authentication UI
│   ├── Onboarding.tsx  # User onboarding flow
│   ├── LessonPlayer.tsx # Interactive lesson interface
│   ├── TracksView.tsx  # Learning tracks dashboard
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication management
│   └── useUserData.ts  # User profile & progress
├── services/           # API and external services
│   ├── userService.ts  # User data operations
│   ├── geminiService.ts # AI tutor integration
│   └── sathiApi.ts     # Alternative AI provider
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client
│   └── errors.ts       # Custom error types
├── constants.ts        # App constants and lesson data
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Entry point
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Code Quality

The project uses:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling

### Build Optimization

Production builds are optimized with:
- **Code splitting** (React, Supabase, and UI icons separated)
- **Terser minification** (console.log removal in production)
- **Tree shaking** (unused code elimination)
- **Gzip compression** (5.94 kB CSS, 114.30 kB JS)

## 📊 Database Schema

The application uses Supabase with the following tables:

- **profiles**: User profile information (name, age, learning preferences)
- **progress**: Learning progress (XP, streak, completed lessons, badges)
- **lesson_completions**: Tracking of completed lessons

## 🔒 Security

- Environment variables for sensitive data (never committed)
- Supabase Row Level Security (RLS) for data protection
- Content Security Policy headers
- XSS protection enabled
- HTTPS enforced in production

## 🎨 Design System

- **Primary Color**: `#2F6BFF` (Blue)
- **Secondary Color**: `#FFC83D` (Yellow)
- **Success Color**: `#22C55E` (Green)
- **Error Color**: `#FF6B6B` (Coral)
- **Background**: `#F7F8FC`

Fonts:
- **Display**: Fredoka
- **Sans**: Nunito Sans
- **Monospace**: JetBrains Mono

## 📱 Responsive Design

CodeSathi is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Write TypeScript with proper types
- Add comments for complex logic
- Test your changes thoroughly
- Run `npm run lint` and `npm run format` before committing

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/) for backend
- AI features by [Google Gemini](https://ai.google.dev/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for young coders everywhere**

