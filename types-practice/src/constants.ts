interface order {
    createdAt: string;
}

export const AUTH_TOKEN = 'auth-token';
export const LINKS_PER_PAGE = 5;


export const take: number = LINKS_PER_PAGE;
export const skip: number = 0;
export const orderBy: order = { createdAt: 'desc' };

