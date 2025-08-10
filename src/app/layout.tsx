import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { theme } from "@/theme/theme";
import DevTools from "@/components/dev/DevTools";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Event Management Dashboard",
  description:
    "Manage your events efficiently with our comprehensive dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            <AuthProvider>
              <EventProvider>
                {children}
                <DevTools />
              </EventProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
