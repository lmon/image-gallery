export default function LoginLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Login page should NOT require authentication
  // This layout prevents the parent admin layout from applying
  return <>{children}</>
}
