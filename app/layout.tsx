import "./globals.css";

export const metadata = {
  title: "Sha Muu — Sushi & Burmese Asian Fusion",
  description: "Order online from Sha Muu, 23 North 900 West, Salt Lake City.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
