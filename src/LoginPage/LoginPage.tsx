export default function LoginPage() {
    return (
        <>
            <section>
                <h1>Muser</h1>
                <p>START YOUR GIG MANAGEMENT JOURNEY HERE</p>
            </section>
            <form>
                <label>Username</label>
                <input type="text" required/>
                <label>Password</label>
                <input type="password" required/>
                <button type="submit">Login</button>
            </form>
            <div>
                <p>DON'T HAVE A BAND? START <a>HERE</a></p>
            </div>
        </>
    );
}