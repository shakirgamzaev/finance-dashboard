import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="h-[100px] bg-blue-600"></header>
      <div>{children}</div>
    </>
  );
}
