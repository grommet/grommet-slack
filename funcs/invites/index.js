const fetch = require('node-fetch');

const token = process.env.SLACK_API_TOKEN;

if (!token) console.error('Missing SLACK_API_TOKEN');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.invites = (req, res) => {
  // TODO: restrict dynamically to v2.grommet.io and ???
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method === 'POST') {
    const { email } = req.body;
    console.log('invite', email);
    return fetch('https://grommet.slack.com/api/admin.users.invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        team_id: 'T04LMHMUT', // grommet
        channel_ids: 'C04LMHN59', // #general channel
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((result) => {
            console.log(result);
            if (result.ok) {
              res.status(201).send();
            } else {
              res.status(500).send(result.error);
            }
          });
        }
        return response.text().then((text) => {
          console.error(text);
          res.status(500).send(text);
        });
      })
      .catch((e) => res.status(500).send(e.message));
  }

  res.status(405).send();
};
