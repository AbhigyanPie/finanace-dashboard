import { format } from "date-fns";
import {
    Tooltip,
    XAxis,
    AreaChart,
    Area,
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    CartesianGrid,
    Line
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";
import { BarChart as IconBarChart } from "lucide-react";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

export const LineVariant = ({data}: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart data = {data}>
                <CartesianGrid strokeDasharray = "3 3"/>
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(value,"dd MMM")}
                    style={{fontSize: "12px"}}
                    tickMargin={16}
                />
                <Tooltip content = {<CustomTooltip/>}/>
                <Line
                    dot={false}
                    dataKey= "income"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
                <Line
                    dot={false}
                    dataKey= "expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};