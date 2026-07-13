import { promotingEnumStatus } from "./promotingEmunStatus";

export type COOCommentModel = {
    title: string;
    code: string;
    promoteCode: string,
}

export type COOFinalSalary = {
    finalSalary: number;
    editable: boolean;
}

export type COOFinalPosition = {
    finalPosition: string;
    editable: boolean;
}

export enum COOCommentStatus {
    ACCEPT_PENCENTAGE_UPGRADE = 'ACCEPT_PENCENTAGE_UPGRADE',
    ACCEPT_LEVEL_UPGRADE = 'ACCEPT_LEVEL_UPGRADE',
    ACCEPT_LEVEL_POSITION_UPGRADE = 'ACCEPT_LEVEL_POSITION_UPGRADE',
    ACCEPT_POSITION_EDIT_NUMBER_UPGRADE = 'ACCEPT_POSITION_EDIT_NUMBER_UPGRADE',
    ACCEPT_LEVEL_EDIT_POSITION_UPGRADE = 'ACCEPT_LEVEL_EDIT_POSITION_UPGRADE',
    EDIT_NUMBER_UPGRADE = 'EDIT_NUMBER_UPGRADE',
}


export const cooComments: COOCommentModel[] = [
    {
        title: "ເຫັນດີປັບຕາມເປີເຊັນ",
        code: COOCommentStatus.ACCEPT_PENCENTAGE_UPGRADE,
        promoteCode: promotingEnumStatus.PERCENT,
    },
    {
        title: "ເຫັນດີປັບຕາມຂັ້ນ",
        code: COOCommentStatus.ACCEPT_LEVEL_UPGRADE,
        promoteCode: promotingEnumStatus.LEVEL,
    },
    {
        title: "ເຫັນດີປັບຕາມຂັ້ນແລະຕໍາແໜ່ງ",
        code: COOCommentStatus.ACCEPT_LEVEL_POSITION_UPGRADE,
        promoteCode: promotingEnumStatus.POSITION,
    },
    {
        title: "ເຫັນດີປັບຕໍາແໜ່ງແຕ່ດັດແກ້ຕົວເລກ",
        code: COOCommentStatus.ACCEPT_POSITION_EDIT_NUMBER_UPGRADE,
        promoteCode: promotingEnumStatus.POSITION,
    },
    {
        title: "ເຫັນດີປັບຕາມຂັ້ນແຕ່ດັດແກ້ຕໍາແໜ່ງ",
        code: COOCommentStatus.ACCEPT_LEVEL_EDIT_POSITION_UPGRADE,
        promoteCode: promotingEnumStatus.LEVEL,
    },
    {
        title: "ດັດແກ້ຕົວເລກຕາມຄວາມເໝາະສົມ",
        code: COOCommentStatus.EDIT_NUMBER_UPGRADE,
        promoteCode: "",
    }
]