import MainNavigation from "@/components/MainNavigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNavigation />
      {children}
    </>
  );
} 