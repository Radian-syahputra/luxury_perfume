import prisma from "../../config/prisma";


export const getNotificationService = async (userId : string) => {
    const notifications = await prisma.notification.findMany({
        where : {userId},
        orderBy : {
            createdAt : 'desc'
        }
    })

    return notifications
}

export const markAsReadService = async (userId : string, notificationId : string) => {
    const notification = await prisma.notification.findUnique({
        where : {id : notificationId}
    })

    if(!notification) {
        throw new Error('Notifikasi Tidak Di temukan')
    }

    if(notification.userId !== userId) {
        throw new Error("Akses Di Tolak")
    }

    const updated = await prisma.notification.update({
        where : {id : notificationId},
        data : {
            status : "READ"
        }
    })

    return updated
}


export const deleteNotificationService = async (userId : string, notificationId : string) => {
       const notification = await prisma.notification.findUnique({
        where : {id : notificationId}
    })

     if(!notification) {
        throw new Error('Notifikasi Tidak Di temukan')
    }

      if(notification.userId !== userId) {
        throw new Error("Akses Di Tolak")
    }

    await prisma.notification.delete({
        where : {id : notificationId}
    })

    return {message : "Berhasil  Menghapus Notifikasi"}
}


export const markAsReadAllService = async (userId : string) => {
    const readNotifications = await prisma.notification.updateMany({
        where : {userId},
        data : {
            status : 'READ'
        }
    })

    return readNotifications
}