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
                if (callback) {
                    return callback(e);
                }
            }
        });
    }

    static getActiveGroup(socket) {
        socket.on('joinGroup', async function(data, callback) {
            try {
                const groups = await GroupController.getActiveGroup({
                    params: {
                        id: data.id,
                    }
                });
                if ( groups.length !== 0 ) {
                    for (const item of groups) {
                        socket.join(item);
                    } 
                }
                return callback(null, groups); 
            } catch (e) {
                if (callback) {
                    return callback(e);
                }
            }
        })
    }
}