import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

/**
 * Reusable delete confirmation dialog component
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to call when dialog is closed
 * @param {function} onConfirm - Function to call when delete is confirmed
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 */
function DeleteConfirmDialog({ open, onClose, onConfirm, title = "Löschen bestätigen", message = "Möchten Sie diesen Eintrag wirklich löschen?" }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Abbrechen
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
                    Löschen
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmDialog;
