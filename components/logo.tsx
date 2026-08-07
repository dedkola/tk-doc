import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-200">
        <span className="text-white font-bold text-sm tracking-tight">TK</span>
      </div>
      <span className="font-bold text-lg tracking-tight text-foreground">
        Docs
      </span>
    </div>
  );
};
