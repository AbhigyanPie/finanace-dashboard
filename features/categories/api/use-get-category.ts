import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { HTTPException } from "hono/http-exception";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export const useGetCategory = (id?:string) => {
    const query = useQuery({
        enabled:!!id,
        queryKey: ["category",{id}],
        queryFn: async () => {
            fetch("/api/categories")
            const response = await client.api.categories[":id"].$get({
                param: {id},
            });

            if(!response.ok){
                throw new Error("Failed to fetch category");
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};