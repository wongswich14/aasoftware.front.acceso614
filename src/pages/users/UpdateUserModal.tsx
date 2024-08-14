import { UserDto } from "src/core/models/dtos/users/userDto";
import { UserUpdateDto } from "src/core/models/dtos/users/userUpdateDto";

interface UpdateUserModalProps {
    toggleUpdateModal: () => void
    lazyUploadUser: (id: string, newItem: UserUpdateDto) => void
}


const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ }) => {
    return (
        <div>
            <h1>Update User Modal</h1>
        </div>
    );
}

export default UpdateUserModal;