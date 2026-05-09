import React, { memo } from "react";

// 🛡️ THE SHIELD: This component will ONLY re-render if the HTML string actually changes
export const LabModalComponent = memo(({ htmlString }) => {
  return (
    <div 
      className="test-labs-modal-content" 
      dangerouslySetInnerHTML={{ __html: htmlString }} 
    />
  );
});