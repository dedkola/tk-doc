import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
        <span className="text-white font-bold text-sm tracking-tight">TK</span>
      </div>
      <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
        Docs
      </span>
    </div>
  );
};
