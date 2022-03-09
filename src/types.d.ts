import { User } from "./components/user/user.model";

declare global{
    namespace Express {
        interface Request {
            user: any
        }
    }
}