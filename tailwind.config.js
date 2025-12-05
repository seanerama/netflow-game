/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Packet colors from spec
        'packet-http': '#3B82F6',
        'packet-https': '#2563EB',
        'packet-dns': '#F59E0B',
        'packet-email': '#10B981',
        'packet-file': '#8B5CF6',
        'packet-video': '#EC4899',
        'packet-attack': '#EF4444',
        'packet-blocked': '#6B7280',
        // Pipe colors
        'pipe-10mbps': '#9CA3AF',
        'pipe-100mbps': '#6B7280',
        'pipe-1gbps': '#4B5563',
        'pipe-10gbps': '#374151',
      },
      animation: {
        'flow': 'flow 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 0%' },
        },
      },
    },
  },
  plugins: [],
}
