import type { RequestHandler } from '@sveltejs/kit';

// export default async function postUser(event) {
export const post: RequestHandler = async (event) => {
    console.log(event)
    const contentType: string = event.request.headers.get('content-type');
    const req = contentType === 'application/json' ? await event.request.json() : contentType?.includes('form') ? await event.request.formData() : null
    if (!req) return { status: 400, body: { error: 'Incorrect input' } };
    // Handle FormData & JSON
    const input = {
        email: ('get' in req ? req.get('email') : req.email)?.toLowerCase().trim(),
        password: 'get' in req ? req.get('password') : req.password,
        'repeat-password':
            'get' in req ? req.get('repeat-password') : req['repeat-password']
    };
    if (!input.password || !input.email)
        return { status: 400, body: { error: 'Email & password are required' } };

    if (input.password !== input['repeat-password'])
        return { status: 400, body: { error: 'Passwords do not match' } };

    const user = { id: Math.random() * 10, email: input.email, password: input.password };

    return {
        status: 201,
        body: {
            user
        }
    };
}