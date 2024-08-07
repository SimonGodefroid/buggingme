import { signInAuth0 } from '@/actions';
import { Button, Tooltip } from '@nextui-org/react';

export default function SignInAuth0Button({
  label = '(Company)',
  tooltip = 'Sign in with Auth0',
}: {
  label?: string;
  tooltip?: string;
}) {
  return (
    <Tooltip content={<span>{`${tooltip}`}</span>}>
      <form action={signInAuth0}>
        <Button type="submit" color="secondary" variant="bordered">
          {`Sign in ${label}`}
        </Button>
      </form>
    </Tooltip>
  );
}
