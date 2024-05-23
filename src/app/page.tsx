import React from "react";
import { Input } from "~/components/ui/input";

const Page: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-20">
      <form className="w-full max-w-sm">
        <Input
          type="text"
          placeholder="Get quizzed on..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
        />
      </form>
    </div>
  );
};

export default Page;
