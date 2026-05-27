@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 4%;
    --foreground: 210 20% 92%;
    --card: 240 8% 7%;
    --card-foreground: 210 20% 92%;
    --border: 240 6% 14%;
    --input: 240 6% 14%;
    --ring: 217 91% 60%;
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 6% 12%;
    --secondary-foreground: 210 20% 80%;
    --muted: 240 6% 10%;
    --muted-foreground: 210 10% 50%;
    --accent: 240 6% 12%;
    --accent-foreground: 210 20% 92%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --radius: 0.625rem;

    /* Brand colors */
    --pilot-blue: #3b82f6;
    --pilot-blue-dim: #1d4ed8;
    --pilot-cyan: #06b6d4;
    --pilot-emerald: #10b981;
    --pilot-amber: #f59e0b;
    --pilot-rose: #f43f5e;
    --pilot-violet: #8b5cf6;
    --pilot-surface: #0f0f18;
    --pilot-surface-2: #13131e;
    --pilot-surface-3: #1a1a28;
    --pilot-border: #1f1f32;
    --pilot-border-bright: #2a2a40;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    background-color: var(--pilot-surface);
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--pilot-border-bright);
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3a3a56;
  }
}

@layer utilities {
  .pilot-surface {
    background-color: var(--pilot-surface-2);
    border: 1px solid var(--pilot-border);
  }

  .pilot-surface-3 {
    background-color: var(--pilot-surface-3);
    border: 1px solid var(--pilot-border);
  }

  .pilot-glow {
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15),
                0 4px 24px rgba(59, 130, 246, 0.08);
  }

  .text-gradient {
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  .animate-slide-in {
    animation: slide-in 0.2s ease-out forwards;
  }
}
