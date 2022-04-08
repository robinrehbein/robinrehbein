<svelte:head>
    <title>Login</title>
</svelte:head>

<h1>Login</h1>
<form method="POST" action="/login">
    <fieldset>
        <label for="email">Email</label>
        <input type="email" placeholder="user@email.net" name="email" />
        <label for="password">Password</label>
        <input type="password" placeholder="Your password" name="password" />
        <input class="button-primary" type="submit" value="Login" />
    </fieldset>
</form>

<p>Don't have an account?
    <a href="/signup">Signup</a>
</p>

<style lang="scss"></style>