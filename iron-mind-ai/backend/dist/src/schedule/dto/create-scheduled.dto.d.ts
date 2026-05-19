export declare class CreateScheduledDto {
    date: string;
    time?: string;
    title: string;
    programId?: string;
    notes?: string;
    repeatWeekdays?: number[];
    repeatWeeks?: number;
}
