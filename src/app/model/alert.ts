export class Alert {
    id?: String
    type?: AlertType
    message?: string
}

export enum AlertType {
    Success = 'success',
    Error = 'danger'
}