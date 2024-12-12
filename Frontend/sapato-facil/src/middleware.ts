import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require admin access
const ADMIN_PATHS = [
    '/produtos/gerenciar',
    '/produtos/gerenciar/novo',
    '/produtos/gerenciar/editar',
    '/relatorios',
    '/pedidos/gerenciar',
    '/reestoque/gerenciar'
];

export function middleware(request: NextRequest) {
    const role = request.cookies.get('sapato-facil-role')?.value;
    const isAdminPath = ADMIN_PATHS.some(path => request.nextUrl.pathname.startsWith(path));

    if (isAdminPath) {
        if (!role || role !== 'ADMINISTRADOR') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
} 