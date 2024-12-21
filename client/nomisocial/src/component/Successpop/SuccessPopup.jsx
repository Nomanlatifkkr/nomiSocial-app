import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";

const SuccessPopup = () => {
    const [open, setOpen] = useState(false);

    const showPopupHandler = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 3000); // Auto-hide after 3 seconds
    };

    return (
        <div>
            {/* Button to trigger the popup */}
            <Button
                variant="contained"
                color="success"
                onClick={showPopupHandler}
                style={{ margin: "20px" }}
            >
                Show Success
            </Button>

            {/* Snackbar for the popup */}
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "top", horizontal: "left" }} // Position: Top-Left
                onClose={() => setOpen(false)}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Success! Your action was completed.
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SuccessPopup;
