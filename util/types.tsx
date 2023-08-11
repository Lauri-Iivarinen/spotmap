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
    user?: User;
    comments: Comment[];
}

export interface SpotIdList{
    id: number;
}

interface Coords{
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude?: number;
    longitude?: number;
    speed?: number;
}

interface Comment{
    comment: string;
    user: User;
    spot?: Spot;
}

export interface LocationType{
    coords?: Coords;
    timestamp?: number;
}

