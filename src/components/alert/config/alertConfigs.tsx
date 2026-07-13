import { MessageTypes } from "@/types/messageTypes";

export const getIconStatus = (status: MessageTypes) => {
    switch (status) {
        case MessageTypes.ERROR:
            return 'tabler-alert-square-rounded-filled text-xl text-red-500';
        case MessageTypes.SUCCESS:
            return 'tabler-rosette-discount-check-filled text-green-500';
        case MessageTypes.INFO:
            return 'tabler-info-square-rounded-filled text-blue-500';
        case MessageTypes.WARNING:
            return 'tabler-help-square-rounded-filled text-yellow-500';
        default:
            return 'tabler-info-square-rounded-filled text-blue-500';
    }
}

