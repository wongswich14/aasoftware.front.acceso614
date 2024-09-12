import logo_aa from "@assets/img/logo-aasoftware.jpg"
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSendMailRecoveryMutation } from "src/core/features/authServerApi";
import { RecoveryPasswordDto } from "src/core/models/dtos/auth/recoveryPasswordDto";
import { selectUserData } from "src/core/slices/auth/authSlice";
import { extractFetchErrorMessage } from "src/core/utils/extractFetchErrorMessage";
import { navigate } from "vite-plugin-ssr/client/router";

const ForgotPassword = () => {

    const [sendMail] = useSendMailRecoveryMutation()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<{ to: string }>()

    const submitForm = ( {to} : {to: string} ) => {
        const sendMailPromise = sendMail(to).unwrap()

        toast.promise(sendMailPromise, {
            loading: "Enviando correo...",
            success: () => {
                return "Correo enviado con éxito"
            },
            error: (err) => {
                const error = extractFetchErrorMessage(err)
                toast.error(error)
                console.log(err)    
                return "El correo no coincide con ninguna cuenta"
            }
        })
    }

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
                            Recuperación de cuenta
                        </h3>

                        <div className="mb-5">
                            <label
                                htmlFor="to"
                                className="text-lg"
                            >
                                Correo electrónico
                            </label>
                            <input
                                type="to"
                                id="to"
                                {...register('to', {
                                    required: 'El correo electrónico es requerido',
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                        message: 'El correo electrónico no es válido'
                                    }
                                })}
                                className="w-full text-md placeholder-text-[#b1b1b1] placeholder-italic placeholder-font-light border-[1.5px] border-[#b1b1b1] p-2 rounded-md ring-0 focus:outline-none focus:border-gray-500"
                            />
                            {errors.to && (
                                <span className="text-red-500 text-sm">
                                    {errors.to.message}
                                </span>
                            )}
                        </div>

                        <div className="mt-12">
                        <button type="submit" className="bg-black text-white block mx-auto px-10 py-2 font-medium rounded-lg mb-8">
                            Enviar correo
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword