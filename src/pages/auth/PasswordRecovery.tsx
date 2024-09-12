import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import logo_aa from "@assets/img/logo-aasoftware.jpg";
import { toast } from "sonner";
import { RecoveryPasswordDto } from "src/core/models/dtos/auth/recoveryPasswordDto";
import { useChangePasswordMutation } from "src/core/features/authServerApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authenticate, saveUserInfo } from "src/core/slices/auth/authSlice";

const PasswordRecovery: React.FC = () => {

    const [recoveryPassword] = useChangePasswordMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token, email } = useParams<string>()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm<RecoveryPasswordDto>()

    const password = watch("body.password")

    const submitForm = (data: RecoveryPasswordDto) => {
        const recoveryPasswordPromise = recoveryPassword(data).unwrap()

        toast.promise(recoveryPasswordPromise, {
            loading: "Restableciendo contraseña...",
            success: (res) => {

                const userData = res.dataObject!

                localStorage.setItem("userData", JSON.stringify(userData))
                localStorage.setItem("auth", JSON.stringify(res.token))

                dispatch(saveUserInfo({
                    id: userData.id,
                    name: userData.name,
                    lastName: userData.lastName,
                    email: userData.email,
                    token: res.token!,
                    profileName: userData.profileName,
                }))

                dispatch(authenticate(true))

                navigate("/")
                return "Contraseña cambiada con éxito"
            },
            error: (err) => {
                console.log(err)
                return "Error al cambiar la contraseña"
            }
        })
    }

    useEffect(() => {
        setValue("token", token!)
        setValue("email", email!)
    }, [token])

    return (
        <main className="flex justify-center items-center bg-gray-100 bgwhite min-h-screen">
            <div className="flex flex-col bg-white rounded-lg shadowlg wfull md:w[85%] lg:w[75%] brder p-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
                    <img
                        src={logo_aa}
                        alt="Image login"
                        className="mb-5 mx-auto max-h-[38px]"
                    />
                    Acceso 614
                </h1>

                <div>
                    <form
                        onSubmit={handleSubmit(submitForm)}
                        className="w-full max-w-sm px-10"
                    >
                        <h3 className="text-3xl text-center font-medium mb-5 text-gray-500">
                            Reestablecer contraseña
                        </h3>

                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="text-lg"
                            >
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register('body.password', {
                                    required: 'La contraseña es requerida',
                                })}
                                className="w-full text-md placeholder-text-[#b1b1b1] placeholder-italic placeholder-font-light border-[1.5px] border-[#b1b1b1] p-2 rounded-md ring-0 focus:outline-none focus:border-gray-500"
                            />
                            {errors.body?.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.body?.password.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="validatePassword"
                                className="text-lg"
                            >
                                Confirmar contraseña
                            </label>
                            <input
                                type="validatePassword"
                                id="validatePassword"
                                {...register('body.validatePassword', {
                                    required: 'La confirmación de la contraseña es requerida',
                                    validate: (value) => 
                                        value === password || "Las contraseñas no coinciden",
                                })}
                                className="w-full text-md placeholder-text-[#b1b1b1] placeholder-italic placeholder-font-light border-[1.5px] border-[#b1b1b1] p-2 rounded-md ring-0 focus:outline-none focus:border-gray-500"
                            />
                            {errors.body?.validatePassword && (
                                <span className="text-red-500 text-sm">
                                    {errors.body?.validatePassword.message}
                                </span>
                            )}
                        </div>

                        <div className="mt-12">
                        <button type="submit" className="bg-black text-white block mx-auto px-10 py-2 font-medium rounded-lg mb-8">
                            Reestablecer contraseña
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default PasswordRecovery