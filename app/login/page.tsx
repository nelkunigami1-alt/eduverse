import { login } from './actions'
export default function Login(){return <main className="auth"><form action={login} className="card"><h1>Log in</h1><label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" required/></label><button className="button">Log in</button><p><a href="/signup">Create an account</a></p></form></main>}
