export default function getRowsMatchingAge(rows: any[], age: number, column_age_name: string) {
    const matchingAgeRows = rows.filter((row: any) => {
        const range = row[column_age_name];
        const minMax = range.split("-");

        const min = parseInt(minMax[0]);
        const max = parseInt(minMax[1]); 
        if (age <= max && age >= min) {
            return row;
        }
    });
    
    return matchingAgeRows;
}