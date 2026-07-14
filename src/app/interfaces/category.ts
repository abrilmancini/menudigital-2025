export interface Category {
    id: number;
    name: string;
    description: string;
    userId: number;
}

export interface NewCategory {
    name: string;
    description: string;
}