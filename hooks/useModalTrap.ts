import React, { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const useModalTrap = (modalRef: React.RefObject<HTMLElement>, isOpen: boolean, onClose: () => void) => {
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = Array.from(modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)) as HTMLElement[];
      firstFocusableElement.current = focusableElements[0];
      lastFocusableElement.current = focusableElements[focusableElements.length - 1];
      
      // Focus the first element when the modal opens
      firstFocusableElement.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        // Handle Escape key
        if (e.key === 'Escape') {
          onClose();
        }

        // Handle Tab key for focus trapping
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement.current) {
              lastFocusableElement.current?.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastFocusableElement.current) {
              firstFocusableElement.current?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, modalRef, onClose]);
};
