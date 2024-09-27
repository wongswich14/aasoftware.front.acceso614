import {useForm} from "react-hook-form";
import {IoClose} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {
    useGetProfileQuery,
    useListPermissionsQuery,
    useUpdateProfileMutation
} from "src/core/features/profileServerApi";
import {ProfileUpdateDto} from "src/core/models/dtos/profiles/profileUpdateDto";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import Switcher from "src/shared/components/Switcher";
import {PermissionDto} from "src/core/models/dtos/permissions/permissionDto";
import LoaderBig from "src/shared/components/LoaderBig";
import {ScopeDto} from "../../core/models/dtos/scopes/scopeDto.ts";
import {useListScopesQuery} from "../../core/features/scopeServerApi.ts";

interface UpdateProfileModalProps {
    toggleUpdateModal: () => void
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({toggleUpdateModal}) => {
    const {id} = useParams<{ id: string }>();
    const [permissions, setPermissions] = useState<PermissionDto[]>();
    const [scopes, setScopes] = useState<ScopeDto[]>();

    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm<ProfileUpdateDto>();
    const selectedPermissions = watch('permissions', []);

    const {data: permissionData, isLoading: permissionIsLoading} = useListPermissionsQuery();
    const {data: scopesData, isLoading: scopesIsLoading} = useListScopesQuery();
    const {data: profileData, isLoading: profileLoading} = useGetProfileQuery(id ?? '');
    const [updateProfile] = useUpdateProfileMutation();

    const groupedPermissions = permissions?.reduce<Record<string, PermissionDto[]>>((acc, permission) => {
        const {resource} = permission;
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(permission);
        return acc;
    }, {});

    const handlePermissionChange = (permissionId: string, scopeId: string) => {
        const permissionExists = selectedPermissions.some((p) => p.permissionId === permissionId);
        if (permissionExists) {
            const updatedPermissions = selectedPermissions.map((p) =>
                p.permissionId === permissionId ? {...p, scopeId} : p
            );
            setValue('permissions', updatedPermissions);
        } else {
            const defaultScopeId = scopeId || scopes?.[0]?.id || '';
            const newPermission = {permissionId, scopeId: defaultScopeId};
            setValue('permissions', [...selectedPermissions, newPermission]);
        }
    };

    const submitForm = async (data: ProfileUpdateDto) => {
        const updateProfilePromise = updateProfile(data).unwrap();
        toast.promise(updateProfilePromise, {
            loading: 'Actualizando...',
            success: () => {
                navigate(`/profiles`);
                return 'Perfil actualizado';
            },
            error: (err) => {
                console.error(err);
                return 'Error al actualizar perfil';
            },
        });
    };

    useEffect(() => {
        if (!profileLoading && profileData && scopesData && !scopesIsLoading) {
            setValue("id", profileData.dataObject?.id || "");
            setValue("title", profileData.dataObject?.title || "");
            setValue("description", profileData.dataObject?.description || "");
            setValue("permissions", profileData.dataObject?.permissions?.map(p => ({
                permissionId: p.id,
                // Asignar scopeId, si no hay scope asignado usar el primero por defecto
                scopeId: p.scope?.id || scopesData.listDataObject?.[0]?.id || ''
            })) || []);
        }
    }, [profileLoading, profileData, scopesData, scopesIsLoading]);

    useEffect(() => {
        if (permissionData && !permissionIsLoading) {
            setPermissions(permissionData.listDataObject);
        }
    }, [permissionData, permissionIsLoading]);

    useEffect(() => {
        if (scopesData && !scopesIsLoading) {
            setScopes(scopesData.listDataObject);
        }
    }, [scopesData, scopesIsLoading]);

    if (profileLoading || permissionIsLoading || scopesIsLoading) return <LoaderBig message="Cargando datos..."/>;

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80vh] overflow-y-auto">
                <IoClose size={25} className="absolute top-5 right-5 cursor-pointer"
                         onClick={() => toggleUpdateModal()}/>
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Editar Perfil</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>
                    <div className="input-container">
                        <label htmlFor="title" className="label-form">Título</label>
                        <input type="text" id="title"
                               className="input-form" {...register('title', {required: 'Este campo es obligatorio'})} />
                        {errors.title && <span className="form-error">{errors.title.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="description" className="label-form">Descripción</label>
                        <textarea id="description" className="input-form resize-none"
                                  rows={2} {...register('description', {required: 'Este campo es obligatorio'})} />
                        {errors.description && <span className="form-error">{errors.description.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="permissions" className="label-form mb-3">Permisos</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ml-3">
                            {groupedPermissions && Object.entries(groupedPermissions).length > 0 ? (
                                Object.entries(groupedPermissions).map(([resource, permissions]) => (
                                    <div key={resource}>
                                        <h3 className="text-sm font-semibold mb-2 text-gray-600">{resource}</h3>
                                        {permissions.map((permission) => {
                                            const selectedPermission = selectedPermissions.find(
                                                (p) => p.permissionId === permission.id
                                            );

                                            const scopeId = selectedPermission?.scopeId || scopes?.[0]?.id || '';
                                            return (
                                                <div key={permission.id} className="mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Switcher
                                                            id={permission.id}
                                                            isChecked={!!selectedPermission}
                                                            onChange={() => handlePermissionChange(permission.id, scopeId)}
                                                        />
                                                        <label className="text-gray-600"
                                                               htmlFor={permission.id}>{permission.translation}</label>
                                                        <select
                                                            value={scopeId}
                                                            onChange={(e) => handlePermissionChange(permission.id, e.target.value)}
                                                            className="rounded"
                                                            disabled={!selectedPermission}
                                                        >
                                                            {scopes?.map((scope) => (
                                                                <option
                                                                    value={scope.id}
                                                                    key={scope.id}
                                                                >{scope.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No hay permisos disponibles.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-5">
                        <button type="submit" className="submit-button">Guardar</button>
                        <button type="button" onClick={() => toggleUpdateModal()} className="cancel-button">Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </article>
    );
};


export default UpdateProfileModal