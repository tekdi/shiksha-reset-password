import { toast } from "react-toastify";

// Define options for toast notifications
const options = {
  position: "bottom-center" as const,
  hideProgressBar: true,
  closeButton: false,
  autoClose: 3000,
  pauseOnHover: true, // Pause when user hovers over the toast
  draggable: true,
};

// Define the possible toast types
type ToastType = "success" | "error" | "info" | "warning";

// Define the showToastMessage function with appropriate typing
const showToastMessage = (message: string, type: ToastType = "success") => {
  const commonOptions = {
    ...options,
    style: {
      color: "#fff",
    },
  };

  switch (type) {
    case "error":
      toast.error(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#FF0000",
        },
      });
      break;
    case "success":
      toast.success(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#019722",
        },
      });
      break;
    case "info":
      toast.info(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#017AFF",
        },
      });
      break;
    case "warning":
      toast.warning(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#FFA500",
        },
      });
      break;
    default:
      throw new Error(`Unknown toast type: ${type}`);
  }
};

export default showToastMessage;
