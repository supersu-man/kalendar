import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Tag } from "./tag"

export type Event = {
    id: string
    date: string
    tag_id: string
    tag: Tag
    title: string
    description: string
}

export const defaultEventForm = () => {
    return new FormGroup({
        id: new FormControl(null as string | null),
        date: new FormControl(null as string | null, [Validators.required]),
        tag_id: new FormControl(null as string | null, [Validators.required]),
        title: new FormControl(null as string | null, [Validators.required]),
        description: new FormControl(null as string | null, [Validators.required])
    })
}

