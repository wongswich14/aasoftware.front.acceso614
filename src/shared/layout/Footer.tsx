import logo from '@assets/img/logo-aasoftware.jpg';

const Footer = () => {
    return (
        <div className='p-3 flex items-center justify-center text-gray-500 font-semibold'>Desarrollado por <img src={logo} className='w-24 ml-3' />
        </div>
    )
}

export default Footer