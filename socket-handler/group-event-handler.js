import GroupController from '../controllers/group.controller';

export default class GroupEventHandler {
    static initEvent(socket) {
        socket.on('creatingGroup', async function(data, callback) {
            // Validation.
            // Call to controller.
            try {
                const group = await GroupController.addGroup({
                    user: socket.user,
                    body: data
                });
                return callback(null, group);
            } catch (e) {
                console.log(e);
                if (callback) {
                    return callback(e);
                }
            }
        });
    }

    static getActiveGroup(socket) {
        socket.on('loadingPage', async function(data, callback) {
            const groups = await GroupController.getActiveGroup('5c322728f5ac9c2724dd7855');
            if ( groups.length !== 0 ) {
                for (const item of groups) {
                    socket.join(item);
                } 
            }
        })
    }
}