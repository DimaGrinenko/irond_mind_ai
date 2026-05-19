export type CurrentUserPayload = {
    id: string;
    email: string;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
