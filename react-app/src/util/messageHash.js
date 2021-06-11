
export default function messageHash(userId, friendId){
    return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}
