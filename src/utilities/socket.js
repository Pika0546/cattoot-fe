import { SOCKET_TYPE } from "../config"

export const sendMessage = (socket, type, data) => {
    socket.emit(type, data)
}