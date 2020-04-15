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
} from 'grommet';

const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/invites';
// const apiUrl = "http://localhost:8080/images";

const App = () => {
  const [busy, setBusy] = useState();
  const [message, setMessage] = useState();
  return (
    <Grommet full theme={grommet}>
      <Box fill justify="center" align="center" margin="large">
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
              .then(response => {
                if (response.ok) {
                  setMessage('Invited!');
                } else {
                  response.text().then(error => {
                    if (error === 'already_in_team')
                      setMessage('Already a member');
                    else setMessage(error);
                  });
                }
              })
              .then(() => setBusy(false));
          }}
        >
          <Paragraph>
            Enter an email address of someone you'd like to invite to the
            grommet slack channels.
          </Paragraph>
          <FormField label="email" name="email" required>
            <MaskedInput
              name="email"
              mask={[
                { regexp: /^[\w\-_.]+$/, placeholder: 'sample' },
                { fixed: '@' },
                { regexp: /^[\w]+$/, placeholder: 'my' },
                { fixed: '.' },
                { regexp: /^[\w]+$/, placeholder: 'com' },
              ]}
            />
          </FormField>
          <Button type="submit" label="Invite" disabled={busy} />
          {message && <Paragraph>{message}</Paragraph>}
        </Form>
      </Box>
    </Grommet>
  );
};

export default App;
