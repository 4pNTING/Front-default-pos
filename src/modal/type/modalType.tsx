import { getDictionary } from "@/utils/getDictionary"

export type ModalFormProps = {
    handleClose: () => void,
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    lang: string,
}