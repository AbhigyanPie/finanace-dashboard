import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
 } from "@/components/ui/card";

import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountFromMiliunits, convertAmountToMiliunits } from "@/lib/utils";

// const dateFormat = "yyyy-MM-dd HH:mm:ss";
// const outputFormat = "MM/dd/yyyy";

const requiredOptions = [
    "amount",
    "date",
    "payee",
];

interface SelectedColumnState {
    [key: string]: string | null;
};

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
};

export const ImportCard = ({
    data,
    onCancel,
    onSubmit, 
} : Props) => {
    const [selectedColumn, setSelectedColumns] = useState<SelectedColumnState>({});

    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev};

            for(const key in newSelectedColumns){
                if(newSelectedColumns[key] === value ){
                    newSelectedColumns[key] = null;
                }
            }

            if(value === "skip"){
                value == null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    };

    const progress = Object.values(selectedColumn).filter(Boolean).length;

    const handleContinue = () =>{
        const getColumnIndex = (column: string) =>{
            return column.split("_")[1];
        };

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumn[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell,index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumn[`column_${columnIndex}`] ? cell : null;
                });

                return transformedRow.every((item) => item === null )
                    ? []
                    : transformedRow;
            }).filter((row) => row.length > 0),
        };

        console.log({ mappedData });
        
        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if(header !== null ){
                    acc[header] = cell;
                }

                return acc;
            },{});
        });

        // const formattedData = arrayOfData.map((item) => ({
        //     ...item,
        //     amount: convertAmountToMiliunits(parseFloat(item.amount)),
        //     date: format(parse(item.date,dateFormat, new Date()), outputFormat)
        // }));

        // // console.log({ formattedData });

        // onSubmit(formattedData);

        const formattedData = arrayOfData.map((item) => {
            let formattedDate;
            try {
                // Log the raw date for debugging
                console.log("Raw date:", item.date);
        
                // Define the correct date format
                const dateFormat = 'dd/MM/yyyy'; // Match the input date format
                const outputFormat = 'yyyy-MM-dd'; // Adjust this as needed
        
                // Parse the date with the given format
                const parsedDate = parse(item.date, dateFormat, new Date());
                
                // Log the parsed date for debugging
                console.log("Parsed date:", parsedDate);
        
                // Check if parsedDate is valid
                if (isNaN(parsedDate.getTime())) {
                    throw new Error('Invalid date');
                }
                
                // Format the parsed date
                formattedDate = format(parsedDate, outputFormat);
                
                // Log the formatted date for debugging
                console.log("Formatted date:", formattedDate);
                
            } catch (error) {
                console.error("Date parsing error:", error);
                formattedDate = null; // or some default date
            }
        
            // Return a new object with modified values
            return {
                ...item,
                amount: convertAmountToMiliunits(parseFloat(item.amount)),
                date: formattedDate
            };
        });
        console.log({formattedData});
        
        // Pass the formatted data to the onSubmit function
        onSubmit(formattedData);
    };

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                      Import Transaction
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                      <Button
                        onClick={onCancel} 
                        size="sm" 
                        className="w-full lg:w-auto">
                          Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={progress < requiredOptions.length}
                        onClick={handleContinue}
                        className="w-full lg:w-auto"
                      >
                        Continue ({progress} / {requiredOptions.length})
                      </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers = {headers}
                        body = {body}
                        selectedColumns = {selectedColumn}
                        onTableHeadSelectChange= {onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};