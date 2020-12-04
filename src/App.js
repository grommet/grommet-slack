import React, { useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grommet,
  MaskedInput,
  Paragraph,
  grommet,
  Text,
  Heading,
  Grid,
  Image,
  ResponsiveContext,
} from 'grommet';

const channelCards = [
  { label: '# general' },
  { label: '# i-made-this' },
  { label: '# announcements' },
  { label: '# designer' },
  { label: '# help' },
  { label: '# typescript' },
];

const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/invites';

const App = () => {
  const [busy, setBusy] = useState();
  const [message, setMessage] = useState();

  return (
    <Grommet full theme={grommet}>
      <ResponsiveContext.Consumer>
        {(responsive) => (
          <Box
            justify="center"
            fill
            direction={responsive === 'large' ? 'row' : 'column'}
            pad="large"
          >
            <Box
              margin={responsive === 'large' ? 'large' : 'none'}
              height={responsive}
              width="fill"
              alignSelf="center"
            >
              <Image
                a11yTitle="Gremlin Image"
                fit="contain"
                src="Gremlin.svg"
              />
            </Box>
            <Box
              margin={responsive}
              width={responsive === 'large' ? '' : { max: 'large' }}
              alignSelf="center"
            >
              <Text>Sign up for our</Text>
              <Heading margin="none" size="large">
                Grommet Slack Channel
              </Heading>
              <Paragraph>
                Join to have access to the Grommet community to stay updated,
                receive troubleshooting and much more!
              </Paragraph>
              <Form
                onSubmit={({ value: { email } }) => {
                  setBusy(true);
                  const body = JSON.stringify({ email });
                  fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8',
                      'Content-Length': body.length,
                    },
                    body,
                  })
                    .then((response) => {
                      if (response.ok) {
                        setMessage('Invited!');
                      } else {
                        response.text().then((error) => {
                          if (error === 'already_in_team_invited_user')
                            setMessage('Already a member');
                          else if (error === 'invalid_email')
                            setMessage('Enter a valid email address');
                          else setMessage(error);
                        });
                      }
                    })
                    .then(() => setBusy(false));
                }}
              >
                <FormField label="Email" name="email" required>
                  <MaskedInput
                    a11yTitle="Email"
                    name="email"
                    mask={[
                      { regexp: /^[\w\-_.]+$/, placeholder: 'sample' },
                      { fixed: '@' },
                      { regexp: /^[\w]+$/, placeholder: 'email' },
                      { fixed: '.' },
                      { regexp: /^[\w]+$/, placeholder: 'com' },
                    ]}
                  />
                </FormField>
                {message && (
                  <Paragraph
                    margin="none"
                    color={
                      message === 'Invited!' ? 'status-ok' : 'status-error'
                    }
                  >
                    {message}
                  </Paragraph>
                )}
                <Button
                  margin={{ top: 'small' }}
                  primary
                  type="submit"
                  label="Join Community"
                  disabled={busy}
                />
              </Form>
              <Box margin={{ top: 'large' }}>
                <Heading level={2} margin="none">
                  Channels
                </Heading>
                <Paragraph margin="none">
                  Popular channels in our Slack community
                </Paragraph>
                <Grid
                  columns={
                    responsive === 'large'
                      ? { count: 2, size: 'small' }
                      : 'small'
                  }
                  gap="small"
                  rows="auto"
                  margin={{ top: 'small', bottom: 'large' }}
                >
                  {channelCards.map((item, i) => (
                    <Box key={i} round="small" background="light-2">
                      <Text margin="small">{item.label}</Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
};

export default App;
