import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Sparklines, SparklinesCurve } from 'react-sparklines';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';

import { shortNumberFormat } from '../utils/numbers';

import Permalink from './permalink';
import { HStack, Stack, Text } from './ui';

const Hashtag = ({ hashtag }) => {
  const count = Number(hashtag.getIn(['history', 0, 'accounts']));
  const brandColor = useSelector((state) => getSoapboxConfig(state).get('brandColor'));

  return (
    <HStack alignItems='center' justifyContent='between'>
      <Stack>
        <Permalink href={hashtag.get('url')} to={`/tags/${hashtag.get('name')}`} className='hover:underline'>
          <Text tag='span' size='sm' weight='semibold'>#{hashtag.get('name')}</Text>
        </Permalink>

        {hashtag.get('history') && (
          <Text theme='muted' size='sm'>
            <FormattedMessage
              id='trends.count_by_accounts'
              defaultMessage='{count} {rawCount, plural, one {person} other {people}} talking'
              values={{
                rawCount: count,
                count: <strong>{shortNumberFormat(count)}</strong>,
              }}
            />
          </Text>
        )}
      </Stack>

      {hashtag.get('history') && (
        <div className='w-[40px]'>
          <Sparklines
            width={40}
            height={28}
            data={hashtag.get('history').reverse().map(day => day.get('uses')).toArray()}
          >
            <SparklinesCurve style={{ fill: 'none' }} color={brandColor} />
          </Sparklines>
        </div>
      )}
    </HStack>
  );
};

Hashtag.propTypes = {
  hashtag: ImmutablePropTypes.map.isRequired,
};

export default Hashtag;
