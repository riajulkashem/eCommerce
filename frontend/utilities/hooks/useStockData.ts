import {useEffect, useState} from "react";
import {Stock} from "@/utilities/types";
import {toast} from "sonner";
import {STOCK_ERROR_MESSAGES} from "@/utilities/contstants";
import {fetchStock} from "@/utilities/fetchUtils";

export const useStockData = () => {
    const [stockItems, setStockItems] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStock = async () => {
            try {
                setIsLoading(true);
                const data = await fetchStock();
                setStockItems(data);
            } catch (error) {
                console.error("Error fetching stock:", error);
                toast.error(STOCK_ERROR_MESSAGES.fetch);
            } finally {
                setIsLoading(false);
            }
        };
        loadStock();
    }, []);

    return {stockItems, isLoading, setStockItems}
}