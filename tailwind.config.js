/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
        'ac-azul': '#0A1C2B',        // Exemplo de azul escuro
        'ac-cinza': '#F0F2F5',       // Exemplo de cinza claro para o fundo
        'ac-amarelo': '#FFD700',   // Exemplo de amarelo para destaque
      }
    },
  },
  plugins: [],
}