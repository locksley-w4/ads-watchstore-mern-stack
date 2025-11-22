import React, { useEffect } from "react";
import cls from "./Modal.module.css";

export default function Modal({
    className,
  headline,
  children,
  isVisible,
  setIsVisible,
  ...props
}) {
    
  return (
    <div className={`${cls.modalWrapper} ${className || ""} ${isVisible ? cls.active : ""}`} onClick={() => {setIsVisible(false)}}>
      <div className={cls.modalContainer} onClick={e => {e.stopPropagation()}}>
        {headline && <div className={cls.modalHeader}><h2>{headline}</h2></div>}
        <div className={cls.modalBody}>{children}</div>
      </div>
    </div>
  );
}
