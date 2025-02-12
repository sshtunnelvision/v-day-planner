# Valentine's Date Planner

An AI-powered web application that helps you plan the perfect Valentine's Day date based on your partner's interests and your location.

## Features

- Location-based restaurant recommendations
- Personalized gift suggestions based on interests
- Detailed schedule planning
- Mobile-first responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- OpenAI API
- Tavily API for local search

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- pnpm package manager installed
- OpenAI API key
- Tavily API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd v-day-planner
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with your API keys:

```
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── page.tsx        # Main page
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── forms/         # Form components
│   └── suggestions/   # Suggestion display components
├── lib/               # Utility functions
│   ├── utils.ts       # Helper functions
│   └── api.ts         # API client functions
└── types/             # TypeScript types
    └── index.ts       # Shared types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
