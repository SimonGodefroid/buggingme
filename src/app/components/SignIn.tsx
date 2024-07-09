import * as actions from '@/actions';

export function SignIn() {
  return (
    <>
      <form action={actions.signIn}>
        <button type="submit">Sign up</button>
      </form>
      <form action={actions.signIn}>
        <button type="submit">Logout</button>
      </form>
    </>
  );
}
