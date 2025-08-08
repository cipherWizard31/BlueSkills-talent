import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>BlueSkills Talent</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
