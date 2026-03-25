import './globals.css';

export const metadata = {
  title: "Second Brain",
  description: 'Personal productivity dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
