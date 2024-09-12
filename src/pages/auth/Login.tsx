import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "src/core/features/authServerApi";
import LoaderBig from "src/shared/components/LoaderBig";
import logo_aa from "@assets/img/logo-aasoftware.jpg";
import { useState } from "react";
import { LoginDto } from "src/core/models/dtos/auth/loginDto";
import { useDispatch } from "react-redux";
import { saveUserInfo, authenticate } from "src/core/slices/auth/authSlice";
import { extractFetchErrorMessage } from "src/core/utils/extractFetchErrorMessage";

const Login: React.FC = () => {

  const [errorAlert, setErrorAlert] = useState<Boolean>(false);
  const [messageError, setMessageError] = useState<string>('')
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
} = useForm<LoginDto>();

const submitForm = async (data: LoginDto) => {
    try {
        setErrorAlert(false)
        const res = await login(data)

        if (res.error) {
            setErrorAlert(true);

            const message = extractFetchErrorMessage(res.error);

            setMessageError(message);
            throw new Error(message);
        }

        if (res.data?.statusCode === 404) {
            setErrorAlert(true);
            setMessageError('Credenciales incorrectas');
            return;
        }

        reset()
        const userData = res.data?.dataObject;

        if (!userData || !res.data?.token) {
            return;
        }

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('auth', JSON.stringify(res.data.token));

        dispatch(saveUserInfo({
            id: userData.id,
            name: userData.name,
            lastName: userData.lastName,
            email: userData.email,
            token: res.data.token,
            profileName: userData.profileName
        }));

        dispatch(authenticate(true));
        navigate('/');
    }
    catch (error) {
        console.error(error)
    }
};




  return (
    <main className="flex justify-center items-center bg-gray-100 bgwhite min-h-screen">
        {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                <LoaderBig message={'Espere...'} />
            </div>
        )}
        <div className="flex flex-col bg-white rounded-lg shadowlg wfull md:w[85%] lg:w[75%] brder">
            <div className="flex flex-col justify-center items-center p-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
                    <img
                        src={logo_aa}
                        alt="Image login"
                        className="w-2/4 mb-5 mx-auto"
                    />
                    Acceso 614
                </h1>
                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="w-full max-w-sm bg-white px-10 py8 rounded-lg"
                >
                    <h3 className="text-3xl text-center font-medium mb-5 text-gray-500">
                        Iniciar sesión
                    </h3>
                    <div className="mb-5">
                        {errorAlert && (
                            <div className="bg-red-500 text-white py-4 px-8 rounded-lg text-center">
                                <p className="text-lg">El usuario o contraseña son incorrectos.</p>
                            </div>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="text-lg">
                            Correo
                        </label>
                        <input
                            type="text"
                            placeholder="Escribe tu correo"
                            id="email"
                            className="w-full text-md placeholder-text-[#b1b1b1] placeholder-italic placeholder-font-light border-[1.5px] border-[#b1b1b1] p-2 rounded-md ring-0 focus:outline-none focus:border-gray-500"
                            {...register('email', {
                                required: 'Este campo es obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Dirección de correo electrónico inválida',
                                },
                            })}
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message as string}</span>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="text-lg">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="*****"
                            id="password"
                            className="w-full text-md placeholder-text-[#b1b1b1] placeholder-italic placeholder-font-light border-[1.5px] border-[#b1b1b1] p-2 rounded-lg ring-0 focus:outline-none focus:border-gray-500"
                            {...register('password', {
                                required: 'Este campo es obligatorio',
                            })}
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message as string}</span>}
                    </div>
                    <div className="mt-12">
                        <button type="submit" className="bg-black text-white block mx-auto px-10 py-2 font-medium rounded-lg mb-8">
                            Iniciar Sesión
                        </button>
                        <button className="block mx-auto">
                            <Link to="/password-recovery" className="cursor-pointer text-center hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
);
}

export default Login