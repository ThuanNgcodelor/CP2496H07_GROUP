import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { checkVnpayReturn } from "../../api/payment.js";

const VnpayReturnPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVnpayReturn = async () => {
      try {
        // Get all query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        urlParams.forEach((value, key) => {
          params[key] = value;
        });

        // Call payment service to verify and process return
        const response = await checkVnpayReturn(params);
        const status = response?.status;

        if (status === "PAID") {
          // Payment successful - show success message and redirect to orders
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your order has been created and payment completed successfully.",
            confirmButtonText: "View Orders",
            confirmButtonColor: "#ff6b35",
          });

          // Redirect to orders page (same as COD flow)
          navigate("/information/orders");
        } else {
          // Payment failed
          await Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Payment was not successful. Please try again.",
            confirmButtonText: "Back to Cart",
            confirmButtonColor: "#ff6b35",
          });

          // Redirect back to cart
          navigate("/cart");
        }
      } catch (error) {
        console.error("VNPay return error:", error);
        
        // Show error message
        await Swal.fire({
          icon: "error",
          title: "Payment Processing Error",
          text: error?.response?.data?.message || error?.message || "An error occurred while processing payment.",
          confirmButtonText: "Back to Cart",
          confirmButtonColor: "#ff6b35",
        });

        // Redirect back to cart
        navigate("/cart");
      }
    };

    handleVnpayReturn();
  }, [navigate]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Processing...</span>
      </div>
      <p>Processing payment result...</p>
    </div>
  );
};

export default VnpayReturnPage;

