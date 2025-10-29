export const metadata = {
  title: "LifeMap",
  description: "NDIS Personal Planning Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: "#ffffff",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#000"
      }}>
        {children}
      </body>
    </html>
  );
}
