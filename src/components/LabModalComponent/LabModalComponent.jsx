import React, { memo } from "react";

export const LabModalComponent = memo(({ htmlString }) => {
  return (
    <div 
      className="test-labs-modal-content" 
      dangerouslySetInnerHTML={{ __html: htmlString }} 
    />
  );
});