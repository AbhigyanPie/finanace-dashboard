import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { HTTPException } from "hono/http-exception";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { convertAmountFromMiliunits } from "@/lib/utils";


export const useGetSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        queryKey: ["summary",{ from, to, accountId }],
        queryFn: async () => {
            fetch("/api/accounts")
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });

            if(!response.ok){
                throw new Error("Failed to fetch Summary");
            }

            const { date } = await response.json();
            const data = date;
            
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                }))
            }
        },
    });
    return query;
};