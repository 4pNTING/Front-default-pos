import { MessageTypes } from "@/types/messageTypes";
import { getDictionary } from "@/utils/getDictionary";
import { ReactElement } from "react";

export interface CustomAlertProps {
    type?: MessageTypes,
    indicator?: ReactElement,
    title?: string,
    msg?: string,
    posText?: string,
    posIcon?: string,
    negText?: string,
    negIcon?: string,
    posClicked?: Function,
    negClicked?: Function,
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    id?: string,
    callBeforeOpen?: Function,
}