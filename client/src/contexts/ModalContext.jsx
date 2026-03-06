import React, { createContext, useState, useContext, useCallback } from 'react';
import SystemModal from '../components/SystemModal';

// Create the Context
const ModalContext = createContext();

// Create a custom hook to use the Modal Context
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: null,
        onCancel: null,
    });

    // A generic way to show a modal with a Promise
    const showModal = useCallback(({ type, title, message, confirmText = 'Confirm', cancelText = 'Cancel', showCancel = true }) => {
        return new Promise((resolve) => {
            setModalConfig({
                isOpen: true,
                type,
                title,
                message,
                confirmText,
                cancelText,
                // When confirmed, close modal and resolve with true
                onConfirm: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                // When cancelled or background clicked, close modal and resolve with false
                onCancel: showCancel ? () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                } : null, // If showCancel is false, we don't pass onCancel (which hides the cancel button and disables background click close in SystemModal)
            });
        });
    }, []);

    // Helpers
    const showAlert = useCallback(({ title, message, type = 'warning', confirmText = 'OK' }) => {
        // Alert only has a confirm button, no cancel.
        return showModal({ type, title, message, confirmText, showCancel: false });
    }, [showModal]);

    const showConfirm = useCallback(({ title, message, type = 'danger', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
        // Confirm has both confirm and cancel.
        return showModal({ type, title, message, confirmText, cancelText, showCancel: true });
    }, [showModal]);

    return (
        <ModalContext.Provider value={{ showModal, showAlert, showConfirm }}>
            {children}
            {/* The actual modal component is rendered once here at the root level */}
            <SystemModal {...modalConfig} />
        </ModalContext.Provider>
    );
};
