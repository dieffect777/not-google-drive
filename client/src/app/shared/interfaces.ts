export interface User {
  email: string,
  password: string
}

export interface Message {
  message: string
}

export interface FileI {
  name: string,
  fileSrc: string,
  ownerId?: string,
  _id?: string
}
