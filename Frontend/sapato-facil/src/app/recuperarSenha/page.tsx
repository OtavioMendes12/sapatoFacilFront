export default function recuperarSenha() {
    return (
        <div className="container justify-center mx-auto p-4">
            <div>
                <div>
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Recuperação de senha</h1>
                </div>
                <h3 className="text-center text-2xl">Para recuperar sua senha, enviaremos um link de recuperação para seu email</h3>
                <h2 className="text-center text-2xl">Digite o email cadastrado</h2>
            </div>

            <div className="justify-center mb-4">
                <br></br><label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 px-4 py-2"
                    required
                />
            </div>
            
            <button type="button" className="w-full mr-4 px-4 py-2 bg-gray-200 dark:bg-blue-500 rounded">
                Enviar
            </button>
        </div>

    );
}