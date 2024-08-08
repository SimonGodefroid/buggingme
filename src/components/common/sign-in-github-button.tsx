import { signIn } from '@/actions';
import { Button, Tooltip } from '@nextui-org/react';

export default function SignInGitHubButton({
  label = '(Engineer)',
  tooltip = 'Sign in with Github',
}: {
  label?: string;
  tooltip?: string;
}) {
  return (
    <Tooltip content={<span>{`${tooltip}`}</span>}>
      <form action={signIn}>
        <Button type="submit" color="primary" variant="flat">
          {`Sign in ${label}`}
        </Button>
      </form>
    </Tooltip>
  );
}
