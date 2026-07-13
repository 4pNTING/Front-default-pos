import { getDictionary } from "@/utils/getDictionary";
import { string } from "valibot";

export enum KPIStatus {
    PENDING = 'Pending',
    SAVE = 'Save',
    SEND_TO_REVIEW = 'Send to review',
    APPROVE = 'Approve',
    SELF_EVALUATE = 'Self evaluate',
    COMPLETED = 'Completed',
    REJECT = 'Reject',
    CANCEL = 'Cancel',
}

export enum KPIFinalStatus {
    PENDING = 'Pending',
    SEND_TO_REVIEW = 'Send to review',
    APPROVE = 'Approve',
    COMPLETED = 'Completed',
}

export enum KPIFinalRevertStatusCode {
    coo = 'COO',
    ceo = 'CEO',
}

export const KPIStatusColors: Record<KPIStatus, string> = {
    [KPIStatus.PENDING]: '#FF0000',
    [KPIStatus.SAVE]: '#A9A9A9',
    [KPIStatus.SEND_TO_REVIEW]: '#FF8000',
    [KPIStatus.APPROVE]: '#4CAF50',
    [KPIStatus.SELF_EVALUATE]: '#78B3CE',
    [KPIStatus.COMPLETED]: '#1F509A',
    [KPIStatus.REJECT]: '#FF0000',
    [KPIStatus.CANCEL]: '#FF0000',
};

export const KPIFinalStatusColors: Record<string, string> = {
    [KPIStatus.PENDING]: '#FF8000',
    [KPIStatus.SEND_TO_REVIEW]: '#FF8000',
    [KPIStatus.COMPLETED]: '#4CAF50',
    [KPIStatus.APPROVE]: '#78B3CE',
    [KPIStatus.CANCEL]: '#FF0000',
    [KPIStatus.SAVE]: '#1F509A',
};

export const getStatusColor = (status: KPIStatus): string => KPIStatusColors[status];
export const getFinalStatusColor = (status: KPIStatus): string => KPIFinalStatusColors[status];

const KPIStatusIcons: Record<KPIStatus, string> = {
    [KPIStatus.PENDING]: 'clock',
    [KPIStatus.SAVE]: 'bookmark-edit',
    [KPIStatus.SEND_TO_REVIEW]: 'send',
    [KPIStatus.APPROVE]: 'progress-check',
    [KPIStatus.SELF_EVALUATE]: 'edit',
    [KPIStatus.COMPLETED]: 'rosette-discount-check-filled',
    [KPIStatus.REJECT]: 'ban',
    [KPIStatus.CANCEL]: 'ban',
};

const KPIFinalStatusIcons: Record<string, string> = {
    [KPIStatus.PENDING]: 'clock-bolt',
    [KPIStatus.SEND_TO_REVIEW]: 'clock-bolt',
    [KPIStatus.COMPLETED]: 'rosette-discount-check-filled',
    [KPIStatus.APPROVE]: 'progress-check',
    [KPIStatus.CANCEL]: 'clock-bolt',
    [KPIStatus.SAVE]: 'clock-bolt',
};

// Function to Get Icon Name by KPIStatus
export const getKPIStatusIcon = (status: KPIStatus): string => {
    return KPIStatusIcons[status];
};

export const getFinalKPIStatusIcon = (status: KPIStatus): string => {
    return KPIFinalStatusIcons[status];
};

export const translateEnumStatus = ({ status, dic, approve }: { status: string, dic: Awaited<ReturnType<typeof getDictionary>>, approve?: boolean }): string => {
    switch (status) {
        case KPIStatus.PENDING:
            return dic.WaitingForForm;
        case KPIStatus.SAVE:
            return dic.savedToDraft;
        case KPIStatus.SEND_TO_REVIEW:
            return dic.WaitingForReview;
        case KPIStatus.APPROVE:
            return dic.WaitingForSelfEvaluate;
        case KPIStatus.SELF_EVALUATE:
            return dic.WaitingForAdviserEvaluate;
        case KPIStatus.COMPLETED:
            if (approve === true) {
                return dic.hrApproved;
            }
            return dic.completed;
        case KPIStatus.REJECT:
            return dic.rejected;
        case KPIStatus.CANCEL:
            return dic.cancelled;
        default:
            return dic.noStatus;
    }
}

export const translateFinalStatus = ({ status, dic }: { status: string, dic: Awaited<ReturnType<typeof getDictionary>> }): string => {
    switch (status) {
        case KPIStatus.PENDING:
            return dic.WaitingHRMReview;
        case KPIStatus.SEND_TO_REVIEW:
            return dic.WaitingCOOReview;
        case KPIStatus.APPROVE:
            return dic.WaitingCEOReview;
        case KPIStatus.COMPLETED:
            return dic.CEOApproved;
        case KPIFinalRevertStatusCode.ceo:
            return dic.rejectedByCEO;
        case KPIFinalRevertStatusCode.coo:
            return dic.rejectedByCOO;
        default:
            return dic.noStatus;
    }
}

export const translateKPIFinalRevertStatusCode = ({ status, dic }: { status: string, dic: Awaited<ReturnType<typeof getDictionary>> }): string => {
    switch (status) {
        case KPIFinalRevertStatusCode.ceo:
            return dic.rejectedByCEO;
        case KPIFinalRevertStatusCode.coo:
            return dic.rejectedByCOO;
        default:
            return dic.noStatus;
    }
}