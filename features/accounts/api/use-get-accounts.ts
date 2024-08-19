import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { HTTPException } from "hono/http-exception";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            fetch("/api/accounts")
            const response = await client.api.accounts.$get();

            if(!response.ok){
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};