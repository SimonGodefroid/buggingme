import { signIn } from '@/actions';
import { Button, Tooltip } from '@nextui-org/react';

export default function SignInGitHubButton({
  label = 'Sign in (Engineer)',
  tooltip = 'Sign in with GitHub',
}: {
  label?: string;
  tooltip?: string;
}) {
  return (
    <Tooltip content={<span>{tooltip}</span>}>
      <form action={signIn}>
        <Button type="submit" color="primary" variant="flat">
          {label}
        </Button>
      </form>
    </Tooltip>
  );
}
