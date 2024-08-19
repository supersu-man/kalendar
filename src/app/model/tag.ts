import { FormGroup, FormControl, Validators } from "@angular/forms"

export type Tag = {
    id: string
    color: string
    name: string
}

export const defaultTagForm = () => {
    return new FormGroup({
        id: new FormControl(null as string | null),
        name: new FormControl(null as string | null, [Validators.required]),
        color: new FormControl('#000000' as string | null, [Validators.required])
    })
}