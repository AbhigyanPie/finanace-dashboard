import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            try {
                const response = await client.api.accounts["bulk-delete"]["$post"]({
                    json
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
            console.log('Account created successfully:', data);
            toast.success("Account deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            // TODO: Also invalidate summary
        },
        onError: (error) => {
            // Log the error for debugging purposes
            console.error('Error in onError:', error);
            toast.error("Failed to delete account: ");
        },
    });

    return mutation;
};
