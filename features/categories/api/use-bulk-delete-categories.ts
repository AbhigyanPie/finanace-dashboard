import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            try {
                const response = await client.api.categories["bulk-delete"]["$post"]({
                    json
                });
                
                // Log the response to inspect it
                console.log('API response:', response);

                if (!response.ok) {
                    // Log the error response if it's not OK
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Failed to delete category: ${errorText}`);
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
            console.log('Cateogory created successfully:', data);
            toast.success("Cateogory deleted");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            // Log the error for debugging purposes
            console.error('Error in onError:', error);
            toast.error("Failed to delete categories: ");
        },
    });

    return mutation;
};
