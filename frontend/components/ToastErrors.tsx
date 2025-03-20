import {toast} from "sonner";


function showToastErrors(errorObj:any) {
    // Check if the input is an object
    if (!errorObj || typeof errorObj !== 'object') {
        toast.error("Error", {
            description: "An unexpected error occurred."
        });
        return;
    }

    // Iterate over each key in the error object
    Object.entries(errorObj).forEach(([key, value]) => {
        // Handle array of messages or single message
        const messages = Array.isArray(value) ? value : [value];

        messages.forEach((message) => {
            toast.error(`Error: ${key.replace(/_/g, ' ').toUpperCase()}`, {
                description: message,
            });
        });
    });
}

export default showToastErrors;