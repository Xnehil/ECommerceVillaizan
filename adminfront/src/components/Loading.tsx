import React from "react";
import "@/styles/loading.css";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm z-50">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
