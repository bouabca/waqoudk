import { theme } from '@/lib/theme'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={theme.container}>{children}</div>;
}
