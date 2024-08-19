import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            try {
                const response = await client.api.transactions[":id"]["$delete"]({
                    param: {id}
                });
                
                // Log the response to inspect it
                console.log('API response:', response);

                if (!response.ok) {
                    // Log the error response if it's not OK
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Failed to delete account: ${errorText}`);
                }

                return await response.json();
            } catch (error) {
                // Log the error for debugging purposes
                console.error('Error in mutation function:', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            // Log the successful data for debugging purposes
            console.log('Transaction deleted successfully:', data);
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({ queryKey: ["transaction",{id}] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            // Log the error for debugging purposes
            console.error('Error in onError:', error);
            toast.error("Failed to delete transaction: ");
        },
    });

    return mutation;
};
