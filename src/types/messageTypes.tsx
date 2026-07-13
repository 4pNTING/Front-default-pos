export enum MessageTypes {
    SUCCESS,
    ERROR,
    WARNING,
    INFO
}

export interface MessageProps {
    msg: string;
    status: boolean;
    type: MessageTypes,
}