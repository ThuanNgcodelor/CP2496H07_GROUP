// Custom hook to automatically show/hide loading during async operations
import { useLoading } from '../contexts/LoadingContext';

export const useApiLoading = () => {
    const { showLoading, hideLoading } = useLoading();

    const withLoading = async (apiCall) => {
        showLoading();
        try {
            const result = await apiCall();
            return result;
        } finally {
            hideLoading();
        }
    };

    return { withLoading };
};
