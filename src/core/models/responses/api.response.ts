export interface ApiResponse<T> {
    message: string
    statusCode: number
    dataObject?: T,
    listDataObject?: T[]
}