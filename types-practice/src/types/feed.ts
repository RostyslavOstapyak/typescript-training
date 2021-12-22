export interface feed {
    id?: string;
    count?: number;
    links: Link[];
}

export interface pageData {
    feed?: feed;
}

export interface User {
    id: string;
    name: string;
    email: string;
    links: Link[];
}

export interface Vote {
    id: string;
    link: Link;
    user: User;
}

export interface Link {
    id?: string;
    description?: string;
    url?: string;
    postedBy?: User;
    votes: Vote[];
    createdAt?: number | undefined;
}