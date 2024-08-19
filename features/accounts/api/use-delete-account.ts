import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeletetAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            try {
                const response = await client.api.accounts[":id"]["$delete"]({
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
            console.log('Account deleted successfully:', data);
            toast.success("Account deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts",{id}] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["trasactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            // Log the error for debugging purposes
            console.error('Error in onError:', error);
            toast.error("Failed to delete account: ");
        },
    });

    return mutation;
};
