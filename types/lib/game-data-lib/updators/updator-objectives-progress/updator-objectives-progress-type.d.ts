export type UpdatorObjectiveProgressType = {
    name: string;
    abbr: string;
    stage: number;
    progress: {
        header: string;
        values: Array<{
            value: string | number | boolean;
            success: boolean;
        }>;
    };
    scoredBy: Array<number>;
};
