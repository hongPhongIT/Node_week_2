import Authentication from '../middlewares/authentication';
import { ResponseHandler } from '../helper';

export default class AuthenticationHandler {
    static async initAuth(socket, next) {
        try {
            const { token } = socket.handshake.query;
            await Authentication.auth(
                {
                    socket,
                    query: {
                        token
                    }
                },
                null,
                next
            );
            return ResponseHandler.returnSuccess(null, 'Login Success');
        } catch (e) {
            return next(e);
        }
    }
}