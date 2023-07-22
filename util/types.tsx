export interface User{
    id: number;
    userId: number;
    username: string;
    role: string;
    spots?: Spot[];
    likes: SpotIdList[];
    dislikes: SpotIdList[];
}

export interface Spot{
    id: number;
    name: string;
    image: string;
    description: string;
    lon: number;
    lat: number;
    likes: number;
    dislikes: number;
    user: User;
}

export interface SpotIdList{
    id: number;
}