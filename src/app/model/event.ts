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


