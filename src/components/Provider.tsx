"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Provider: FC<ChildrenProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Provider;
