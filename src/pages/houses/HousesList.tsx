import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const HousesList: React.FC = () => {
    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Casas</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nuevo</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 oerflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                        <tr>
                            <th>#</th>
                            <th className='text-left'>Nombre</th>
                            <th className='text-left'>Descripción</th>
                            <th className='text-left '>RFC</th>
                            <th className='text-left'>Pesona de referencia</th>
                            <th className='text-left'>Contacto</th>


                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {
                            //console.info(companies)
                            companies != null &&
                            companies.map((company, i) => (

                                < tr key={company.id} className="border-b  dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                    <td className='text-center whitespace-nowrap py-4 font-light'>{i + 1}</td>
                                    <td className='whitespace-nowrap py-4 font-light text-left'>{company.name}</td>
                                    <td className='whitespace-nowrap py-4 font-light text-left'>{company.description}</td>
                                    <td className='whitespace-nowrap py-4 font-light text-left'>{company.rfc}</td>
                                    <td className='whitespace-nowrap py-4 font-light text-left'>{company.personContact}</td>
                                    <td className='whitespace-nowrap py-4 font-light text-left'>{company.phoneContact}</td>
                                    <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                        <FaEdit className='text-sky-500 hover:text-sky-400' onClick={handleClick} />
                                        <FaTrash className='text-red-500 hover:text-red-400' onClick={() => handleDelete({ company })} />
                                    </td>

                                </tr>
                            ))

                        } */}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default HousesList;