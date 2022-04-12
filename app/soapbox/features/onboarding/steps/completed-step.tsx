import * as React from 'react';

import { Button, Card, CardBody, Icon, Stack, Text } from 'soapbox/components/ui';

const CompletedStep = ({ onComplete }: { onComplete: () => void }) => (
  <Card variant='rounded' size='xl'>
    <CardBody>
      <Stack space={2}>
        <Icon strokeWidth={1} src={require('@tabler/icons/icons/confetti.svg')} className='w-16 h-16 mx-auto text-primary-600' />

        <Text size='2xl' align='center' weight='bold'>
          Onboarding complete
        </Text>

        <Text theme='muted' align='center'>
          We are very excited to welcome you to our Truth Seeking
          community! Tap the button below to start enjoying
          Truth Social.
        </Text>
      </Stack>

      <div className='pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Stack justifyContent='center' space={2}>
          <Button
            block
            theme='primary'
            onClick={onComplete}
          >
            View Feed
          </Button>
        </Stack>
      </div>
    </CardBody>
  </Card>
);

export default CompletedStep;
